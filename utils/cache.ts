interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

type CacheData = {
  [key: string]: unknown;
};

export class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<unknown>>;
  private readonly DEFAULT_EXPIRY = 1000 * 60 * 60; // 1 hour

  private constructor() {
    this.cache = new Map();
    this.loadFromStorage();
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('github_explorer_cache');
      if (stored) {
        const data = JSON.parse(stored) as CacheData;
        Object.entries(data).forEach(([key, value]) => {
          const cacheItem = value as CacheItem<unknown>;
          if (!this.isExpired(cacheItem)) {
            this.cache.set(key, cacheItem);
          }
        });
      }
    } catch (error) {
      console.error('Error loading cache:', error);
    }
  }

  private saveToStorage() {
    try {
      const data = Object.fromEntries(this.cache.entries());
      localStorage.setItem('github_explorer_cache', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  }

  private isExpired(item: CacheItem<unknown>): boolean {
    return Date.now() - item.timestamp > item.expiresIn;
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined;
    if (!item || this.isExpired(item)) {
      this.cache.delete(key);
      this.saveToStorage();
      return null;
    }
    return item.data;
  }

  set<T>(key: string, data: T, expiresIn: number = this.DEFAULT_EXPIRY): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn,
    });
    this.saveToStorage();
  }

  clear(): void {
    this.cache.clear();
    localStorage.removeItem('github_explorer_cache');
  }
}
