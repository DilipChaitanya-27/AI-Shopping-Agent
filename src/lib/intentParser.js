export const MODES = {
  GUIDED: "guided",
  SEARCH: "search",
  COMPARE: "compare",
  SHOW_ALL: "show_all",
  IDLE: "idle",
};

export const INTENT_TYPES = {
  GREETING: "greeting",
  EXPLORATION: "exploration",
  SEARCH: "search",
  COMPARISON: "comparison",
  FOLLOW_UP: "follow_up",
  SHOW_ALL: "show_all",
  GUIDED: "guided",
  RECALL: "recall",
  OUT_OF_SCOPE: "out_of_scope",
};

export function vectorize(text, dim = 5) {
  const words = text.split(" ");
  const vec = new Array(dim).fill(0);
  // Simple term frequency normalized
  words.forEach(word => {
    if (INTENT_EMBEDDINGS.categories.audio.keywords.some(k => word.includes(k))) vec[0] += 1;
    if (INTENT_EMBEDDINGS.categories.skincare.keywords.some(k => word.includes(k))) vec[2] += 1;
    if (word.includes("snow")) vec[4] += 1;
    if (word.includes("gift")) vec[3] += 1;
  });
  // L2 normalize
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v*v, 0)) || 1;
  return vec.map(v => v / norm);
}

export function cosineSimilarity(v1, v2) {
  return v1.reduce((sum, a, i) => sum + a * v2[i], 0);
}

export const INTENT_EMBEDDINGS = {
  categories: {
    audio: { vec: [0.9, 0.8, 0.1, 0.0, 0.0], keywords: ["headphone", "earbud", "audio", "sound", "headset"] },
    skincare: { vec: [0.1, 0.1, 0.9, 0.7, 0.0], keywords: ["skin", "serum", "face", "moisturizer", "sunscreen"] },
    snowboards: { vec: [0.0, 0.0, 0.1, 0.0, 0.9], keywords: ["snowboard", "snow", "board", "ski"] },
    gift: { vec: [0.2, 0.1, 0.2, 0.9, 0.1], keywords: ["gift", "present", "birthday", "anniversary"] }
  },
  usecases: {
    gaming: { vec: [0.8, 0.3, 0.1, 0.2, 0.1], keywords: ["gaming", "game", "latency", "surround"] },
    music: { vec: [0.7, 0.9, 0.2, 0.1, 0.0], keywords: ["music", "bass", "sound", "studio"] },
    calls: { vec: [0.6, 0.4, 0.1, 0.3, 0.1], keywords: ["call", "mic", "talk", "voice"] }
  },
  concerns: {
    oil: { vec: [0.1, 0.1, 0.8, 0.2, 0.0] },
    brightening: { vec: [0.1, 0.2, 0.7, 0.3, 0.0] },
    hydration: { vec: [0.0, 0.1, 0.9, 0.1, 0.0] }
  }
};

const TYPO_CORRECTIONS = {
  "hydrationn": "hydration",
  "moisturiser": "moisturizer",
  "facewash": "face wash",
  "earbuds": "earbud",
  "headphones": "headphone",
  "skincar": "skincare",
  "over eat": "over ear",
  "overear": "over ear",
  "ear phone": "earphone",
  "ear phones": "earphone",
};

export function normalizeInput(text) {
  if (!text) return "";
  let normalized = text.toLowerCase().trim();
  for (const [typo, correct] of Object.entries(TYPO_CORRECTIONS)) {
    normalized = normalized.replace(new RegExp(typo, "gi"), correct);
  }
  return normalized.replace(/\s+/g, " ").replace(/[^a-z0-9\s]/g, "");
}

