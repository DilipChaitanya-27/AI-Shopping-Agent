export default function FollowUpChips({ question, onAnswer }) {
  if (!question) return null;

  const quickReplies = ["Yes", "No", "Tell me more"];

  return (
    <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
      <p className="text-xs text-indigo-600 font-medium mb-2">{question}</p>
      <div className="flex gap-2 flex-wrap">
        {quickReplies.map((reply) => (
          <button
            key={reply}
            onClick={() => onAnswer(reply)}
            className="text-xs bg-white border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-100 transition"
          >
            {reply}
          </button>
        ))}
      </div>
    </div>
  );
}

