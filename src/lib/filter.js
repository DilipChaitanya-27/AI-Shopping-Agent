import { scoreProducts } from "./scoring";
import { INTENT_EMBEDDINGS, cosineSimilarity, vectorize } from "./intentParser";
import { getMissingFields } from "./memory.js";

export function filterProducts(products, intent = {}) {
  if (!Array.isArray(products)) return [];

  let items = [...products];
  let filterLevel = 0; // For multi-level fallback tracking

  const category = intent?.category;
  const useCase = intent?.useCase;
  const maxBudget = intent?.maxBudget;
  const topIntents = intent?.topIntents || [];
  const embeddingScore = intent?.categoryEmbeddingScore || 0;

  // 🔥 BETTER FILTER: Cosine similarity on product text vs intent embeddings (NO includes())
  function productSimilarity(product, intentName, emb) {
    const pText = `${product.category} ${product.name} ${(product.features || []).join(' ')} ${product.description || ''}`.toLowerCase();
    const pVec = vectorize(pText);
    const score = cosineSimilarity(pVec, emb.vec);
    // Keyword boost
    const keywordBoost = emb.keywords ? emb.keywords.some(k => pText.includes(k)) ? 0.2 : 0 : 0;
    return score + keywordBoost;
  }

  // 1. Category similarity filter (threshold relaxable)
  let simThreshold = embeddingScore > 0.5 ? 0.3 : 0.25;
  if (category && INTENT_EMBEDDINGS.categories[category]) {
    const emb = INTENT_EMBEDDINGS.categories[category];
    items = items.filter(p => productSimilarity(p, category, emb) > simThreshold);
    filterLevel++;
  }

  // 2. UseCase similarity (relax if audio)
  if (useCase && INTENT_EMBEDDINGS.usecases[useCase]) {
    const emb = INTENT_EMBEDDINGS.usecases[useCase];
    simThreshold = embeddingScore > 0.5 ? 0.25 : 0.2;
    items = items.filter(p => productSimilarity(p, useCase, emb) > simThreshold);
    filterLevel++;
  }

  // 💰 3. BUDGET FILTER (with proximity score prep)
  if (maxBudget) {
    const withinBudget = items.filter(p => p.price <= maxBudget);
    if (withinBudget.length > 0) {
      items = withinBudget;
    } else {
      // Relax: top 20% over budget as fallback
      const overBudget = items.filter(p => p.price > maxBudget).sort((a,b) => a.price - b.price).slice(0, Math.ceil(items.length * 0.2));
      items = overBudget.length ? overBudget : items.filter(p => p.price <= maxBudget * 1.3);
    }
  }

  if (minBudget) {
    items = items.filter(p => p.price >= minBudget * 0.7);
  }

  // 🧠 3. DO NOT OVER-FILTER — KEEP VARIETY
  

  // 🧠 4. SCORING (MOST IMPORTANT)
  const ranked = scoreProducts(items, intent);

  // Return top 5 for final ranking
  return ranked.slice(0, 5);
}
