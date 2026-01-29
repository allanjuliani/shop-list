import { Calendar, Trash2, ShoppingBag } from "lucide-react";
import { useShoppingHistory } from "../hooks/useShoppingHistory";
import type { HistoryItem } from "../storage";

export function ShoppingHistory() {
  const { history, clearHistory, removeItem } = useShoppingHistory();

  const handleClearHistory = () => {
    if (window.confirm("Deseja realmente limpar todo o histórico?")) {
      clearHistory();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `Hoje às ${date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (diffInHours < 48) {
      return `Ontem às ${date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Agrupar por data
  const groupedHistory = history.reduce(
    (acc, item) => {
      const date = new Date(item.purchasedAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(item);
      return acc;
    },
    {} as Record<string, HistoryItem[]>,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      {history.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-zinc-400 text-sm flex items-center gap-2">
            <ShoppingBag size={16} />
            <span>
              {history.length}{" "}
              {history.length === 1 ? "item comprado" : "itens comprados"}
            </span>
          </div>

          <button
            onClick={handleClearHistory}
            className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} />
            Limpar histórico
          </button>
        </div>
      )}

      {/* Lista */}
      {history.length === 0 ? (
        <div className="bg-zinc-900 rounded-lg p-8 text-center border border-zinc-800">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-zinc-400">Nenhum item comprado ainda</p>
          <p className="text-zinc-500 text-sm mt-2">
            Seu histórico aparecerá aqui
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedHistory).map(([date, items]) => (
            <div key={date} className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Calendar size={16} />
                <h3 className="font-medium capitalize">{date}</h3>
              </div>

              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.purchasedAt}`}
                    className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{item.emoji}</span>

                      <div className="flex-1">
                        <div className="text-lg capitalize text-zinc-100">
                          {item.name}
                        </div>
                        <div className="text-sm text-zinc-500 mt-1">
                          {formatDate(item.purchasedAt)}
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 bg-zinc-800 hover:bg-red-600 text-zinc-400 hover:text-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Remover do histórico"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
