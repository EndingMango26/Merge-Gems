import { describe, expect, it } from "vitest";
import {
  RULES,
  advance,
  buyGem,
  createGame,
  getIncomeAmount,
  getPrice,
  incomePerSecond,
  isWorldUnlocked,
  maxPurchasableRank,
  move,
  openCrate,
  tapGenerator,
  unlockedCells,
  xpToNextLevel,
} from "../src/game/engine";
import {
  boostedCellIndices,
  decimalToMilli,
  formatCoins,
  gemIncomeAmount,
} from "../src/game/economy";
import type { GameState, WorldState } from "../src/game/types";

const START = 1_700_000_000_000;
const gem = (rank: number) => ({ kind: "gem" as const, rank, bornAt: START });
function fresh(): GameState {
  return createGame(START);
}
function fill(world: WorldState, rank = 0) {
  world.cells = world.cells.map((_, i) =>
    i < unlockedCells(world.level) ? gem(rank) : null,
  );
}

describe("merge and movement invariants", () => {
  it("merges two identical gems into precisely one next-rank gem", () => {
    const state = fresh();
    expect(move(state, 0, 1, START)).toBe("merged");
    expect(state.worlds.gemland.cells[0]).toBeNull();
    expect(state.worlds.gemland.cells[1]).toEqual(gem(1));
    expect(state.worlds.gemland.maxRank).toBe(1);
    expect(state.worlds.gemland.xp).toBe(1);
  });

  it("preserves every gem on invalid, same-cell, locked or cancelled gestures", () => {
    const state = fresh();
    const world = state.worlds.gemland;
    world.cells[1] = gem(1);
    const original = structuredClone(world.cells);
    for (const [from, to] of [
      [0, 1],
      [0, 0],
      [0, -1],
      [0, 6],
      [-1, 0],
      [2, 0],
      [0, 2],
      [0, 0.5],
    ]) {
      expect(move(state, from, to, START)).toBe("invalid");
      expect(world.cells).toEqual(original);
    }
    // A pointer cancellation performs no engine mutation at all.
    expect(world.cells).toEqual(original);
  });

  it("moves to an empty available tile without duplicating or transforming it", () => {
    const state = fresh();
    expect(move(state, 0, 5, START)).toBe("moved");
    expect(state.worlds.gemland.cells[0]).toBeNull();
    expect(state.worlds.gemland.cells[5]).toEqual(gem(0));
  });

  it("keeps terminal-rank pairs intact because cap merge behavior is unknown", () => {
    const state = fresh();
    state.worlds.gemland.cells[0] = gem(38);
    state.worlds.gemland.cells[1] = gem(38);
    expect(move(state, 0, 1, START)).toBe("invalid");
    expect(state.worlds.gemland.cells.slice(0, 2)).toEqual([gem(38), gem(38)]);
  });

  it("opens a box once and credits no income before opening", () => {
    const state = fresh();
    expect(getIncomeAmount(state.worlds.gemland, "gemland")).toBe(2400n);
    expect(openCrate(state, 2, START)).toBe(true);
    expect(openCrate(state, 2, START)).toBe(false);
    expect(getIncomeAmount(state.worlds.gemland, "gemland")).toBe(3600n);
  });
});

