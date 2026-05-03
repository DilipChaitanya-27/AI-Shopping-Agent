import { getNextQuestion } from "./intentParser";
import { CONVERSATION_STATES } from './memory.js';
import { scoreProducts } from "./scoring";
import { filterProducts } from "./filter";
import { updateMemory, getCurrentState } from './memory.js';

export async function getAIResponse({
  userText,
  intent,
  previousIntent,
  products
}) {
  const lower = (userText || "").toLowerCase();

  // 🔥 USE CENTRALIZED MEMORY MERGE
  let mergedIntent = updateMemory(previousIntent, intent);

  // Remove manual missingFields - handled by memory/updateMemory

  if (mergedIntent.category === "audio") {
    if (!mergedIntent.audioType) mergedIntent.missingFields.push("audioType");
    if (!mergedIntent.useCase) mergedIntent.missingFields.push("useCase");
  }

  if (mergedIntent.category === "skincare" && !mergedIntent.concern) {
    mergedIntent.missingFields.push("concern");
  }

  if (mergedIntent.category === "snowboards" && !mergedIntent.skillLevel) {
    mergedIntent.missingFields.push("skillLevel");
  }

  if (mergedIntent.category === "gift" && !mergedIntent.maxBudget) {
    mergedIntent.missingFields.push("budget");
  }

  // 🔥 HANDLE GREETING
  if (intent.intentType === "greeting") {
    return {
      message: "Hey! I can help you find the best products. What are you looking for?",
      products: [],
      intent: mergedIntent
    };
  }

  // 🔥 OUT OF SCOPE
  if (intent.intentType === "out_of_scope") {
    return {
      message: "I can help with headphones, skincare, snowboards, or gifts. What are you looking for?",
      products: [],
      intent: mergedIntent
    };
  }

  // 🔥 CLOSE CHAT
  if (["thanks", "thank you", "ok", "okay", "cool"].includes(lower.trim())) {
    return {
      message: "Glad I could help! 😊",
      products: [],
      intent: mergedIntent
    };
  }

  // 🔥 ASK NEXT QUESTION (NOW FIXED)
  if (mergedIntent.missingFields.length > 0) {
    return {
      message: getNextQuestion(mergedIntent),
      products: [],
      intent: mergedIntent,
      ask: true
    };
  }

  // 🔥 ENHANCED FILTER + RANKING PIPELINE w/ memory
  const currentMemory = mergedIntent; // memory.intent
  let filtered = filterProducts(products, mergedIntent);
  let ranked = scoreProducts(filtered, mergedIntent, currentMemory);

  // 🔥 MULTI-LEVEL FALLBACK (5 levels)
  let fallbackLevel = 0;
  let fallbackIntent = { ...mergedIntent };

  while (ranked.length === 0 && fallbackLevel < 5) {
    fallbackLevel++;
    switch (fallbackLevel) {
      case 1: // Relax budget 20%
        fallbackIntent.maxBudget = mergedIntent.maxBudget * 1.2;
        break;
      case 2: // Drop usecase/subtype
        delete fallbackIntent.useCase;
        delete fallbackIntent.audioType;
        delete fallbackIntent.concern;
        delete fallbackIntent.skillLevel;
        break;
      case 3: // Category + topIntents boost
        fallbackIntent = { category: mergedIntent.category, topIntents: mergedIntent.topIntents };
        break;
      case 4: // Top rated by category
        fallbackIntent = { category: mergedIntent.category };
        break;
      case 5: // Global top rated
        fallbackIntent = {};
        break;
    }
    filtered = filterProducts(products, fallbackIntent);
    ranked = scoreProducts(filtered, fallbackIntent, currentMemory);
  }

  mergedIntent.fallbackLevel = fallbackLevel;

  const topProducts = ranked.slice(0, 3);

  // Update memory w/ state/fallback
  mergedIntent.lastProducts = topProducts.map(p => p.id);
  mergedIntent.fallbackLevel = fallbackLevel;
  mergedIntent.state = getCurrentState(mergedIntent);
  if (fallbackLevel > 0) mergedIntent.state = CONVERSATION_STATES.REFINING;

  // 🔥 AI RESPONSE (SAFE)
  const aiText = await generateAIText({
    products: topProducts,
    intent: mergedIntent,
    userText
  });

  const message =
    aiText ||
    `Here are the best options for you. I recommend ${topProducts[0]?.name}.`;

  return {
    message,
    products: topProducts,
    intent: mergedIntent
  };
}

/* ===========================
   🔥 AI TEXT GENERATION
=========================== */

async function generateAIText({ products, intent, userText }) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `
User query: "${userText}"

Products:
${products
  .map(
    (p, i) => `${i + 1}. ${p.name} - ₹${p.price}
Features: ${p.features?.join(", ") || "N/A"}`
  )
  .join("\n")}

User preferences:
Category: ${intent.category || "N/A"}
Budget: ${intent.maxBudget || "N/A"}
Use case: ${intent.useCase || intent.concern || intent.skillLevel || "N/A"}

Explain briefly why these are good and suggest best one.
`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a smart shopping assistant." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}