import { useState, useEffect, useRef } from "react";
import { Plus, Check, Trash2 } from "lucide-react";

// Itens comuns pré-definidos
const COMMON_ITEMS = [
  { name: "arroz", emoji: "🍚" },
  { name: "feijão", emoji: "🫘" },
  { name: "açúcar", emoji: "🍬" },
  { name: "sal", emoji: "🧂" },
  { name: "óleo", emoji: "🫗" },
  { name: "café", emoji: "☕" },
  { name: "leite", emoji: "🥛" },
  { name: "pão", emoji: "🍞" },
  { name: "manteiga", emoji: "🧈" },
  { name: "ovos", emoji: "🥚" },
  { name: "queijo", emoji: "🧀" },
  { name: "presunto", emoji: "🥓" },
  { name: "frango", emoji: "🍗" },
  { name: "carne", emoji: "🥩" },
  { name: "peixe", emoji: "🐟" },
  { name: "banana", emoji: "🍌" },
  { name: "maçã", emoji: "🍎" },
  { name: "laranja", emoji: "🍊" },
  { name: "tomate", emoji: "🍅" },
  { name: "cebola", emoji: "🧅" },
  { name: "alho", emoji: "🧄" },
  { name: "batata", emoji: "🥔" },
  { name: "cenoura", emoji: "🥕" },
  { name: "alface", emoji: "🥬" },
  { name: "macarrão", emoji: "🍝" },
  { name: "molho de tomate", emoji: "🥫" },
  { name: "biscoito", emoji: "🍪" },
  { name: "chocolate", emoji: "🍫" },
  { name: "refrigerante", emoji: "🥤" },
  { name: "suco", emoji: "🧃" },
  { name: "água", emoji: "💧" },
  { name: "papel higiênico", emoji: "🧻" },
  { name: "sabonete", emoji: "🧼" },
  { name: "detergente", emoji: "🧴" },
  { name: "amaciante", emoji: "🧺" },
];

interface Item {
  id: number;
  name: string;
  emoji: string;
}

interface ShoppingItem extends Item {
  addedAt: string;
}

interface KnownItem {
  name: string;
  emoji: string;
}

export function ShoppingList() {
  const [inputValue, setInputValue] = useState("");
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [knownItems, setKnownItems] = useState<KnownItem[]>(COMMON_ITEMS);
  const [suggestions, setSuggestions] = useState<KnownItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [nextId, setNextId] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedList = localStorage.getItem("shoppingList");
    const savedKnownItems = localStorage.getItem("knownItems");
    const savedNextId = localStorage.getItem("nextId");

    if (savedList) {
      setShoppingList(JSON.parse(savedList));
    }
    if (savedKnownItems) {
      // Mesclar itens salvos com os comuns (sem duplicar)
      const saved = JSON.parse(savedKnownItems);
      const merged = [...COMMON_ITEMS];
      saved.forEach((item: KnownItem) => {
        if (
          !merged.some((m) => m.name.toLowerCase() === item.name.toLowerCase())
        ) {
          merged.push(item);
        }
      });
      setKnownItems(merged);
    }
    if (savedNextId) {
      setNextId(parseInt(savedNextId));
    }
  }, []);

  // Salvar lista de compras no localStorage
  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
  }, [shoppingList]);

  // Salvar itens conhecidos no localStorage
  useEffect(() => {
    localStorage.setItem("knownItems", JSON.stringify(knownItems));
  }, [knownItems]);

  // Salvar próximo ID no localStorage
  useEffect(() => {
    localStorage.setItem("nextId", nextId.toString());
  }, [nextId]);

  // Atualizar sugestões baseado no input
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

  const generateRandomEmoji = () => {
    const emojis = ["🛒", "📦", "🎁", "⭐", "✨", "🔖", "📌"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const addItem = (name: string, emoji?: string) => {
    if (!name.trim()) return;

    if (
      shoppingList.some(
        (item) => item.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      return;
    }

    let itemEmoji = emoji;

    if (!itemEmoji) {
      const existingKnown = knownItems.find(
        (item) => item.name.toLowerCase() === name.toLowerCase(),
      );

      if (existingKnown) {
        itemEmoji = existingKnown.emoji;
      } else {
        itemEmoji = generateRandomEmoji();

        const newKnownItem = {
          name: name.toLowerCase(),
          emoji: itemEmoji,
        };

        setKnownItems((prev) => [...prev, newKnownItem]);
      }
    }

    const newItem: ShoppingItem = {
      id: nextId,
      name: name.trim(),
      emoji: itemEmoji,
      addedAt: new Date().toISOString(),
    };

    setShoppingList((prev) => [...prev, newItem]);
    setNextId((prev) => prev + 1);
    setInputValue("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addItem(inputValue);
  };

  const selectSuggestion = (item: KnownItem) => {
    addItem(item.name, item.emoji);
  };

  const removeItem = (id: number) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  const markAsPurchased = (item: ShoppingItem) => {
    // Adicionar ao histórico
    const historyItem = {
      ...item,
      purchasedAt: new Date().toISOString(),
    };

    const savedHistory = localStorage.getItem("shoppingHistory");
    const history = savedHistory ? JSON.parse(savedHistory) : [];
    history.push(historyItem);
    localStorage.setItem("shoppingHistory", JSON.stringify(history));

    // Remover da lista
    removeItem(item.id);
  };

  return (
    <div className="space-y-6">
      {/* Formulário de adição */}
      <div className="bg-zinc-900 rounded-lg p-4 shadow-xl border border-zinc-800">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite o nome do item..."
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />

              {/* Sugestões */}
              {showSuggestions && (
                <div className="absolute z-10 w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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

      {/* Lista de compras */}
      <div className="space-y-3">
        {shoppingList.length === 0 ? (
          <div className="bg-zinc-900 rounded-lg p-8 text-center border border-zinc-800">
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
              className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition-all group"
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
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Remover item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {shoppingList.length > 0 && (
        <div className="text-center text-zinc-500 text-sm">
          {shoppingList.length} {shoppingList.length === 1 ? "item" : "itens"}{" "}
          na lista
        </div>
      )}
    </div>
  );
}
