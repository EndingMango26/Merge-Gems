import { RULES } from "../data/rules";
import { getIncomeAmount, getPrice, maxPurchasableRank } from "./economy";
import {
  WORLD_IDS,
  type GameState,
  type Language,
  type WorldId,
  type WorldState,
} from "./types";

export {
  getPrice,
  getIncomeAmount,
  getGemData,
  gemName,
  incomePerSecond,
  incomeRate,
  maxPurchasableRank,
  formatCoins,
  boostedCellIndices,
  cellCoordinates,
} from "./economy";
export { RULES } from "../data/rules";

export function unlockedCells(level: number): number {
  return Math.min(
    RULES.maxCells,
    RULES.initialCells + Math.max(0, Math.floor(level) - 1),
  );
}

/** Levels 2/6/8 are directly visible. Other thresholds remain PROVISIONAL. */
export function xpToNextLevel(level: number): number {
  return (
    RULES.xpThresholds[level] ??
    Math.ceil(
      RULES.xpThresholds[8] * RULES.xpThresholdGrowthAfterEight ** (level - 8),
    )
  );
}

export function isWorldUnlocked(state: GameState, id: WorldId): boolean {
  return (
    id === "gemland" ||
    state.worlds.gemland.level >=
      (id === "moonland"
        ? RULES.moonUnlockGemlandLevel
        : RULES.aztecUnlockGemlandLevel)
  );
}

function newWorld(now: number): WorldState {
  const cells: WorldState["cells"] = Array(RULES.maxCells).fill(null);
  // PROVISIONAL opening arrangement; original tutorial has not been observed.
  RULES.initialGemRanks.forEach((rank, index) => {
    cells[index] = { kind: "gem", rank, bornAt: now };
  });
  RULES.initialCrateRanks.forEach((rank, index) => {
    cells[RULES.initialGemRanks.length + index] = { kind: "crate", rank };
  });
  return {
    coins: "0",
    incomeRemainder: "0",
    cells,
    maxRank: 0,
    xp: 0,
    level: 1,
    purchases: Array(RULES.maxRank + 1).fill(0),
    nextCrateAt: now,
    lastAccruedAt: now,
  };
}

export function createGame(now: number, language: Language = "fr"): GameState {
  if (!Number.isSafeInteger(now) || now < 0 || now > RULES.maxTimestampMs)
    throw new RangeError("Invalid clock");
  const worlds = Object.fromEntries(
    WORLD_IDS.map((id) => {
      const world = newWorld(now);
      world.nextCrateAt = Math.min(
        RULES.maxTimestampMs,
        now + RULES.crateIntervalMs[id],
      );
      return [id, world];
    }),
  ) as Record<WorldId, WorldState>;
  return {
    version: 2,
    id: globalThis.crypto?.randomUUID?.() ?? `game-${now}`,
    revision: 0,
    savedAt: now,
    activeWorld: "gemland",
    worlds,
    settings: { language, sound: false },
    tutorialStep: 0,
  };
}

function firstEmpty(world: WorldState): number {
  return world.cells.findIndex(
    (tile, index) => tile === null && index < unlockedCells(world.level),
  );
}

/**
 * All elapsed-time arithmetic is timestamp based; display frame rate is irrelevant.
 * Original absence caps are unknown: unlimited income and scheduled crate fill are
 * PROVISIONAL. Unopened crates produce no income. Missed drops on a full board are
 * skipped rather than queued, preserving phase and preventing a burst after merges.
 */
export function advance(
  state: GameState,
  now: number,
): { earned: bigint; crates: number } {
  if (!Number.isSafeInteger(now) || now < 0 || now > RULES.maxTimestampMs)
    throw new RangeError("Invalid clock");
  let earned = 0n;
  let crates = 0;
  for (const id of WORLD_IDS) {
    const world = state.worlds[id];
    const effectiveNow = Math.max(now, world.lastAccruedAt);
    if (!isWorldUnlocked(state, id)) {
      world.lastAccruedAt = effectiveNow;
      world.nextCrateAt = Math.min(
        RULES.maxTimestampMs,
        Math.max(world.nextCrateAt, effectiveNow + RULES.crateIntervalMs[id]),
      );
      continue;
    }
    const elapsed = effectiveNow - world.lastAccruedAt;
    const numerator =
      getIncomeAmount(world, id) * BigInt(elapsed) +
      BigInt(world.incomeRemainder);
    const calculatedCredit = numerator / BigInt(RULES.incomeIntervalMs);
    const room = RULES.maxCurrencyMilli - BigInt(world.coins);
    // Technical ceiling only: even all terminal gems for the whole Date range
    // are hundreds of orders of magnitude below it. Prevents imports at the
    // serialized boundary becoming invalid on the next income tick.
    const credit = calculatedCredit < room ? calculatedCredit : room;
    world.incomeRemainder = (
      numerator % BigInt(RULES.incomeIntervalMs)
    ).toString();
    world.coins = (BigInt(world.coins) + credit).toString();
    world.lastAccruedAt = effectiveNow;
    earned += credit;
    const interval = RULES.crateIntervalMs[id];
    // maxTimestamp is the terminal timer sentinel: never re-fire an event at
    // the same ceiling timestamp on successive display frames.
    while (
      world.nextCrateAt <= effectiveNow &&
      world.nextCrateAt < RULES.maxTimestampMs
    ) {
      const target = firstEmpty(world);
      if (target < 0) {
        world.nextCrateAt = Math.min(
          RULES.maxTimestampMs,
          world.nextCrateAt +
            (Math.floor((effectiveNow - world.nextCrateAt) / interval) + 1) *
              interval,
        );
        break;
      }
      world.cells[target] = { kind: "crate", rank: RULES.defaultCrateRank };
      world.nextCrateAt = Math.min(
        RULES.maxTimestampMs,
        world.nextCrateAt + interval,
      );
      crates++;
    }
  }
  return { earned, crates };
}

