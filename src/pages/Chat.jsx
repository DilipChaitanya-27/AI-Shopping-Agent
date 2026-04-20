import { useState } from "react";
import { products } from "../data/products";
import { parseIntent } from "../lib/intentParser";
import { filterProducts } from "../lib/filter";
import { getAIResponse } from "../lib/ai";
import ProductCard from "../components/ProductCard";
import Chips from "../components/Chips";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [intent, setIntent] = useState({});

  async function send() {
    if (!input.trim()) return;

    const newIntent = { ...intent, ...parseIntent(input) };
    setIntent(newIntent);

    const filtered = filterProducts(products, newIntent);

    let aiText = await getAIResponse(input, filtered);

    if (!aiText) {
      aiText = "Here are the best options based on your needs.";
    }

    setMessages(prev => [
      ...prev,
      { role: "user", text: input },
      { role: "bot", text: aiText, products: filtered }
    ]);

    setInput("");
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>Chat</h2>

      <Chips intent={intent} />

      {messages.map((m, i) => (
        <div key={i}>
          <b>{m.role}:</b> {m.text}

          {m.products && m.products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ))}

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ask something..."
      />

      <button onClick={send}>Send</button>
    </div>
  );
}