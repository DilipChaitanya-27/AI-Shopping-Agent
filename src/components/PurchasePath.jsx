export default function PurchasePath({ currentStage, confidence }) {
  const stages = [
    { key: "browsing", label: "Browsing", icon: "🔍" },
    { key: "narrowing", label: "Narrowing", icon: "🎯" },
    { key: "comparing", label: "Comparing", icon: "⚖️" },
    { key: "deciding", label: "Deciding", icon: "🤔" },
    { key: "ready_to_buy", label: "Ready", icon: "🛒" },
  ];

  const activeIndex = stages.findIndex((s) => s.key === currentStage);
  const pct = Math.max(0, Math.min(100, Math.round((confidence ?? 0) * 100)));

  return (
    <div className="mt-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Purchase Journey
        </span>
        <span className="text-xs font-semibold text-gray-700">
          Confidence: {pct}%
        </span>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-orange-500 rounded-full transition-all duration-500"
          style={{ width: `${((activeIndex + 1) / stages.length) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        {stages.map((stage, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;
          return (
            <div key={stage.key} className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-xs border-2 transition ${
                  isActive
                    ? "bg-orange-500 text-white border-orange-500"
                    : isPast
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-white text-gray-400 border-gray-200"
                }`}
              >
                {isPast ? "✓" : stage.icon}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-orange-600" : "text-gray-400"
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

