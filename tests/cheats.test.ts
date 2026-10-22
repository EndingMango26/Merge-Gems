import { describe, expect, it } from "vitest";
import { RULES } from "../src/data/rules";
import {
  addCheatCoins,
  addCheatGem,
  advanceCheatLevel,
  unlockCheatWorlds,
} from "../src/game/cheats";
import {
  advance,
  createGame,
  isWorldUnlocked,
  unlockedCells,
  xpToNextLevel,
} from "../src/game/engine";
import { gemIncomeAmount } from "../src/game/economy";

const START = 1_700_000_000_000;
function fresh() {
  const state = createGame(START);
  state.settings.cheatsEnabled = true;
  return state;
}

describe("optional cheat actions", () => {
  it("refuses all actions without mutating even timestamps when disabled", () => {
    const state = fresh();
    state.settings.cheatsEnabled = false;
    const before = structuredClone(state);
    expect(addCheatCoins(state, 1_000_000n, START + 60_000)).toBe(false);
    expect(addCheatGem(state, RULES.maxRank, START + 60_000)).toBe(false);
    expect(advanceCheatLevel(state, START + 60_000)).toBe(false);
    expect(unlockCheatWorlds(state, START + 60_000)).toBe(false);
    expect(state).toEqual(before);
  });

  it("adds exact large amounts only to the current land", () => {
    const state = fresh();
    state.worlds.gemland.level = RULES.moonUnlockGemlandLevel;
    state.activeWorld = "moonland";
    state.worlds.moonland.coins = "9007199254740993123";
    expect(addCheatCoins(state, 1n, START)).toBe(true);
    expect(state.worlds.moonland.coins).toBe("9007199254740993124");
    expect(state.worlds.gemland.coins).toBe("0");
    expect(state.worlds.aztecland.coins).toBe("0");
  });

  it("rejects nonpositive credits and saturates at the valid save boundary", () => {
    const state = fresh();
    expect(addCheatCoins(state, 0n, START)).toBe(false);
    expect(addCheatCoins(state, -1n, START)).toBe(false);
    state.worlds.gemland.coins = (RULES.maxCurrencyMilli - 1n).toString();
    expect(addCheatCoins(state, RULES.maxCurrencyMilli, START)).toBe(true);
    expect(state.worlds.gemland.coins).toBe(RULES.maxCurrencyMilli.toString());
    expect(addCheatCoins(state, 1n, START)).toBe(false);
  });

  it("never creates gems or gives levels in an unavailable active land", () => {
    const state = fresh();
    state.activeWorld = "moonland";
    const before = structuredClone(state);
    expect(addCheatCoins(state, 1n, START)).toBe(false);
    expect(addCheatGem(state, 1, START)).toBe(false);
    expect(advanceCheatLevel(state, START)).toBe(false);
    expect(state).toEqual(before);
  });

  it("adds the requested gem without overwriting, and records its discovery", () => {
    const state = fresh();
    const existing = structuredClone(state.worlds.gemland.cells.slice(0, 3));
    const purchases = [...state.worlds.gemland.purchases];
    expect(addCheatGem(state, RULES.maxRank, START)).toBe(true);
    expect(state.worlds.gemland.cells.slice(0, 3)).toEqual(existing);
    expect(state.worlds.gemland.cells[3]).toEqual({
      kind: "gem",
      rank: RULES.maxRank,
      bornAt: START,
    });
    expect(state.worlds.gemland.maxRank).toBe(RULES.maxRank);
    expect(state.worlds.gemland.purchases).toEqual(purchases);
  });

  it("refuses a full board and every invalid gem rank without losing pieces", () => {
    const state = fresh();
    const world = state.worlds.gemland;
    for (const rank of [-1, RULES.maxRank + 1, 1.5, NaN, Infinity]) {
      const before = structuredClone(world);
      expect(addCheatGem(state, rank, START)).toBe(false);
      expect(world).toEqual(before);
    }
    world.cells = world.cells.map((_, i) =>
      i < unlockedCells(world.level)
        ? { kind: "gem", rank: 0, bornAt: START }
        : null,
    );
    const full = structuredClone(world.cells);
    expect(addCheatGem(state, 1, START)).toBe(false);
    expect(world.cells).toEqual(full);
    expect(world.maxRank).toBe(0);
  });

  it("settles old income before a new gem begins to earn", () => {
    const state = fresh();
    expect(addCheatGem(state, 5, START + 2_500)).toBe(true);
    const world = state.worlds.gemland;
    expect(world.coins).toBe("2400");
    expect(world.cells[3]).toEqual({
      kind: "gem",
      rank: 5,
      bornAt: START + 2_500,
    });
    advance(state, START + 5_000);
    expect(world.coins).toBe(
      (4_800n + gemIncomeAmount("gemland", 5)).toString(),
    );
  });

  it("uses the monotonic income timestamp for gems when the clock recedes", () => {
    const state = fresh();
    advance(state, START + 2_500);
    expect(addCheatGem(state, 1, START)).toBe(true);
    expect(state.worlds.gemland.cells[3]).toEqual({
      kind: "gem",
      rank: 1,
      bornAt: START + 2_500,
    });
    expect(state.worlds.gemland.coins).toBe("2400");
  });

  it("gains one active-world level, preserves pieces and respects the level cap", () => {
    const state = fresh();
    const world = state.worlds.gemland;
    world.xp = 12;
    const cells = structuredClone(world.cells);
    expect(advanceCheatLevel(state, START)).toBe(true);
    expect(world.level).toBe(2);
    expect(world.xp).toBe(12);
    expect(unlockedCells(world.level)).toBe(7);
    expect(world.cells).toEqual(cells);
    world.level = RULES.maxLevel;
    expect(advanceCheatLevel(state, START)).toBe(false);
    expect(world.level).toBe(RULES.maxLevel);
  });

  it("keeps imported large XP below the new level threshold", () => {
    const state = fresh();
    state.worlds.gemland.xp = Number.MAX_SAFE_INTEGER;
    expect(advanceCheatLevel(state, START)).toBe(true);
    expect(state.worlds.gemland.xp).toBe(xpToNextLevel(2) - 1);
  });

  it("unlocks the lands without retroactive production or rewards", () => {
    const state = fresh();
    const now = START + 3_600_000;
    const moonBefore = structuredClone(state.worlds.moonland.cells);
    expect(unlockCheatWorlds(state, now)).toBe(true);
    expect(isWorldUnlocked(state, "moonland")).toBe(true);
    expect(isWorldUnlocked(state, "aztecland")).toBe(true);
    expect(state.worlds.moonland.coins).toBe("0");
    expect(state.worlds.aztecland.coins).toBe("0");
    expect(state.worlds.moonland.cells).toEqual(moonBefore);
    expect(state.worlds.moonland.lastAccruedAt).toBe(now);
    expect(state.worlds.moonland.nextCrateAt).toBe(
      now + RULES.crateIntervalMs.moonland,
    );
    advance(state, now);
    expect(state.worlds.moonland.coins).toBe("0");
    advance(state, now + 2_500);
    expect(BigInt(state.worlds.moonland.coins)).toBeGreaterThan(0n);
    const level = state.worlds.gemland.level;
    expect(unlockCheatWorlds(state, now + 2_500)).toBe(false);
    expect(state.worlds.gemland.level).toBe(level);
  });

  it("a direct level cheat crossing a land threshold also avoids old land income", () => {
    const state = fresh();
    state.worlds.gemland.level = RULES.moonUnlockGemlandLevel - 1;
    const now = START + 60_000;
    expect(advanceCheatLevel(state, now)).toBe(true);
    expect(isWorldUnlocked(state, "moonland")).toBe(true);
    advance(state, now);
    expect(state.worlds.moonland.coins).toBe("0");
    expect(state.worlds.moonland.lastAccruedAt).toBe(now);
  });
});
