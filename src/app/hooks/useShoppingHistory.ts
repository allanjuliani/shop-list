import { useEffect, useState } from "react";
import type { HistoryItem } from "../storage";
import { loadHistory, saveHistory, storageKeys } from "../storage";

export const useShoppingHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === storageKeys.history) {
        setHistory(loadHistory());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const clearHistory = () => {
    saveHistory([]);
    setHistory([]);
  };

  const removeItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);
    setHistory(updated);
  };

  return { history, clearHistory, removeItem } as const;
};
