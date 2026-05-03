import { useTheme } from "../context/ThemeContext";

export default function ScoreBar({ label, score, color = "bg-orange-500", icon }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const scorePercent = Math.min(100, Math.max(0, score));

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[50px]">
        {label}:
      </span>
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all ${color}`} 
          style={{ width: `${scorePercent}%` }}
        />
      </div>
      <span className="text-xs font-bold text-gray-700 dark:text-gray-200 w-8">
        {icon} {scorePercent}
      </span>
    </div>
  );
}
