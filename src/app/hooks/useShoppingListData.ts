import { useEffect, useMemo, useState } from "react";
import type { HistoryItem, ShoppingItem } from "../storage";
import {
  loadHistory,
  loadKnownItems,
  loadShoppingList,
  saveHistory,
  saveKnownItems,
  saveShoppingList,
  storageKeys,
} from "../storage";
import type { KnownItem } from "../data/commonItems";

const randomEmoji = () => {
  const emojis = ["📦"];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

const normalizeName = (value: string) => value.trim().toLowerCase();

export const useShoppingListData = () => {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(loadShoppingList);
  const [knownItems, setKnownItems] = useState<KnownItem[]>(loadKnownItems);

  useEffect(() => saveShoppingList(shoppingList), [shoppingList]);
  useEffect(() => saveKnownItems(knownItems), [knownItems]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === storageKeys.list) {
        setShoppingList(loadShoppingList());
      }
      if (event.key === storageKeys.known) {
        setKnownItems(loadKnownItems());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const ensureKnownItem = (name: string, emoji?: string) => {
    const normalized = normalizeName(name);
    const existing = knownItems.find(
      (item) => normalizeName(item.name) === normalized,
    );

    if (existing) return existing.emoji;

    const assignedEmoji = emoji || randomEmoji();
    setKnownItems((prev) => [...prev, { name: normalized, emoji: assignedEmoji }]);
    return assignedEmoji;
  };

  const addItem = (name: string, explicitEmoji?: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const normalized = normalizeName(trimmed);
    const alreadyExists = shoppingList.some(
      (item) => normalizeName(item.name) === normalized,
    );
    if (alreadyExists) return;

    const emoji = explicitEmoji || ensureKnownItem(trimmed, explicitEmoji);

    const newItem: ShoppingItem = {
      id: crypto.randomUUID(),
      name: trimmed,
      emoji,
      addedAt: new Date().toISOString(),
    };

    setShoppingList((prev) => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  const markAsPurchased = (item: ShoppingItem) => {
    const historyItem: HistoryItem = {
      ...item,
      purchasedAt: new Date().toISOString(),
    };

    const updatedHistory = [...loadHistory(), historyItem];
    saveHistory(updatedHistory);
    removeItem(item.id);
  };

  const suggestions = useMemo(() => knownItems, [knownItems]);

  return {
    shoppingList,
    knownItems: suggestions,
    addItem,
    removeItem,
    markAsPurchased,
  } as const;
};
