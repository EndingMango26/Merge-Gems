import { WORLD_IDS, type GameState, type WorldId, type WorldState, type Tile } from '../game/types';
import { RULES } from '../data/rules';

export const SAVE_KEY = 'merge-gems.save.v2';
export const BACKUP_KEY = 'merge-gems.save.previous';
const MAX_FILE_LENGTH = 256_000;
const MAX_DIGITS = RULES.maxCurrencyDigits;
const MAX_TIME = RULES.maxTimestampMs;

export class SaveError extends Error {
  constructor(public readonly code: string, cause?: unknown) {
    super(code, { cause });
    this.name = 'SaveError';
  }
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new SaveError('invalid-save');
  return value as Record<string, unknown>;
}
function integer(value: unknown, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < min || value > max) throw new SaveError('invalid-save');
  return value;
}
function amount(value: unknown): string {
  if (typeof value !== 'string' || value.length > MAX_DIGITS || !/^(0|[1-9][0-9]*)$/.test(value)) throw new SaveError('invalid-save');
  return value;
}
function worldId(value: unknown): WorldId {
  if (!WORLD_IDS.includes(value as WorldId)) throw new SaveError('invalid-save');
  return value as WorldId;
}
function tile(value: unknown): Tile | null {
  if (value === null) return null;
  const item = object(value);
  const rank = integer(item.rank, 0, RULES.maxRank);
  if (item.kind === 'crate') return { kind: 'crate', rank };
  if (item.kind === 'gem') return { kind: 'gem', rank, bornAt: integer(item.bornAt, 0, MAX_TIME) };
  throw new SaveError('invalid-save');
}
function world(value: unknown): WorldState {
  const item = object(value);
  if (!Array.isArray(item.cells) || item.cells.length !== RULES.maxCells || !Array.isArray(item.purchases) || item.purchases.length !== RULES.maxRank + 1) throw new SaveError('invalid-save');
  const cells = item.cells.map(tile);
  const maxRank = integer(item.maxRank, 0, RULES.maxRank);
  const level = integer(item.level, 1, RULES.maxLevel);
  if (cells.some((cell, index) => cell && (cell.rank > maxRank || index >= Math.min(RULES.maxCells, RULES.initialCells + level - 1)))) throw new SaveError('invalid-save');
  const incomeRemainder = amount(item.incomeRemainder);
  if (BigInt(incomeRemainder) >= BigInt(RULES.incomeIntervalMs)) throw new SaveError('invalid-save');
  return {
    coins: amount(item.coins), incomeRemainder, cells, maxRank,
    xp: integer(item.xp, 0, Number.MAX_SAFE_INTEGER), level,
    purchases: item.purchases.map(value => integer(value, 0, RULES.maxPurchasesPerRank)),
    nextCrateAt: integer(item.nextCrateAt, 0, MAX_TIME),
    lastAccruedAt: integer(item.lastAccruedAt, 0, MAX_TIME),
  };
}

/** Returns a detached, sanitized state. Throws instead of replacing invalid data. */
export function validateGame(value: unknown): GameState {
  const item = object(value);
  if (item.version !== 2) throw new SaveError('unsupported-version');
  if (typeof item.id !== 'string' || item.id.length < 1 || item.id.length > 120 || !/^[a-zA-Z0-9_-]+$/.test(item.id)) throw new SaveError('invalid-save');
  const settings = object(item.settings);
  if ((settings.language !== 'fr' && settings.language !== 'en') || typeof settings.sound !== 'boolean') throw new SaveError('invalid-save');
  const worlds = object(item.worlds);
  return {
    version: 2, id: item.id,
    revision: integer(item.revision, 0, Number.MAX_SAFE_INTEGER - 1),
    savedAt: integer(item.savedAt, 0, MAX_TIME),
    activeWorld: worldId(item.activeWorld),
    worlds: { gemland: world(worlds.gemland), moonland: world(worlds.moonland), aztecland: world(worlds.aztecland) },
    settings: { language: settings.language, sound: settings.sound },
    tutorialStep: integer(item.tutorialStep, 0, 10),
  };
}

/** v1 is this reconstruction's initial schema: same milli-coins, no revision/remainder. */
function migrate(value: unknown): GameState {
  const item = object(value);
  if (item.version === 1) {
    const worlds = object(item.worlds);
    const migratedWorlds = Object.fromEntries(WORLD_IDS.map(id => [id, { ...object(worlds[id]), incomeRemainder: '0' }]));
    return validateGame({ ...item, version: 2, revision: 0, worlds: migratedWorlds });
  }
  return validateGame(item);
}

export function importGame(text: string): GameState {
  if (text.length > MAX_FILE_LENGTH) throw new SaveError('file-too-large');
  let parsed: unknown;
  try { parsed = JSON.parse(text); } catch (error) { throw new SaveError('invalid-json', error); }
  const item = object(parsed);
  if (item.format === 'merge-gems-save') return migrate(item.game);
  return migrate(item);
}

export function exportGame(state: GameState): string {
  return JSON.stringify({ format: 'merge-gems-save', game: validateGame(state) }, null, 2);
}

export interface LoadResult { state: GameState | null; error?: string; recovered?: boolean }

/** A corrupt primary is preserved. A valid backup is reported for explicit restoration. */
export function loadGame(storage?: Storage): LoadResult {
  let primary: string | null;
  try { storage ??= globalThis.localStorage; primary = storage.getItem(SAVE_KEY); } catch { return { state: null, error: 'storage-unavailable' }; }
  if (primary === null) {
    try {
      const backup = storage.getItem(BACKUP_KEY);
      if (backup !== null) return { state: importGame(backup), error: 'missing-primary', recovered: true };
    } catch { return { state: null, error: 'invalid-save' }; }
    return { state: null };
  }
  try { return { state: importGame(primary) }; } catch (error) {
    const code = error instanceof SaveError ? error.code : 'invalid-save';
    try {
      const backup = storage.getItem(BACKUP_KEY);
      if (backup !== null) return { state: importGame(backup), error: code, recovered: true };
    } catch { /* Primary remains untouched even when the backup is invalid. */ }
    return { state: null, error: code };
  }
}

/** Compare revision before writing; never silently overwrite a newer tab's state. */
export function saveGame(state: GameState, storage?: Storage, options: { replace?: boolean } = {}): void {
  validateGame(state);
  if (state.revision >= Number.MAX_SAFE_INTEGER - 1) throw new SaveError('revision-exhausted');
  let previous: string | null;
  try { storage ??= globalThis.localStorage; previous = storage.getItem(SAVE_KEY); } catch (error) { throw new SaveError('storage-unavailable', error); }
  if (previous !== null && !options.replace) {
    let current: GameState;
    try { current = importGame(previous); } catch (error) { throw new SaveError('corrupt-primary', error); }
    if (current.id !== state.id || current.revision !== state.revision) throw new SaveError('save-conflict');
  }
  const next = { ...state, revision: state.revision + 1 };
  try {
    // Only validated previous data becomes the rolling backup.
    if (previous !== null) {
      try { importGame(previous); storage.setItem(BACKUP_KEY, previous); } catch (error) {
        if (!(error instanceof SaveError)) throw error;
      }
    }
    storage.setItem(SAVE_KEY, JSON.stringify(next));
  } catch (error) { throw new SaveError('storage-unavailable', error); }
  state.revision = next.revision;
}
