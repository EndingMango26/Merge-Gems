export type WorldId = 'gemland' | 'moonland' | 'aztecland';
export type Language = 'fr' | 'en';
export type Tile = { kind: 'gem'; rank: number; bornAt: number } | { kind: 'crate'; rank: number };
export interface WorldState {
  coins: string; // integer thousandths of one coin, serialized BigInt
  incomeRemainder: string;
  cells: (Tile | null)[];
  maxRank: number;
  xp: number;
  level: number;
  purchases: number[];
  nextCrateAt: number;
  lastAccruedAt: number;
}
export interface GameState {
  version: 2;
  id: string;
  revision: number;
  savedAt: number;
  activeWorld: WorldId;
  worlds: Record<WorldId, WorldState>;
  settings: { language: Language; sound: boolean };
  tutorialStep: number;
}
export const WORLD_IDS: WorldId[] = ['gemland', 'moonland', 'aztecland'];