function isGreeting(text) {
  return /^(hi|hello|hey|hii|heyy|yo|what's up|whats up)$/i.test(text.trim());
}

function isOutOfScope(text) {
  const outOfScopeKeywords = [
    "weather", "news", "sports", "politics",
    "stock", "crypto", "recipe", "movie",
    "travel", "job", "math", "code", "joke"
  ];

  return outOfScopeKeywords.some(k => text.includes(k));
}

import { updateMemory } from './memory.js';

export function parseIntent(text, previousIntent = {}) {
  if (!text || typeof text !== "string") {
    return { intentType: INTENT_TYPES.EXPLORATION, confidence: 0 };
  }

  const lower = normalizeInput(text);

  // GREETING / OUT OF SCOPE (early return)
  if (isGreeting(lower)) {
    return { intentType: INTENT_TYPES.GREETING, confidence: 1 };
  }
  if (isOutOfScope(lower)) {
    return { intentType: INTENT_TYPES.OUT_OF_SCOPE, confidence: 1 };
  }

  const signals = {
    isComparison: /\b(compare|vs)\b/.test(lower),
    isShowAll: /\b(show all|everything)\b/.test(lower),
    isVague: lower.split(" ").length <= 2,
  };

  // Category matching
  const catScores = Object.entries(INTENT_EMBEDDINGS.categories).map(([cat, emb]) => ({
    name: cat,
    score: cosineSimilarity(vectorize(lower), emb.vec)
  })).sort((a,b) => b.score - a.score);

  let category = previousIntent?.category || catScores[0]?.name || null;
  if (catScores[0].score < 0.3) category = null;

  // UseCase matching (audio context boost)
  let useCase = null;
  if (category === 'audio') {
    const ucScores = Object.entries(INTENT_EMBEDDINGS.usecases).map(([uc, emb]) => ({
      name: uc,
      score: cosineSimilarity(vectorize(lower), emb.vec)
    })).sort((a,b) => b.score - a.score);
    useCase = ucScores[0]?.name || null;
  }

  // Embed top intents for scoring/filter
  const topIntents = [...catScores.slice(0,3), ...Object.entries(INTENT_EMBEDDINGS.usecases).map(([uc,emb]) => ({
    name: uc,
    score: cosineSimilarity(vectorize(lower), emb.vec)
  })).sort((a,b) => b.score - a.score).slice(0,3)].filter(i => i.score > 0.2);

  // AUDIO TYPE (semantic)
  let audioType = previousIntent?.audioType || null;
  if (lower.includes("over ear") || lower.includes("over-ear")) audioType = "over-ear";
  else if (lower.includes("in ear") || lower.includes("earbud")) audioType = "in-ear";

  // SKINCARE
  let concern = previousIntent?.concern || null;
  if (/oil/.test(lower)) concern = "oil";
  else if (/glow/.test(lower)) concern = "brightening";

  // SNOWBOARD
  let skillLevel = previousIntent?.skillLevel || null;
  if (/beginner/.test(lower)) skillLevel = "beginner";

  // BUDGET
  let maxBudget = previousIntent?.maxBudget || null;
  const budgetMatch = lower.match(/(\d+)(k)?/);
  if (budgetMatch) {
    let value = Number(budgetMatch[1]);
    if (budgetMatch[2]) value *= 1000;
    maxBudget = value;
  }

  let intentType = INTENT_TYPES.EXPLORATION;
  if (signals.isComparison) intentType = INTENT_TYPES.COMPARISON;
  else if (signals.isShowAll) intentType = INTENT_TYPES.SHOW_ALL;
  else if (category) intentType = INTENT_TYPES.SEARCH;

  // Raw new intent
  const rawIntent = {
    category,
    audioType,
    useCase,
    concern,
    skillLevel,
    maxBudget,
    signals,
    intentType,
    rawText: lower,
  };

  rawIntent.topIntents = topIntents; // For scoring/filter
  rawIntent.categoryEmbeddingScore = catScores[0]?.score || 0;
  rawIntent.missingFields = getMissingFields(rawIntent);
  rawIntent.confidence = Math.max(computeConfidence(rawIntent), catScores[0]?.score || 0.3);

  // 🔥 CENTRALIZED MEMORY UPDATE w/ embeddings
  const finalIntent = updateMemory(previousIntent, rawIntent);

  return finalIntent;
}

import { getMissingFields as getMemoryMissingFields } from './memory.js';

function getMissingFields(intent) {
  const missing = [];

  if (!intent.category) {
    missing.push("category");
    return missing;
  }

  if (intent.category === "audio") {
    if (!intent.audioType) missing.push("audioType");
    if (!intent.useCase) missing.push("useCase");
  }

  if (intent.category === "skincare" && !intent.concern) {
    missing.push("concern");
  }

  if (intent.category === "snowboards" && !intent.skillLevel) {
    missing.push("skillLevel");
  }

  if (intent.category === "gift" && !intent.maxBudget) {
    missing.push("budget");
  }

  return missing;
}

function computeConfidence(intent) {
  let score = 0.3;
  if (intent.categoryEmbeddingScore) score = Math.max(score, intent.categoryEmbeddingScore);
  if (intent.category) score += 0.25;
  if (intent.audioType || intent.useCase) score += 0.15;
  if (intent.maxBudget) score += 0.1;
  if (intent.signals && intent.signals.isVague) score -= 0.15;
  return Math.min(1, Math.max(0, score));
}

export function getNextQuestion(intent) {
  if (!intent?.missingFields?.length) return null;

  const field = intent.missingFields[0];

  switch (field) {
    case "category":
      return "What are you looking for—skincare, headphones, or snowboard?";
    case "audioType":
      return "Do you prefer over-ear headphones or in-ear earbuds?";
    case "useCase":
      return "Do you want them for gaming, music, or calls?";
    case "concern":
      return "What's your goal—glow, oil control, or hydration?";
    case "skillLevel":
      return "Are you a beginner, intermediate, or advanced rider?";
    case "budget":
      return "What's your budget for the gift?";
    default:
      return null;
  }
}