describe("source-backed economics and explicit rounding", () => {
  it("matches the observed designer Gemland header 631.2/sec", () => {
    const state = fresh();
    const world = state.worlds.gemland;
    world.level = 6;
    world.cells.fill(null);
    [8, 5, 2, 6, 3, 1, 2].forEach((rank, i) => {
      world.cells[i] = gem(rank);
    });
    expect(getIncomeAmount(world, "gemland")).toBe(1578000n);
    expect(incomePerSecond(world, "gemland")).toBe(631200n);
  });

  it("matches Moonland screenshot neighborhood and 124.8/sec", () => {
    const world = fresh().worlds.moonland;
    world.level = 2;
    world.cells.fill(null);
    // Centered lone tile is an unopened box. First complete row: 0,1,0;
    // second complete row: 1,0,5. Highest gem at bottom-right doubles itself.
    [0, 1, 0, 1, 0, 5].forEach((rank, i) => {
      world.cells[i + 1] = gem(rank);
    });
    expect(boostedCellIndices(world, "moonland")).toEqual([2, 3, 5, 6]);
    expect(getIncomeAmount(world, "moonland")).toBe(312000n);
    expect(incomePerSecond(world, "moonland")).toBe(124800n);
  });

  it("refuses unowned ranks and purchases without enough money", () => {
    const state = fresh();
    expect(buyGem(state, 1, START)).toBe(false);
    move(state, 0, 1, START);
    state.worlds.gemland.coins = "999999";
    expect(buyGem(state, 1, START)).toBe(false);
    expect(state.worlds.gemland.purchases[1]).toBe(0);
    expect(buyGem(state, 2, START)).toBe(false);
  });

  it("uses Silver 1000 → 1730 exception and subsequent +15%, per-world history", () => {
    const state = fresh();
    const world = state.worlds.gemland;
    move(state, 0, 1, START);
    world.coins = "100000000";
    expect(getPrice(world, 1)).toBe(1000000n);
    expect(buyGem(state, 1, START)).toBe(true);
    expect(getPrice(world, 1)).toBe(1730000n);
    expect(buyGem(state, 1, START)).toBe(true);
    expect(getPrice(world, 1)).toBe(1989500n);
    expect(world.coins).toBe("97270000");
    expect(getPrice(state.worlds.moonland, 1, "moonland")).toBe(1000000n);
    state.worlds.moonland.purchases[1] = 1;
    expect(getPrice(state.worlds.moonland, 1, "moonland")).toBe(1150000n);
  });

  it("rounds each price increase to the next milli-coin without float drift", () => {
    const world = fresh().worlds.gemland;
    world.purchases[2] = 4;
    expect(getPrice(world, 2)).toBe(7870529n); // 4500000 * 1.15^4 rounded upward
    world.purchases[34] = 15;
    expect(getPrice(world, 34)).toBeGreaterThan(
      BigInt(Number.MAX_SAFE_INTEGER),
    );
    expect(decimalToMilli("5170000000000000000.00")).toBe(
      5170000000000000000000n,
    );
    expect(gemIncomeAmount("gemland", 38)).toBe(3180000000000000n);
  });

  it("keeps the last four discovered ranks unavailable in the shop", () => {
    const world = fresh().worlds.gemland;
    world.maxRank = 10;
    expect(maxPurchasableRank(world)).toBe(6);
    world.maxRank = 38;
    expect(maxPurchasableRank(world)).toBe(34);
  });

  it("formats exact huge values and both language decimal separators", () => {
    expect(formatCoins(631200n, "fr")).toBe("631,2");
    expect(formatCoins(631200n, "en")).toBe("631.2");
    expect(formatCoins(999999n, "en")).toBe("999.99");
    expect(formatCoins(5170000000000000000000n, "en")).toBe("5.17b");
  });

  it("bounds exceptional scientific displays without converting currency to Number", () => {
    const huge = 123456n * 10n ** 98n;
    expect(formatCoins(10n ** 103n, "en")).toBe("1e+100");
    expect(formatCoins(huge, "en")).toBe("1.23e+100");
    expect(formatCoins(huge, "fr")).toBe("1,23e+100");
    expect(formatCoins(huge, "fr").length).toBeLessThan(16);
    expect(formatCoins(RULES.maxCurrencyMilli, "fr")).toBe("9,99e+296");
  });
});

describe("controlled clock, generation and resumption", () => {
  it("generates on the recorded timestamp and speeds the timer by 5 seconds per tap", () => {
    const state = fresh();
    expect(advance(state, START + 9999).crates).toBe(0);
    expect(advance(state, START + 10000).crates).toBe(1);
    const another = fresh();
    expect(tapGenerator(another, START)).toBe(true);
    expect(another.worlds.gemland.nextCrateAt).toBe(START + 5000);
    expect(tapGenerator(another, START)).toBe(true);
    expect(another.worlds.gemland.cells[3]?.kind).toBe("crate");
    expect(another.worlds.gemland.nextCrateAt).toBe(START + 10000);
  });

  it("handles a full board without spending or deleting anything", () => {
    const state = fresh();
    const world = state.worlds.gemland;
    fill(world, 1);
    world.maxRank = 1;
    world.coins = "10000000";
    expect(buyGem(state, 1, START)).toBe(false);
    expect(tapGenerator(state, START)).toBe(false);
    const cells = structuredClone(world.cells);
    advance(state, START + 100_000);
    expect(world.cells).toEqual(cells);
    expect(world.nextCrateAt).toBe(START + 110_000);
    expect(world.purchases[1]).toBe(0);
  });

  it("credits exact accumulated income once after absence and survives a backward clock", () => {
    const state = fresh();
    expect(advance(state, START + 3600_000).earned).toBe(3456000n);
    const after = state.worlds.gemland.coins;
    expect(advance(state, START + 3600_000).earned).toBe(0n);
    expect(advance(state, START - 100_000).earned).toBe(0n);
    expect(state.worlds.gemland.coins).toBe(after);
    expect(advance(state, START + 3600_001).earned).toBe(0n);
    expect(advance(state, START + 3600_002).earned).toBe(1n);
  });

  it("retains fractional remainder and gives the same state at every frame rate", () => {
    const once = fresh();
    const split = structuredClone(once);
    advance(once, START + 37_777);
    for (let elapsed = 7; elapsed < 37_777; elapsed += 7)
      advance(split, START + elapsed);
    advance(split, START + 37_777);
    expect(split).toEqual(once);
    expect(once.worlds.gemland.coins).toBe("36265");
    expect(once.worlds.gemland.incomeRemainder).toBe("2300");
  });

  it("does not grant locked worlds retroactive income", () => {
    const state = fresh();
    advance(state, START + 100_000);
    expect(state.worlds.moonland.coins).toBe("0");
    state.worlds.gemland.level = 8;
    expect(isWorldUnlocked(state, "moonland")).toBe(true);
    advance(state, START + 101_000);
    expect(BigInt(state.worlds.moonland.coins)).toBeGreaterThan(0n);
    expect(BigInt(state.worlds.moonland.coins)).toBeLessThan(10000n);
  });
});

