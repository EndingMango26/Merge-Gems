const LOCK_NAME = "merge-gems.writer.v2";
const LEASE_KEY = "merge-gems.writer-lease.v2";
const LEASE_MS = 6000;
const HEARTBEAT_MS = 1500;

export interface Session {
  /** Read immediately before each action. Followers must never advance or save. */
  readonly active: boolean;
  readonly mode: "web-locks" | "lease" | "unavailable";
  close(): void;
}

/** Holds a Web Lock for this page's lifetime. A second page remains read-only. */
export async function acquireSession(
  onChange: (active: boolean) => void,
): Promise<Session> {
  if (typeof navigator !== "undefined" && navigator.locks) {
    let active = false;
    let closed = false;
    let trying = false;
    let release: (() => void) | undefined;
    let firstResolve: (() => void) | undefined;
    const first = new Promise<void>((resolve) => {
      firstResolve = resolve;
    });
    const setActive = (value: boolean) => {
      if (active !== value) {
        active = value;
        onChange(value);
      }
    };
    const attempt = () => {
      if (closed || active || trying) return;
      trying = true;
      void navigator.locks
        .request(
          LOCK_NAME,
          { mode: "exclusive", ifAvailable: true },
          async (lock) => {
            if (closed) return;
            setActive(Boolean(lock));
            firstResolve?.();
            firstResolve = undefined;
            if (lock)
              await new Promise<void>((resolve) => {
                release = resolve;
              });
            setActive(false);
          },
        )
        .catch(() => {
          setActive(false);
          firstResolve?.();
          firstResolve = undefined;
        })
        .finally(() => {
          trying = false;
        });
    };
    const interval = window.setInterval(attempt, HEARTBEAT_MS);
    window.addEventListener("focus", attempt);
    attempt();
    await first;
    return {
      get active() {
        return active && !closed;
      },
      mode: "web-locks",
      close() {
        closed = true;
        clearInterval(interval);
        window.removeEventListener("focus", attempt);
        release?.();
        setActive(false);
      },
    };
  }
  return acquireLease(onChange);
}

/** Compatibility fallback. Revision checks in save.ts provide a second stale-writer guard. */
async function acquireLease(
  onChange: (active: boolean) => void,
): Promise<Session> {
  const owner =
    globalThis.crypto?.randomUUID?.() ??
    `tab-${Math.random().toString(36).slice(2)}-${Date.now()}`;
  let active = false;
  let closed = false;
  let checking = false;
  let available = true;
  const setActive = (value: boolean) => {
    if (active !== value) {
      active = value;
      onChange(value);
    }
  };
  type Lease = { owner: string; expiresAt: number };
  const read = (): Lease | null => {
    const raw = localStorage.getItem(LEASE_KEY);
    if (!raw) return null;
    try {
      const lease = JSON.parse(raw) as Lease;
      return typeof lease.owner === "string" &&
        Number.isSafeInteger(lease.expiresAt)
        ? lease
        : null;
    } catch {
      return null;
    }
  };
  const valid = (lease: Lease | null) =>
    Boolean(
      lease &&
        lease.expiresAt > Date.now() &&
        lease.expiresAt <= Date.now() + LEASE_MS + 2000,
    );
  const ownsLease = () => {
    try {
      const lease = read();
      return valid(lease) && lease?.owner === owner;
    } catch {
      return false;
    }
  };
  const check = async () => {
    if (closed || checking || !available) return;
    checking = true;
    try {
      const lease = read();
      if (valid(lease) && lease?.owner !== owner) {
        setActive(false);
        return;
      }
      localStorage.setItem(
        LEASE_KEY,
        JSON.stringify({ owner, expiresAt: Date.now() + LEASE_MS }),
      );
      // Contending claimants observe the final owner before editing any game state.
      await new Promise((resolve) => setTimeout(resolve, 80));
      if (!closed) setActive(ownsLease());
    } catch {
      available = false;
      setActive(false);
    } finally {
      checking = false;
    }
  };
  await check();
  const interval = window.setInterval(() => {
    void check();
  }, HEARTBEAT_MS);
  const listener = () => {
    if (active && !ownsLease()) setActive(false);
    if (!active) void check();
  };
  window.addEventListener("storage", listener);
  window.addEventListener("focus", listener);
  return {
    get active() {
      return !closed && active && ownsLease();
    },
    mode: available ? "lease" : "unavailable",
    close() {
      closed = true;
      clearInterval(interval);
      window.removeEventListener("storage", listener);
      window.removeEventListener("focus", listener);
      try {
        if (read()?.owner === owner) localStorage.removeItem(LEASE_KEY);
      } catch {
        /* Save errors are surfaced by the caller. */
      }
      setActive(false);
    },
  };
}
