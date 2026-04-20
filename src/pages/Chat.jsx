import { useState } from "react";
import { products } from "../data/products";
import { parseIntent } from "../lib/intentParser";
import { filterProducts } from "../lib/filter";
import ProductCard from "../components/ProductCard";
import DemoChips from "../components/DemoChips";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend(text) {
    if (!text || !text.trim() || loading) return;

    setLoading(true);

    try {
      // ✅ SAFE PARSE
      const intent = parseIntent(text) || {};

      // ✅ SAFE FILTER
      let result;
      try {
        result = filterProducts(products, intent);
      } catch (e) {
        console.error("Filter error:", e);
        result = { type: "normal", items: products.slice(0, 3) };
      }

      // ✅ RESPONSE LOGIC
      let reply = "";

      switch (result.type) {
        case "under":
          reply = "Here are the best options within your budget.";
          break;

        case "fallbackUnder":
          reply = `No products found under ₹${intent.maxBudget}. Showing slightly higher options.`;
          break;

        case "above":
          reply = `Here are products above ₹${intent.minBudget}.`;
          break;

        case "fallbackAbove":
          reply = `No products found above ₹${intent.minBudget}. Showing closest premium options.`;
          break;

        default:
          reply = "Here are some good options for you.";
      }

      setMessages(prev => [
        ...prev,
        { role: "user", text },
        { role: "bot", text: reply, products: result.items }
      ]);

      setInput("");
    } catch (err) {
      console.error("Chat error:", err);

      setMessages(prev => [
        ...prev,
        { role: "user", text },
        {
          role: "bot",
          text: "Something went wrong. Please try again.",
        }
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <DemoChips onClick={handleSend} />

      <div className="space-y-4 mb-24">
        {messages.map((m, i) => (
          <div key={i}>
            <div
              className={`p-3 rounded-xl max-w-[75%] text-sm ${
                m.role === "user"
                  ? "bg-stone-900 text-white ml-auto"
                  : "bg-white border shadow-sm"
              }`}
            >
              {m.text}
            </div>

            {m.products && (
              <div className="mt-2 grid gap-3">
                {m.products.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-4 left-0 right-0 flex justify-center">
        <div className="bg-white border rounded-xl p-2 flex gap-2 w-full max-w-2xl shadow-lg">
          <input
            className="flex-1 outline-none px-3 text-sm"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask for products..."
          />
          <button
            onClick={() => handleSend(input)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 rounded-lg text-sm"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}