describe("progression", () => {
  it("uses directly observed tile counts and XP targets", () => {
    expect(unlockedCells(2)).toBe(7);
    expect(unlockedCells(6)).toBe(11);
    expect(unlockedCells(8)).toBe(13);
    expect(xpToNextLevel(2)).toBe(46);
    expect(xpToNextLevel(6)).toBe(210);
    expect(xpToNextLevel(8)).toBe(354);
  });

  it("unlocks a tile on level up and Moonland at Gemland level 8", () => {
    const state = fresh();
    const world = state.worlds.gemland;
    world.level = 7;
    world.xp = xpToNextLevel(7) - 1;
    expect(isWorldUnlocked(state, "moonland")).toBe(false);
    expect(move(state, 0, 1, START)).toBe("merged");
    expect(world.level).toBe(8);
    expect(world.xp).toBe(0);
    expect(unlockedCells(world.level)).toBe(13);
    expect(isWorldUnlocked(state, "moonland")).toBe(true);
    expect(RULES.aztecVinesEnabled).toBe(false);
  });
});

describe("technical import boundaries", () => {
  it("keeps XP an exact safe integer at the technical maximum level", () => {
    const state = fresh();
    state.worlds.gemland.level = RULES.maxLevel;
    state.worlds.gemland.xp = Number.MAX_SAFE_INTEGER;
    expect(move(state, 0, 1, START)).toBe("merged");
    expect(state.worlds.gemland.level).toBe(99);
    expect(state.worlds.gemland.xp).toBe(Number.MAX_SAFE_INTEGER);
  });

  it("keeps even the maximum technical purchase price within save precision", () => {
    const state = fresh();
    const world = state.worlds.gemland;
    world.maxRank = 38;
    world.purchases[34] = RULES.maxPurchasesPerRank;
    expect(getPrice(world, 34).toString().length).toBeLessThanOrEqual(
      RULES.maxCurrencyDigits,
    );
    world.coins = RULES.maxCurrencyMilli.toString();
    expect(buyGem(state, 34, START)).toBe(false);
    expect(world.purchases[34]).toBe(RULES.maxPurchasesPerRank);
  });

  it("preserves valid currency serialization if an import is already at its technical ceiling", () => {
    const state = fresh();
    state.worlds.gemland.coins = RULES.maxCurrencyMilli.toString();
    expect(advance(state, START + 2500).earned).toBe(0n);
    expect(state.worlds.gemland.coins.length).toBe(RULES.maxCurrencyDigits);
    expect(state.worlds.gemland.coins).toBe(RULES.maxCurrencyMilli.toString());
  });

  it("rejects unusable clocks and does not repeatedly fire at the Date boundary", () => {
    expect(() => createGame(Number.NaN)).toThrow(RangeError);
    expect(() => createGame(RULES.maxTimestampMs + 1)).toThrow(RangeError);
    const state = createGame(RULES.maxTimestampMs - 10);
    const tick = advance(state, RULES.maxTimestampMs);
    const snapshot = structuredClone(state);
    expect(tick.crates).toBe(0);
    expect(advance(state, RULES.maxTimestampMs)).toEqual({
      earned: 0n,
      crates: 0,
    });
    expect(state).toEqual(snapshot);
    expect(() => advance(state, Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});
