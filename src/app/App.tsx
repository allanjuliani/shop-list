import { useState, useEffect } from "react";
import { ShoppingList } from "./components/ShoppingList";
import { ShoppingHistory } from "./components/ShoppingHistory";
import { ShoppingCart, History } from "lucide-react";
import { initGA, trackPage } from "../analytics";

export default function App() {
  const [activeTab, setActiveTab] = useState<"list" | "history">("list");
  useEffect(() => {
    initGA();
    trackPage("/");
  }, []);
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto p-4 supports-[(-webkit-touch-callout:none)]:pt-18">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Lista de Mercado
          </h1>

          {/* Tabs */}
          <div
            className="flex gap-2 bg-zinc-900 p-1 rounded-lg"
            role="tablist"
            aria-label="Navegação da lista"
          >
            <button
              onClick={() => setActiveTab("list")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all ${activeTab === "list"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-zinc-400 hover:text-zinc-300"
                }`}
              role="tab"
              aria-pressed={activeTab === "list"}
              aria-selected={activeTab === "list"}
            >
              <ShoppingCart size={20} />
              <span className="font-medium">Lista</span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all ${activeTab === "history"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-zinc-400 hover:text-zinc-300"
                }`}
              role="tab"
              aria-pressed={activeTab === "history"}
              aria-selected={activeTab === "history"}
            >
              <History size={20} />
              <span className="font-medium">Histórico</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "list" ? <ShoppingList /> : <ShoppingHistory />}
      </div>
    </div>
  );
}
