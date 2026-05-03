export default function AdvisorPanel({ advisor }) {
  if (!advisor) return null;

  const stageColors = {
    browsing:  "bg-blue-100 text-blue-700",
    narrowing: "bg-amber-100 text-amber-700",
    comparing: "bg-violet-100 text-violet-700",
    ready_to_buy: "bg-emerald-100 text-emerald-700",
    deciding:  "bg-orange-100 text-orange-700",
  };

  const stageIcon = {
    browsing: "🔍",
    narrowing: "🎯",
    comparing: "⚖️",
    ready_to_buy: "🛒",
    deciding: "🤔",
  };

  return (
    <div className="mt-3 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧠</span>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">ShopSense Advisor</span>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${stageColors[advisor.shoppingStage] || stageColors.browsing}`}>
          {stageIcon[advisor.shoppingStage] || "🔍"} {advisor.shoppingStage}
        </span>
      </div>

      {advisor.intentSummary && (
        <div className="mb-3 flex items-start gap-2">
          <span className="text-indigo-400 mt-0.5">💡</span>
          <p className="text-sm text-gray-700 font-medium">{advisor.intentSummary}</p>
        </div>
      )}

      {Array.isArray(advisor.tradeoffs) && advisor.tradeoffs.length > 0 && (
        <div className="space-y-2 mb-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Tradeoffs to Consider</p>
          {advisor.tradeoffs.map((t, ti) => (
            <div key={ti} className="flex items-start gap-2 bg-white/60 rounded-lg p-2">
              <span className="text-amber-500 mt-0.5 shrink-0">⚖️</span>
              <div className="text-xs">
                <span className="font-semibold text-gray-700">{t.factor}:</span>
                <span className="text-gray-500 ml-1">{t.context}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {advisor.suggestedNextStep && (
        <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold bg-white/60 rounded-lg p-2">
          <span className="text-indigo-500">→</span>
          {advisor.suggestedNextStep}
        </div>
      )}
    </div>
  );
}