function validIndex(world: WorldState, index: number): boolean {
  return (
    Number.isInteger(index) && index >= 0 && index < unlockedCells(world.level)
  );
}

export function openCrate(
  state: GameState,
  index: number,
  now: number,
): boolean {
  advance(state, now);
  const world = state.worlds[state.activeWorld];
  if (!isWorldUnlocked(state, state.activeWorld) || !validIndex(world, index))
    return false;
  const tile = world.cells[index];
  if (tile?.kind !== "crate") return false;
  world.cells[index] = {
    kind: "gem",
    rank: tile.rank,
    bornAt: world.lastAccruedAt,
  };
  world.maxRank = Math.max(world.maxRank, tile.rank);
  state.tutorialStep = Math.max(state.tutorialStep, 1);
  return true;
}

export function move(
  state: GameState,
  from: number,
  to: number,
  now: number,
): "merged" | "moved" | "invalid" {
  advance(state, now);
  const world = state.worlds[state.activeWorld];
  if (
    !isWorldUnlocked(state, state.activeWorld) ||
    from === to ||
    !validIndex(world, from) ||
    !validIndex(world, to)
  )
    return "invalid";
  const source = world.cells[from];
  const target = world.cells[to];
  if (source?.kind !== "gem") return "invalid";
  if (target === null) {
    world.cells[to] = source;
    world.cells[from] = null;
    return "moved";
  }
  if (
    target.kind !== "gem" ||
    target.rank !== source.rank ||
    source.rank >= RULES.maxRank
  )
    return "invalid";
  const rank = source.rank + 1;
  world.cells[to] = { kind: "gem", rank, bornAt: world.lastAccruedAt };
  world.cells[from] = null;
  world.maxRank = Math.max(world.maxRank, rank);
  // PROVISIONAL: XP per merged rank is not documented by available references.
  const xpGain = rank * RULES.xpPerMergeRankMultiplier;
  world.xp = Math.min(Number.MAX_SAFE_INTEGER - xpGain, world.xp) + xpGain;
  while (
    world.level < RULES.maxLevel &&
    world.xp >= xpToNextLevel(world.level)
  ) {
    world.xp -= xpToNextLevel(world.level);
    world.level++;
  }
  state.tutorialStep = Math.max(state.tutorialStep, 2);
  return "merged";
}

export function tapGenerator(state: GameState, now: number): boolean {
  advance(state, now);
  const world = state.worlds[state.activeWorld];
  if (!isWorldUnlocked(state, state.activeWorld) || firstEmpty(world) < 0)
    return false;
  world.nextCrateAt = Math.max(
    world.lastAccruedAt,
    world.nextCrateAt - RULES.tapReductionMs,
  );
  advance(state, world.lastAccruedAt);
  return true;
}

export function buyGem(state: GameState, rank: number, now: number): boolean {
  advance(state, now);
  const id = state.activeWorld;
  const world = state.worlds[id];
  if (
    !isWorldUnlocked(state, id) ||
    !Number.isInteger(rank) ||
    rank < 1 ||
    rank > maxPurchasableRank(world)
  )
    return false;
  if (world.purchases[rank] >= RULES.maxPurchasesPerRank) return false;
  const target = firstEmpty(world);
  if (target < 0) return false;
  const price = getPrice(world, rank, id);
  if (BigInt(world.coins) < price) return false;
  world.coins = (BigInt(world.coins) - price).toString();
  world.cells[target] = { kind: "gem", rank, bornAt: world.lastAccruedAt };
  world.purchases[rank]++;
  world.maxRank = Math.max(world.maxRank, rank);
  state.tutorialStep = Math.max(state.tutorialStep, 3);
  return true;
}
