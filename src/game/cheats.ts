import { RULES } from "../data/rules";
import {
  advance,
  isWorldUnlocked,
  unlockedCells,
  xpToNextLevel,
} from "./engine";
import type { GameState, WorldState } from "./types";

/** Optional personal-game tools; these do not alter the normal game rules. */
function enabled(state: GameState): boolean {
  return state.settings.cheatsEnabled === true;
}

function activeWorldAvailable(state: GameState): boolean {
  return enabled(state) && isWorldUnlocked(state, state.activeWorld);
}

function keepXpWithinLevel(world: WorldState): void {
  world.xp = Math.min(world.xp, xpToNextLevel(world.level) - 1);
}

/** Amounts are integer milli-coins, identical to the normal accounting unit. */
export function addCheatCoins(
  state: GameState,
  amountMilli: bigint,
  now: number,
): boolean {
  if (!activeWorldAvailable(state) || amountMilli <= 0n) return false;
  advance(state, now);
  const world = state.worlds[state.activeWorld];
  const current = BigInt(world.coins);
  const remaining = RULES.maxCurrencyMilli - current;
  if (remaining <= 0n) return false;
  world.coins = (
    current + (amountMilli < remaining ? amountMilli : remaining)
  ).toString();
  return true;
}

export function addCheatGem(
  state: GameState,
  rank: number,
  now: number,
): boolean {
  if (
    !activeWorldAvailable(state) ||
    !Number.isInteger(rank) ||
    rank < 0 ||
    rank > RULES.maxRank
  )
    return false;
  // Settle the old production before the new gem can begin earning income.
  advance(state, now);
  const world = state.worlds[state.activeWorld];
  const available = unlockedCells(world.level);
  const target = world.cells.findIndex(
    (tile, index) => tile === null && index < available,
  );
  if (target < 0) return false;
  world.cells[target] = { kind: "gem", rank, bornAt: world.lastAccruedAt };
  world.maxRank = Math.max(world.maxRank, rank);
  return true;
}

export function advanceCheatLevel(state: GameState, now: number): boolean {
  if (!activeWorldAvailable(state)) return false;
  const world = state.worlds[state.activeWorld];
  if (world.level >= RULES.maxLevel) return false;
  advance(state, now);
  world.level++;
  keepXpWithinLevel(world);
  return true;
}

export function unlockCheatWorlds(state: GameState, now: number): boolean {
  if (!enabled(state)) return false;
  const world = state.worlds.gemland;
  const level = Math.min(
    RULES.maxLevel,
    Math.max(RULES.moonUnlockGemlandLevel, RULES.aztecUnlockGemlandLevel),
  );
  if (world.level >= level) return false;
  // Locked worlds advance their timestamps without income before being unlocked.
  // They must not suddenly receive production for the time they were locked.
  advance(state, now);
  world.level = level;
  keepXpWithinLevel(world);
  return true;
}
