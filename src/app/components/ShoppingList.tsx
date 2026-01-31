import { useEffect, useRef, useState } from "react";
import { Plus, Check, Trash2 } from "lucide-react";
import { useShoppingListData } from "../hooks/useShoppingListData";
import type { KnownItem } from "../data/commonItems";

export function ShoppingList() {
  const { shoppingList, knownItems, addItem, removeItem, markAsPurchased } =
    useShoppingListData();
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<KnownItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [swipeOffsets, setSwipeOffsets] = useState<Record<string, number>>({});
  const [swipingId, setSwipingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const touchStartX = useRef<Record<string, number>>({});
  const suggestionListId = "shopping-suggestions";

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = knownItems.filter(
        (item) =>
          item.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !shoppingList.some(
            (si) => si.name.toLowerCase() === item.name.toLowerCase(),
          ),
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, knownItems, shoppingList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addItem(inputValue);
    setInputValue("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const selectSuggestion = (item: KnownItem) => {
    addItem(item.name, item.emoji);
    setInputValue("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleTouchStart = (id: string, x: number) => {
    if (!Number.isFinite(x)) return;
    touchStartX.current[id] = x;
    setSwipingId(id);
  };

  const handleTouchMove = (id: string, x: number) => {
    const start = touchStartX.current[id];
    if (!Number.isFinite(start) || !Number.isFinite(x)) return;
    const delta = x - start;
    const clamped = Math.max(-150, Math.min(0, delta));
    setSwipeOffsets((prev) => ({ ...prev, [id]: clamped }));
  };

  const handleTouchEnd = (id: string, x: number) => {
    const start = touchStartX.current[id];
    delete touchStartX.current[id];
    setSwipingId(null);
    if (!Number.isFinite(start) || !Number.isFinite(x)) return;
    const delta = x - start;
    const SWIPE_THRESHOLD = -80;
    if (delta <= SWIPE_THRESHOLD) {
      removeItem(id);
      setSwipeOffsets((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    } else {
      setSwipeOffsets((prev) => ({ ...prev, [id]: 0 }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 rounded-lg p-4 shadow-xl border border-zinc-800">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                id="item-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite o nome do item..."
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                aria-autocomplete="list"
                aria-controls={suggestionListId}
                aria-expanded={showSuggestions}
                aria-haspopup="listbox"
              />

              {showSuggestions && (
                <div
                  id={suggestionListId}
                  role="listbox"
                  className="absolute z-50 w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {suggestions.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectSuggestion(item)}
                      className="w-full px-4 py-3 text-left hover:bg-zinc-700 transition-colors flex items-center gap-3 border-b border-zinc-700 last:border-b-0"
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-zinc-100 capitalize">
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Adicionar</span>
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-3">
        {shoppingList.length === 0 ? (
          <div
            className="bg-zinc-900 rounded-lg p-8 text-center border border-zinc-800"
            role="status"
            aria-live="polite"
          >
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-zinc-400">Sua lista está vazia</p>
            <p className="text-zinc-500 text-sm mt-2">
              Adicione itens para começar
            </p>
          </div>
        ) : (
          shoppingList.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden"
              onTouchStart={(e) =>
                handleTouchStart(item.id, e.touches[0]?.clientX ?? 0)
              }
              onTouchMove={(e) =>
                handleTouchMove(item.id, e.touches[0]?.clientX ?? 0)
              }
              onTouchEnd={(e) =>
                handleTouchEnd(item.id, e.changedTouches[0]?.clientX ?? 0)
              }
              onTouchCancel={() => {
                delete touchStartX.current[item.id];
                setSwipeOffsets((prev) => ({ ...prev, [item.id]: 0 }));
                setSwipingId(null);
              }}
            >
              <div className="absolute inset-0 bg-red-900/40 rounded-xl border border-red-800 flex items-center justify-end pr-4">
                <div className="flex items-center gap-2 text-red-200">
                  <Trash2 size={18} />
                  <span className="text-sm font-medium">Excluir</span>
                </div>
              </div>

              <div
                className="relative z-10 bg-zinc-900 rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition-all group"
                style={{
                  transform: `translateX(${swipeOffsets[item.id] ?? 0}px)`,
                  transition:
                    swipingId === item.id ? "none" : "transform 0.2s ease",
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="flex-1 text-lg capitalize text-zinc-100">
                    {item.name}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => markAsPurchased(item)}
                      className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                      title="Marcar como comprado"
                    >
                      <Check size={20} />
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="hidden sm:block p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Remover item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {shoppingList.length > 0 && (
        <div className="text-center text-zinc-500 text-sm" aria-live="polite">
          {shoppingList.length} {shoppingList.length === 1 ? "item" : "itens"}{" "}
          na lista
        </div>
      )}
    </div>
  );
}
