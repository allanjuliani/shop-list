import type { KnownItem } from "./data/commonItems";
import { COMMON_ITEMS } from "./data/commonItems";

export interface ShoppingItem {
  id: string;
  name: string;
  emoji: string;
  addedAt: string;
}

export interface HistoryItem extends ShoppingItem {
  purchasedAt: string;
}

const STORAGE_KEYS = {
  list: "shoppingList",
  known: "knownItems",
  history: "shoppingHistory",
} as const;

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (_) {
    return fallback;
  }
};

const normalizeName = (name: string) => name.trim().toLowerCase();

export const loadShoppingList = (): ShoppingItem[] => {
  const parsed = safeParse<ShoppingItem[]>(localStorage.getItem(STORAGE_KEYS.list), []);
  const seen = new Set<string>();
  return parsed.filter((item) => {
    const key = item.id || `${item.name}-${item.addedAt}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return Boolean(item.name);
  });
};

export const saveShoppingList = (list: ShoppingItem[]) => {
  localStorage.setItem(STORAGE_KEYS.list, JSON.stringify(list));
};

export const loadKnownItems = (): KnownItem[] => {
  const saved = safeParse<KnownItem[]>(localStorage.getItem(STORAGE_KEYS.known), []);
  const merged = [...COMMON_ITEMS];
  saved.forEach((item) => {
    if (!merged.some((m) => normalizeName(m.name) === normalizeName(item.name))) {
      merged.push(item);
    }
  });
  return merged;
};

export const saveKnownItems = (items: KnownItem[]) => {
  localStorage.setItem(STORAGE_KEYS.known, JSON.stringify(items));
};

export const loadHistory = (): HistoryItem[] => {
  const parsed = safeParse<HistoryItem[]>(localStorage.getItem(STORAGE_KEYS.history), []);
  return parsed
    .filter((item) => Boolean(item.purchasedAt))
    .sort(
      (a, b) =>
        new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime(),
    );
};

export const saveHistory = (history: HistoryItem[]) => {
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
};

export const storageKeys = STORAGE_KEYS;
