import { describe, expect, it, vi } from "vitest";
import {
  BACKUP_KEY,
  SAVE_KEY,
  exportGame,
  importGame,
  loadGame,
  saveGame,
  validateGame,
} from "../src/storage/save";
import type { GameState, WorldState } from "../src/game/types";
import { acquireSession, type Session } from "../src/storage/session";

class MemoryStorage implements Storage {
  data = new Map<string, string>();
  get length() {
    return this.data.size;
  }
  clear() {
    this.data.clear();
  }
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  key(index: number) {
    return [...this.data.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}
function fixture(): GameState {
  const world = (): WorldState => ({
    coins: "123456789012345678901234567890",
    incomeRemainder: "2499",
    cells: Array(24).fill(null),
    maxRank: 0,
    xp: 0,
    level: 1,
    purchases: Array(39).fill(0),
    nextCrateAt: 10000,
    lastAccruedAt: 0,
  });
  return {
    version: 2,
    id: "test-game",
    revision: 0,
    savedAt: 0,
    activeWorld: "gemland",
    worlds: { gemland: world(), moonland: world(), aztecland: world() },
    settings: { language: "fr", sound: false, cheatsEnabled: false },
    tutorialStep: 0,
  };
}

describe("versioned local saves", () => {
  it("loads existing saves with cheats disabled and preserves the enabled preference", () => {
    const oldSave = JSON.parse(JSON.stringify(fixture()));
    delete oldSave.settings.cheatsEnabled;
    expect(importGame(JSON.stringify(oldSave)).settings.cheatsEnabled).toBe(
      false,
    );
    const enabled = fixture();
    enabled.settings.cheatsEnabled = true;
    expect(importGame(exportGame(enabled)).settings.cheatsEnabled).toBe(true);
    expect(importGame(exportGame(enabled)).worlds).toEqual(enabled.worlds);
    oldSave.settings.cheatsEnabled = "true";
    expect(() => importGame(JSON.stringify(oldSave))).toThrow("invalid-save");
  });
  it("round-trips all exact large values, clocks, settings and both export formats", () => {
    const game = fixture();
    expect(importGame(exportGame(game))).toEqual(game);
    expect(importGame(JSON.stringify(game))).toEqual(game);
  });
  it("increments revisions only after persistence and retains previous save", () => {
    const storage = new MemoryStorage();
    const game = fixture();
    saveGame(game, storage);
    expect(game.revision).toBe(1);
    game.worlds.gemland.coins = "77";
    saveGame(game, storage);
    expect(loadGame(storage).state?.revision).toBe(2);
    expect(importGame(storage.getItem(BACKUP_KEY)!).worlds.gemland.coins).toBe(
      fixture().worlds.gemland.coins,
    );
  });
  it("refuses a stale writer and requires explicit replacement for a different game", () => {
    const storage = new MemoryStorage();
    const game = fixture();
    const stale = fixture();
    saveGame(game, storage);
    expect(() => saveGame(stale, storage)).toThrow("save-conflict");
    const replacement = fixture();
    replacement.id = "replacement";
    expect(() => saveGame(replacement, storage)).toThrow("save-conflict");
    saveGame(replacement, storage, { replace: true });
    expect(loadGame(storage).state?.id).toBe("replacement");
  });
  it("preserves malformed primary and offers the valid backup without silently restoring it", () => {
    const storage = new MemoryStorage();
    storage.setItem(SAVE_KEY, "{broken");
    storage.setItem(BACKUP_KEY, exportGame(fixture()));
    expect(loadGame(storage)).toMatchObject({
      recovered: true,
      error: "invalid-json",
      state: { id: "test-game" },
    });
    expect(storage.getItem(SAVE_KEY)).toBe("{broken");
    expect(() => saveGame(fixture(), storage)).toThrow("corrupt-primary");
  });
  it("offers an intact previous save when the primary is missing", () => {
    const storage = new MemoryStorage();
    storage.setItem(BACKUP_KEY, exportGame(fixture()));
    expect(loadGame(storage)).toMatchObject({
      recovered: true,
      error: "missing-primary",
      state: { id: "test-game" },
    });
    expect(storage.getItem(SAVE_KEY)).toBeNull();
  });
  it("does not silently reset when both copies are invalid or storage is denied", () => {
    const storage = new MemoryStorage();
    storage.setItem(SAVE_KEY, "no");
    storage.setItem(BACKUP_KEY, "{}");
    expect(loadGame(storage)).toEqual({ state: null, error: "invalid-json" });
    storage.getItem = () => {
      throw new Error("denied");
    };
    expect(loadGame(storage)).toEqual({
      state: null,
      error: "storage-unavailable",
    });
  });
  it("does not mutate revision or old persisted game after a quota failure", () => {
    const storage = new MemoryStorage();
    const game = fixture();
    saveGame(game, storage);
    const before = storage.getItem(SAVE_KEY);
    storage.setItem = () => {
      throw new Error("quota");
    };
    expect(() => saveGame(game, storage)).toThrow("storage-unavailable");
    expect(game.revision).toBe(1);
    expect(storage.getItem(SAVE_KEY)).toBe(before);
  });
  it("keeps both old copies when a confirmed replacement cannot be stored", () => {
    const storage = new MemoryStorage();
    const game = fixture();
    saveGame(game, storage);
    const previous = storage.getItem(SAVE_KEY);
    const replacement = fixture();
    replacement.id = "imported-game";
    const set = storage.setItem.bind(storage);
    storage.setItem = (key, value) => {
      if (key === SAVE_KEY) throw new Error("quota");
      set(key, value);
    };
    expect(() => saveGame(replacement, storage, { replace: true })).toThrow(
      "storage-unavailable",
    );
    expect(storage.getItem(SAVE_KEY)).toBe(previous);
    expect(importGame(storage.getItem(BACKUP_KEY)!).id).toBe(game.id);
    expect(replacement.revision).toBe(0);
  });
  it("refuses revision exhaustion before writing an invalid next save", () => {
    const storage = new MemoryStorage();
    const game = fixture();
    game.revision = Number.MAX_SAFE_INTEGER - 1;
    expect(() => saveGame(game, storage)).toThrow("revision-exhausted");
    expect(storage.length).toBe(0);
  });
  it("migrates the documented v1 milli-coin schema", () => {
    const old = fixture() as unknown as Record<string, unknown>;
    old.version = 1;
    delete old.revision;
    for (const world of Object.values(
      old.worlds as Record<string, Record<string, unknown>>,
    ))
      delete world.incomeRemainder;
    const migrated = importGame(JSON.stringify(old));
    expect(migrated.version).toBe(2);
    expect(migrated.revision).toBe(0);
    expect(migrated.worlds.gemland.incomeRemainder).toBe("0");
  });
  it.each([
    (game: GameState) => {
      game.worlds.gemland.coins = "-1";
    },
    (game: GameState) => {
      game.worlds.gemland.coins = "0".repeat(301);
    },
    (game: GameState) => {
      game.worlds.gemland.incomeRemainder = "2500";
    },
    (game: GameState) => {
      game.worlds.gemland.cells[0] = { kind: "crate", rank: 39 };
    },
    (game: GameState) => {
      game.worlds.gemland.cells[23] = { kind: "crate", rank: 0 };
    },
    (game: GameState) => {
      game.worlds.gemland.lastAccruedAt = -1;
    },
    (game: GameState) => {
      game.worlds.gemland.purchases[0] = Infinity;
    },
    (game: GameState) => {
      game.worlds.gemland.purchases[0] = 4001;
    },
    (game: GameState) => {
      game.settings.language = "de" as "fr";
    },
  ])("rejects invalid data without changing the current game", (mutate) => {
    const valid = fixture();
    const invalid = fixture();
    mutate(invalid);
    expect(() => validateGame(invalid)).toThrow();
    expect(valid).toEqual(fixture());
  });
  it("refuses future versions, malformed JSON and oversized imports", () => {
    expect(() => importGame("{")).toThrow("invalid-json");
    expect(() => importGame(" ".repeat(256001))).toThrow("file-too-large");
    expect(() =>
      importGame(JSON.stringify({ ...fixture(), version: 99 })),
    ).toThrow("unsupported-version");
  });
});

describe("one active writer across tabs", () => {
  function fakeWindow() {
    return Object.assign(new EventTarget(), { setInterval, clearInterval });
  }
  const nextTurn = () => new Promise((resolve) => setTimeout(resolve, 0));

  it("holds an exclusive Web Lock and lets a follower take over after release", async () => {
    let locked = false;
    const locks = {
      async request(
        _name: string,
        _options: unknown,
        callback: (lock: object | null) => Promise<void>,
      ) {
        if (locked) return callback(null);
        locked = true;
        try {
          await callback({ name: "test-lock" });
        } finally {
          locked = false;
        }
      },
    };
    const browser = fakeWindow();
    vi.stubGlobal("navigator", { locks });
    vi.stubGlobal("window", browser);
    let first: Session | undefined;
    let follower: Session | undefined;
    try {
      first = await acquireSession(() => {});
      follower = await acquireSession(() => {});
      expect(first.active).toBe(true);
      expect(follower.active).toBe(false);
      first.close();
      await nextTurn();
      browser.dispatchEvent(new Event("focus"));
      await nextTurn();
      expect(first.active).toBe(false);
      expect(follower.active).toBe(true);
    } finally {
      first?.close();
      follower?.close();
      vi.unstubAllGlobals();
    }
  });

  it("uses an expiring lease on older browsers and rechecks ownership before writing", async () => {
    const storage = new MemoryStorage();
    const browser = fakeWindow();
    vi.stubGlobal("navigator", {});
    vi.stubGlobal("window", browser);
    vi.stubGlobal("localStorage", storage);
    let first: Session | undefined;
    let follower: Session | undefined;
    try {
      first = await acquireSession(() => {});
      follower = await acquireSession(() => {});
      expect(first.mode).toBe("lease");
      expect(first.active).toBe(true);
      expect(follower.active).toBe(false);
      first.close();
      browser.dispatchEvent(new Event("storage"));
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(follower.active).toBe(true);
      storage.setItem(
        "merge-gems.writer-lease.v2",
        JSON.stringify({ owner: "another-tab", expiresAt: Date.now() + 5000 }),
      );
      expect(follower.active).toBe(false);
    } finally {
      first?.close();
      follower?.close();
      vi.unstubAllGlobals();
    }
  });
});
