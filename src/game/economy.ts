import { GEM_TABLE, RULES } from "../data/rules";
import type { Language, WorldId, WorldState } from "./types";

/** Integer thousandths: no currency calculation passes through binary floats. */
export function decimalToMilli(value: string): bigint {
  const match = /^(\d+)(?:\.(\d+))?$/.exec(value);
  if (!match) throw new Error("Invalid decimal amount");
  const fraction = match[2] ?? "";
  if (/[1-9]/.test(fraction.slice(3)))
    throw new Error("Unsupported amount precision");
  return BigInt(match[1]) * 1000n + BigInt((fraction + "000").slice(0, 3));
}

export function getGemData(id: WorldId, rank: number) {
  if (!Number.isInteger(rank) || rank < 0 || rank > RULES.maxRank)
    throw new RangeError("Invalid gem rank");
  return GEM_TABLE[rank][id];
}

export function gemName(id: WorldId, rank: number): string {
  return getGemData(id, rank).name;
}

export function gemIncomeAmount(id: WorldId, rank: number): bigint {
  const data = getGemData(id, rank);
  const amount =
    data.moneyEarned ??
    ("inferredMoneyEarned" in data ? data.inferredMoneyEarned : null);
  if (amount === null)
    throw new Error(`Missing economic data for ${id}:${rank}`);
  return decimalToMilli(amount);
}

export function getIncomeAmount(world: WorldState, id: WorldId): bigint {
  const boosted = new Set(boostedCellIndices(world, id));
  return world.cells.reduce(
    (sum, tile, index) =>
      sum +
      (tile?.kind === "gem"
        ? gemIncomeAmount(id, tile.rank) *
          (boosted.has(index) ? BigInt(RULES.moonBoostMultiplier) : 1n)
        : 0n),
    0n,
  );
}

/** Screens with 7 and 13 tiles have a centered first tile above complete rows. */
export function cellCoordinates(
  index: number,
  availableCells: number,
): { row: number; col: number } {
  const columns = RULES.boardColumns;
  if (availableCells % columns === 1)
    return index === 0
      ? { row: 0, col: 1 }
      : {
          row: 1 + Math.floor((index - 1) / columns),
          col: (index - 1) % columns,
        };
  return { row: Math.floor(index / columns), col: index % columns };
}

/** The first highest-ranked gem is used on ties; tie behavior remains PROVISIONAL. */
export function boostedCellIndices(world: WorldState, id: WorldId): number[] {
  if (id !== "moonland" || !RULES.moonBoostEnabled) return [];
  let highest = -1;
  let source = -1;
  const available = Math.min(
    RULES.maxCells,
    world.level + RULES.initialCells - 1,
  );
  world.cells.slice(0, available).forEach((tile, index) => {
    if (tile?.kind === "gem" && tile.rank > highest) {
      highest = tile.rank;
      source = index;
    }
  });
  if (source === -1) return [];
  const origin = cellCoordinates(source, available);
  return world.cells.flatMap((tile, index) => {
    const point = cellCoordinates(index, available);
    return tile?.kind === "gem" &&
      index < available &&
      Math.abs(point.col - origin.col) <= RULES.moonBoostRadius &&
      Math.abs(point.row - origin.row) <= RULES.moonBoostRadius
      ? [index]
      : [];
  });
}

/** Display rate. Accrual uses the unrounded amount and retained remainder. */
export function incomePerSecond(world: WorldState, id: WorldId): bigint {
  return (getIncomeAmount(world, id) * 1000n) / BigInt(RULES.incomeIntervalMs);
}
export const incomeRate = incomePerSecond;

export function maxPurchasableRank(world: WorldState): number {
  return world.maxRank < 1
    ? 0
    : Math.min(
        RULES.maxPurchasableRank,
        Math.max(1, world.maxRank - RULES.shopRankDistance),
      );
}

/** Each purchase rounds UP to one milli-coin; original rounding is unknown. */
export function getPrice(
  world: WorldState,
  rank: number,
  id: WorldId = "gemland",
): bigint {
  if (!Number.isInteger(rank) || rank < 1 || rank > RULES.maxPurchasableRank)
    throw new RangeError("Gem cannot be bought");
  const base = GEM_TABLE[rank].basePrice;
  if (base === null) throw new RangeError("Gem has no purchase price");
  const count = world.purchases[rank] ?? 0;
  if (
    !Number.isInteger(count) ||
    count < 0 ||
    count > RULES.maxPurchasesPerRank
  )
    throw new RangeError("Invalid purchase count");
  let price = decimalToMilli(base);
  let start = 0;
  if (id === "gemland" && rank === 1 && count > 0) {
    price = RULES.silverFirstPriceMilli;
    start = 1;
  }
  for (let n = start; n < count; n++) {
    price =
      (price * RULES.priceNumerator + RULES.priceDenominator - 1n) /
      RULES.priceDenominator;
  }
  return price;
}

/** Abbreviations observed in the reference; 'b' after 'a' mirrors its ambiguous suffix. */
export function formatCoins(milli: bigint, language: Language = "fr"): string {
  const negative = milli < 0n;
  let value = negative ? -milli : milli;
  const suffixes = ["", "k", "m", "b", "t", "a", "b", "c", "d", "e", "f", "g"];
  let unit = 1000n;
  let tier = 0;
  while (value >= unit * 1000n && tier < suffixes.length - 1) {
    unit *= 1000n;
    tier++;
  }
  if (value >= unit * 1000n) {
    // PROVISIONAL presentation beyond known suffixes. Decimal digit extraction
    // preserves exact BigInt accounting and bounds the header even for imports
    // containing hundreds of digits. Display truncates to three significant digits.
    const digits = value.toString();
    const significantFraction = digits.slice(1, 3).replace(/0+$/, "");
    const mantissa =
      digits[0] +
      (significantFraction
        ? (language === "fr" ? "," : ".") + significantFraction
        : "");
    return `${negative ? "−" : ""}${mantissa}e+${digits.length - 4}`;
  }
  const whole = value / unit;
  // Truncate rather than display money the player cannot spend.
  const hundredths = ((value % unit) * 100n) / unit;
  const fraction =
    hundredths === 0n
      ? ""
      : (language === "fr" ? "," : ".") +
        hundredths.toString().padStart(2, "0").replace(/0$/, "");
  return `${negative ? "−" : ""}${whole}${fraction}${suffixes[tier]}`;
}
