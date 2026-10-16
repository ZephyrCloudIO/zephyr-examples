/**
 * Keeps answers from Zephyr for a few seconds, and keeps the last good answer for
 * as long as Zephyr can't be reached, so an outage doesn't take pages down:
 *
 * - A value is fresh for `ttlMs`. After that, the next request starts one refresh
 *   in the background, and every request keeps getting the cached value meanwhile.
 * - A failed refresh logs a warning, keeps the last good value, and tries again
 *   `ttlMs` later.
 * - Only a request with nothing cached waits for Zephyr, so only it can fail. A
 *   server that starts during an outage has nothing to fall back to.
 *
 * These are HTTP's `stale-while-revalidate` and `stale-if-error`, done in memory.
 */
export class StaleCache<T> {
  readonly #entries = new Map<string, Entry<T>>();
  readonly #ttlMs: number;
  readonly #maxEntries: number;

  constructor(ttlMs: number, maxEntries = 100) {
    this.#ttlMs = ttlMs;
    this.#maxEntries = maxEntries;
  }

  get(key: string, load: () => Promise<T>): Promise<T> {
    let entry = this.#entries.get(key);
    if (!entry) {
      entry = { expiresAt: 0 };
      this.#entries.set(key, entry);
      // Keys can come from requests, so keep memory bounded: drop the oldest key.
      if (this.#entries.size > this.#maxEntries) {
        this.#entries.delete(this.#entries.keys().next().value!);
      }
    }

    if (!entry.pending && entry.expiresAt <= Date.now()) {
      entry.pending = this.#refresh(key, entry, load);
    }

    return entry.value === undefined ? entry.pending! : Promise.resolve(entry.value);
  }

  async #refresh(key: string, entry: Entry<T>, load: () => Promise<T>): Promise<T> {
    try {
      entry.value = await load();
    } catch (error) {
      if (entry.value === undefined) throw error;
      console.warn(`Zephyr unreachable, still using the last good response for ${key}:`, error);
    } finally {
      entry.pending = undefined;
    }
    entry.expiresAt = Date.now() + this.#ttlMs;
    return entry.value;
  }
}

interface Entry<T> {
  value?: T;
  expiresAt: number;
  /** The refresh in flight, shared by every request that arrives meanwhile. */
  pending?: Promise<T>;
}
