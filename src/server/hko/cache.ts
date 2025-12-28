type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

export function createTtlCache() {
  const store = new Map<string, CacheEntry<unknown>>();

  function get<T>(key: string): T | undefined {
    const entry = store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  function set<T>(key: string, value: T, ttlMs: number) {
    store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  return { get, set };
}
