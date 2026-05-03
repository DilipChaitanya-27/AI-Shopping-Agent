import { useState, useEffect, useRef, useCallback, useId } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";


import { parseIntent, normalizeInput, getNextQuestion } from "../lib/intentParser";
import { getAIResponse } from "../lib/ai";
import { getCurrentState, CONVERSATION_STATES } from "../lib/memory.js";
import { addFeedback } from "../lib/memory.js";

import { fetchShopifyProducts } from "../lib/shopify";
import { products as localProducts } from "../data/products";

import ProductCard from "../components/ProductCard";
import ChatLeftSidebar from "../components/ChatLeftSidebar";
import ChatRightSidebar from "../components/ChatRightSidebar";
import ChatHero from "../components/ChatHero";
import DemoChips from "../components/DemoChips";

export default function Chat() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const [chatSessions, setChatSessions] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [compareList, setCompareList] = useState([]);

  // AUTH CHECK
  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  // LOAD PRODUCTS
  useEffect(() => {
    async function loadProducts() {
      try {
        setProductsLoading(true);
        const shopifyData = await fetchShopifyProducts();

      if (shopifyData && shopifyData.length > 0) {
  setProducts(shopifyData); // ✅ STRICT SHOPIFY
} else {
  setProducts(localProducts); // fallback only
}
      } catch {
        setProducts(localProducts);
      } finally {
        setProductsLoading(false);
      }
    }
    loadProducts();
  }, []);

  // SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [chatSessions]);
  // VALIDATE CURRENT CHAT
  useEffect(() => {
    const validChat = chatSessions.find(c => c.id === currentChatId);
    if (!validChat && chatSessions.length > 0) {
      setCurrentChatId(chatSessions[0].id);
    }
  }, [chatSessions, currentChatId]);
  // CREATE CHAT ID STATE
  const generateId = () => crypto.randomUUID();
  // CREATE CHAT - FIXED: Prevent multiple if current empty
  const createNewChat = useCallback(() => {
    const currentChat = chatSessions.find(c => c.id === currentChatId);
    if (currentChat && currentChat.messages?.length === 0) {
      return;
    }
    const newChatId = generateId();
    const newChat = {
      id: newChatId,
      title: "New Chat",
      messages: [],
      memory: {},
      //conversationState: CONVERSATION_STATES.INTENT_DISCOVERY,
      createdAt: Date.now()
    };
    setChatSessions(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    // setNextChatId(useId());
  }, [chatSessions, currentChatId]);

  // DELETE CHAT
  const deleteChat = useCallback((chatId) => {
    setChatSessions(prev => {
      const newSessions = prev.filter(c => c.id !== chatId);
      if (chatId === currentChatId && newSessions.length === 0) {
        createNewChat();
      } else if (chatId === currentChatId) {
        setCurrentChatId(newSessions[0]?.id);
      }
      return newSessions;
    });
  }, [currentChatId, createNewChat]);

 function getFollowUp(intent, previousIntent) {
  const category = intent.category || previousIntent?.category;
  const useCase = intent.useCase || previousIntent?.useCase;
  const budget = intent.maxBudget || previousIntent?.maxBudget;

  if (!category) {
    return "What are you looking for—skincare, headphones, or something else?";
  }

  if (category === "headphones" && !useCase) {
    return "Do you want them for music, gaming, or calls?";
  }

  if (!budget) {
    return "What's your budget?";
  }

  return null;
}
// SEND MESSAGE
const handleSend = async (overrideText = null) => {
  const inputText = typeof input === "string" ? input : "";
  const overrideIsValid = typeof overrideText === "string" && overrideText.trim();

  if ((!inputText.trim() && !overrideIsValid) || sending) return;

  setSending(true);

  try {
    const userText = overrideIsValid ? overrideText : inputText;
    setInput("");

    const userMsg = { role: "user", text: userText };
    const currentChat = chatSessions.find(c => c.id === currentChatId);
    const previousMemory = currentChat?.memory || {};
    const previousIntent = previousMemory.intent || {};

    const normalizedText = normalizeInput(userText);

    // 🔥 CENTRALIZED INTENT PIPELINE
    const intent = parseIntent(normalizedText, previousIntent);
    
    const aiRes = await getAIResponse({
      userText,
      intent,
      previousIntent: previousMemory,
      products
    });
    const botMsg = {
      role: "bot",
      text: aiRes.message,
      products: aiRes.products || [],
      state: aiRes.intent?.state
    };

    setChatSessions(prev =>
      prev.map(chat =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMsg, botMsg],
              memory: {
                intent: aiRes.intent,
              },
              title: chat.title || userText.slice(0, 30),
            }
          : chat
      )
    );
    // 🔥 COMPARE MODE
    if (normalizedText === "compare") {
      const lastProducts =
        currentChat?.messages
          ?.slice()
          .reverse()
          .find(m => m.products)?.products || [];

      const comparison =
        lastProducts.length >= 2
          ? {
              headToHead: lastProducts.slice(1).map(p => ({
                aspect: "Overall",
                winner: lastProducts[0].name,
                loser: p.name,
              })),
            }
          : null;

      const botMsg = {
        role: "bot",
        text: comparison
          ? `${lastProducts[0].name} is the best overall.`
          : "Nothing to compare yet.",
        products: lastProducts,
        comparison,
      };

      setChatSessions(prev =>
        prev.map(chat =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, userMsg, botMsg],
                memory: { intent },
              }
            : chat
        )
      );

      return;
    }

    // 🔥 STRICT FILTER BEFORE AI
    const filteredProducts = products.filter(p => {
      const text = `${p.name} ${p.category} ${p.description} ${(p.features || []).join(" ")}`.toLowerCase();

  // ✅ CATEGORY
  if (intent.category && !text.includes(intent.category)) {
    return false;
  }

  // ✅ USE CASE (gaming, music, etc.)
  if (intent.useCase && !text.includes(intent.useCase)) {
    return false;
  }

  // ✅ BUDGET STRICT (NO OVERFLOW)
  if (intent.maxBudget && p.price > intent.maxBudget) {
    return false;
  }

  return true;
});

    if (!filteredProducts.length) {
      const botMsg = {
        role: "bot",
        text: "No matching products found. Try adjusting your preferences.",
        products: [],
      };

      setChatSessions(prev =>
        prev.map(chat =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, userMsg, botMsg],
                memory: { intent },
              }
            : chat
        )
      );

      return;
    }

    const topProducts = filteredProducts.slice(0, 3);

    // 🔥 CONTROLLED AI (ONLY TEXT)
    let aiText = `Best pick: ${topProducts[0].name}`;

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;

      if (apiKey) {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-120b",
            messages: [
              {
                role: "user",
                content: `User: ${userText}
Products:
${topProducts.map(p => `${p.name} ₹${p.price}`).join("\n")}
Give 1-line recommendation.`,
              },
            ],
          }),
        });

        const data = await res.json();
        aiText = data?.choices?.[0]?.message?.content?.slice(0, 120) || aiText;
      }
    } catch {}

    // ✅ Second aiRes REMOVED - fixes redeclaration error
    // Use aiText and topProducts directly

  } catch (err) {
    console.error("handleSend error:", err);
  } finally {
    setSending(false);
  }
};
  const loadChat = (chatId) => setCurrentChatId(chatId);

  const toggleCompare = useCallback((product) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 3) return prev;
      return [...prev, product];
    });
  }, []);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user) return null;

  const currentChat = chatSessions.find(c => c.id === currentChatId);

