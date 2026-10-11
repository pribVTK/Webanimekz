import NodeCache from 'node-cache';

// Cache TTL: 10 minutes for dynamic content, 1 hour for static
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

export function getCache(key) {
  return cache.get(key);
}

export function setCache(key, value, ttl = 600) {
  cache.set(key, value, ttl);
}

export function withCache(key, fn, ttl = 600) {
  return async (...args) => {
    const cacheKey = `${key}:${JSON.stringify(args)}`;
    const cached = cache.get(cacheKey);
    if (cached !== undefined) return cached;
    const result = await fn(...args);
    cache.set(cacheKey, result, ttl);
    return result;
  };
}
