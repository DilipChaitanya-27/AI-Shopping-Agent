import { motion, AnimatePresence } from "framer-motion";
import ScoreBar from "./ScoreBar";

export default function ProductComparison({ products, comparison, onClose }) {
  if (!products || products.length < 2) return null;

  // 🧠 AUTO WINNER (fallback if not provided)
  let winnerIdx = comparison?.winnerIndex;

  if (winnerIdx === undefined) {
    winnerIdx = products.reduce((bestIdx, p, i, arr) => {
      const bestScore = arr[bestIdx]?._scores?.overall || 0;
      const currentScore = p._scores?.overall || 0;
      return currentScore > bestScore ? i : bestIdx;
    }, 0);
  }

  const winner = products[winnerIdx];

  // 🧠 AUTO COMPARISON (fallback)
  const autoComparison = products.map((p, i) => ({
    name: p.name,
    price: p.price,
    isWinner: i === winnerIdx,
  }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="mt-4 bg-white border border-indigo-200 rounded-2xl p-4 shadow-lg"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-indigo-800 flex items-center gap-2">
            ⚖️ Smart Comparison
          </h3>
          <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* SUMMARY */}
        <p className="text-xs text-gray-600 mb-3 bg-indigo-50 p-2 rounded-lg">
          {comparison?.summary ||
            "Here’s a quick comparison to help you choose the best option."}
        </p>

        {/* HEAD TO HEAD */}
        {comparison?.headToHead?.length > 0 && (
          <div className="space-y-2 mb-4">
            {comparison.headToHead.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-20 shrink-0 font-semibold text-gray-500">
                  {h.aspect}
                </span>
                <span className="flex-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  {h.winner}
                </span>
                <span className="flex-1 text-gray-400 bg-gray-50 px-2 py-1 rounded">
                  {h.loser}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* PRODUCT GRID */}
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${products.length}, 1fr)` }}
        >
          {products.map((p, i) => (
            <div
              key={p.id}
              className={`border rounded-xl p-3 ${
                i === winnerIdx
                  ? "border-yellow-400 bg-yellow-50/50"
                  : "border-gray-200"
              }`}
            >
              {i === winnerIdx && (
                <span className="text-[10px] bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold mb-1 inline-block">
                  🏆 Best Choice
                </span>
              )}

              <p className="text-xs font-bold text-gray-800 mb-1 truncate">
                {p.name}
              </p>

              <p className="text-sm font-bold text-black mb-2">
                ₹{p.price?.toLocaleString()}
              </p>

              {/* SCORES */}
              <div className="space-y-1.5">
                <ScoreBar label="Overall" score={p._scores?.overall} color="bg-indigo-500" />
                <ScoreBar label="Value" score={p._scores?.value} color="bg-emerald-500" />
                <ScoreBar label="Quality" score={p._scores?.quality} color="bg-amber-500" />
                <ScoreBar label="Match" score={p._scores?.intentMatch} color="bg-violet-500" />
              </div>

              {/* FEATURES */}
              {p.features?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.features.slice(0, 3).map((f, fi) => (
                    <span
                      key={fi}
                      className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 🔥 FINAL RECOMMENDATION (NEW) */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-xl">
          <p className="text-sm font-semibold text-yellow-900">
            👉 Recommended: {winner?.name}
          </p>
          <p className="text-xs text-yellow-800 mt-1">
            This option offers the best balance of price, quality, and match for your needs.
          </p>
        </div>

        {/* ⚠️ TRADEOFFS (NEW) */}
        <div className="mt-3 text-xs text-gray-600">
          <p className="font-semibold mb-1">⚠ Tradeoffs:</p>
          <ul className="list-disc pl-4 space-y-1">
            {products
              .filter((_, i) => i !== winnerIdx)
              .map((p, i) => (
                <li key={i}>
                  {p.name} may be better in some aspects but loses overall balance.
                </li>
              ))}
          </ul>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}