useEffect(() => {
  if (chatSessions.length === 0) {
    const newId = crypto.randomUUID();

    const newChat = {
      id: newId,
      title: "New Chat",
      messages: [],
      memory: {},
      createdAt: Date.now()
    };

    setChatSessions([newChat]);
    setCurrentChatId(newId);
  }
}, [chatSessions]);
  const isEmpty =
    !currentChat ||
    (currentChat.messages.length === 0 && !productsLoading);

  const isDark = theme === "dark";

  return (
    <div
      className={`
        min-h-screen pt-[80px] transition-colors duration-300

        ${
          isDark
            ? "bg-[radial-gradient(circle_at_80%_20%,rgba(255,115,0,0.12),transparent_40%),radial-gradient(circle_at_10%_80%,rgba(255,115,0,0.08),transparent_40%),#0a0a0a]"
            : "bg-[radial-gradient(circle_at_20%_20%,rgba(255,115,0,0.06),transparent_40%),linear-gradient(135deg,#fff7ed,#ffffff)]"
        }
      `}
    >
      <div className="h-[calc(100vh-4rem)] grid grid-cols-[260px_1fr_320px] overflow-hidden">

        {/* LEFT */}
        <ChatLeftSidebar
          onNewChat={createNewChat}
       onQuickPrompt={(prompt) => {
  if (!currentChatId) createNewChat();
  handleSend(prompt);
}}
          chatSessions={chatSessions}
          onLoadChat={loadChat}
          onDeleteChat={deleteChat}
        />

        {/* CENTER */}
        <div className="flex flex-col h-full overflow-hidden">

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-6 pb-32">
            <div className="max-w-3xl mx-auto space-y-6">

              {isEmpty ? (
                <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
                  <ChatHero />
                </div>
              ) : (
                <>
                  {currentChat?.messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>

                      <div
                        className={`
                          max-w-xl p-4 rounded-2xl transition-all

                          ${
                            m.role === "user"
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                              : isDark
                                ? "bg-[#111827]/80 backdrop-blur border border-white/10 text-gray-200 shadow-[0_0_20px_rgba(255,115,0,0.08)]"
                                : "bg-white border border-orange-100 text-gray-800 shadow"
                          }
                        `}
                      >
                        <p className="text-sm leading-relaxed">{m.text}</p>
                        {m.followUp && (
  <p className="text-xs text-orange-500 mt-2">
    {m.followUp}
  </p>
)}
                        {m.comparison && (
  <div className="bg-indigo-50 p-2 rounded text-xs mt-2">
    <p className="font-bold">⚖️ Comparison</p>
    {m.comparison.headToHead.map((h, i) => (
      <p key={i}>
        {h.aspect}: {h.winner} beats {h.loser}
      </p>
    ))}
  </div>
)}
{m.advice && (
  <p className="text-xs text-green-600 mt-1">
    {m.advice}
  </p>
)}

              {m.products && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {m.products.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onToggleCompare={toggleCompare}
                      isComparing={compareList.some(c => c.id === p.id)}
                      onFeedback={(isUp) => {
                        const currentChat = chatSessions.find(c => c.id === currentChatId);
                        const newMemory = addFeedback(currentChat?.memory || {}, p.id, isUp);
                        setChatSessions(prev => prev.map(chat =>
                          chat.id === currentChatId ? { ...chat, memory: newMemory } : chat
                        ));
                      }}
                    />
                  ))}
                </div>
              )}
              {m.state && (
                <div className="text-xs text-gray-500 mt-1">
                  State: {m.state?.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        ))}

                  {/* LOADING */}
                  {sending && (
                    <div className="flex justify-start">
                      <div
                        className={`p-3 rounded-xl ${
                          isDark
                            ? "bg-[#111827] border border-white/10"
                            : "bg-white shadow"
                        }`}
                      >
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* INPUT */}
          <div
            className={`
              sticky bottom-0 p-4 backdrop-blur-md border-t

              ${
                isDark
                  ? "bg-[#0f172a]/80 border-white/10"
                  : "bg-white/80 border-orange-100"
              }
            `}
          >
            <div className="max-w-3xl mx-auto flex gap-3 items-center">

              <input
                className={`
                  flex-1 px-4 py-3 rounded-xl outline-none transition-all

                  ${
                    isDark
                      ? "bg-[#111827] border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500"
                      : "bg-white border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-300"
                  }
                `}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Ask about products, compare, or get recommendations..."
                disabled={false}
              />

              <button
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 transition-all"
                onClick={handleSend}
disabled={sending || productsLoading || (typeof input !== "string" || !input.trim())}
              >
                {sending ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div
          className={`
            h-full overflow-y-auto border-l

            ${
              isDark
                ? "bg-[#0f172a] border-white/10"
                : "bg-white border-gray-200"
            }
          `}
        >
        <ChatRightSidebar products={products} />
        </div>
      </div>
    </div>
  );
}