type CacheEntry<T> = { data: T; expiresAt: number };

const store = new Map<string, CacheEntry<unknown>>();

// Clean expired entries every 60 seconds
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.expiresAt <= now) store.delete(key);
  }
}, 60_000);

export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>
): Promise<T> {
  const hit = store.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.data as T;

  const result = await fn();
  store.set(key, { data: result, expiresAt: Date.now() + ttlSeconds * 1000 });
  return result;
}

export function invalidate(pattern: string) {
  const now = Date.now();
  for (const [key] of store) {
    if (key.startsWith(pattern) && !pattern.endsWith("*")) {
      store.delete(key);
    }
    // pattern: "listings:*" — match prefix
    if (pattern.endsWith("*")) {
      const prefix = pattern.slice(0, -1);
      if (key.startsWith(prefix)) store.delete(key);
    }
  }
}

export function cachedSync<T>(key: string): T | undefined {
  const hit = store.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.data as T;
  return undefined;
}
