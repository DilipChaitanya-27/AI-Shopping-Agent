// src/components/DemoChips.jsx
export default function DemoChips({ onClick }) {
  const prompts = [
    "skincare for oily skin under 500",
    "gift for mom skincare",
    "routine for dry skin"
  ];

  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {prompts.map((p, i) => (
        <button
          key={i}
          onClick={() => onClick(p)}
          className="text-xs bg-white border px-3 py-1 rounded-full"
        >
          {p}
        </button>
      ))}
    </div>
  );
}