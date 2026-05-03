export const VALUE_TIER_LABELS = {
  budget:    { label: "Budget Pick",    bg: "bg-emerald-100", color: "text-emerald-700", border: "border-emerald-200" },
  balanced:  { label: "Balanced",       bg: "bg-blue-100",    color: "text-blue-700",    border: "border-blue-200" },
  premium:   { label: "Premium",        bg: "bg-amber-100",   color: "text-amber-700",   border: "border-amber-200" },
  luxury:    { label: "Luxury",         bg: "bg-purple-100",  color: "text-purple-700",  border: "border-purple-200" },
};

// Call as scoreProducts(products, intent, memory.intent) from ai.js/chat
export function scoreProducts(products, intent = {}, memory = {}) {
  if (!Array.isArray(products) || products.length === 0) return [];

  const query = (intent.rawText || "").toLowerCase();
  const turnsSince = memory?.turnsSinceUpdate || 0;
  const recencyMultiplier = Math.max(0.8, 1 - (turnsSince * 0.05));
  const stateBoost = memory?.state === 'recommending' ? 1.1 : 1.0;

  const prices = products.map(p => p.price || 0);
  const maxPrice = Math.max(...prices, 1);
  const minPrice = Math.min(...prices, 0);
  const range = maxPrice - minPrice || 1;

  // Dynamic weights
  const confidence = intent.confidence || 0.5;
  const intentWeight = 0.4 + (confidence * 0.3);
  const valueWeight = 0.3 - (confidence * 0.1);
  const qualityWeight = 0.3;

  let scored = products.map((p) => {
    const price = p.price || 0;
    const rating = p.rating || 3;

    // 🔥 PRICE PROXIMITY SCORE (budget-aware)
    let priceScore = 50;
    if (intent.maxBudget) {
      const proximity = Math.abs(price - intent.maxBudget) / intent.maxBudget;
      priceScore = Math.max(0, Math.round(100 - (proximity * 100)));
    } else {
      const priceRatio = (price - minPrice) / range;
      priceScore = Math.round((1 - priceRatio) * 100);
    }
    const valueScore = priceScore;

    // 🔥 QUALITY SCORE
    const qualityScore = Math.round(rating * 20);

    // 🔥 BASE INTENT MATCH
    let intentMatch = 40;

    // 🔥 BUDGET MATCHING
    if (intent.maxBudget) {
      if (price <= intent.maxBudget) intentMatch += 30;
      else if (price <= intent.maxBudget * 1.2) intentMatch += 10;
      else intentMatch -= 20;
    }

    if (intent.minBudget && price >= intent.minBudget) {
      intentMatch += 10;
    }

    const name = (p.name || "").toLowerCase();
    const features = (p.features || []).join(" ").toLowerCase();
    const text = `${name} ${features}`;

// 🔥 CATEGORY + FEATURE OVERLAP (50% exact + 50% semantic)
    if (intent.category) {
      const productCat = (p.category || "").toLowerCase();
      if (productCat === intent.category) {
        intentMatch += 30;
      } else {
        const text = `${name} ${features}`;
        const categoryWords = ['headphone', 'earbud', 'skin', 'snowboard'][intent.category] || intent.category;
        intentMatch += text.includes(categoryWords) ? 15 : -20;
      }
    }

    // 🔥 AUDIO MATCHING
    if (intent.category === "audio") {
      if (intent.audioType === "over-ear" && text.includes("over")) intentMatch += 25;
      if (intent.audioType === "in-ear" && (text.includes("earbud") || text.includes("in-ear"))) intentMatch += 25;

      if (intent.useCase === "gaming" && text.includes("gaming")) intentMatch += 25;
      if (intent.useCase === "music" && (text.includes("bass") || text.includes("sound"))) intentMatch += 25;
      if (intent.useCase === "calls" && (text.includes("mic") || text.includes("call"))) intentMatch += 25;
    }

    // 🔥 SKINCARE MATCHING
    if (intent.category === "skincare") {
      if (intent.concern === "oil" && text.includes("oil")) intentMatch += 20;
      if (intent.concern === "hydration" && text.includes("hydrat")) intentMatch += 20;
      if (intent.concern === "brightening" && (text.includes("vitamin") || text.includes("glow"))) intentMatch += 20;
    }

    // 🔥 SNOWBOARD MATCHING
    if (intent.category === "snowboards") {
      if (intent.skillLevel && text.includes(intent.skillLevel)) intentMatch += 25;
    }

    // 🔥 QUERY MATCH BOOST
    if (query) {
      const words = query.split(" ");
      let matches = 0;
      words.forEach(w => {
        if (w.length > 2 && text.includes(w)) matches++;
      });
      intentMatch += matches * 5;
    }

    intentMatch = Math.max(0, Math.min(100, intentMatch));

    // 🔥 FEEDBACK BOOST (from memory)
    let feedbackBoost = 0;
    if (memory.feedbackScores) {
      const productId = p.id;
      const recentFeedback = memory.feedbackScores.up.filter(f => f.productId === productId).length -
                            memory.feedbackScores.down.filter(f => f.productId === productId).length;
      feedbackBoost = recentFeedback * 5; // +5 per upvote
    }

    // 🔥 DYNAMIC FINAL SCORE w/ weights/recency/state/feedback
    const dynamicIntent = intentMatch * intentWeight;
    const dynamicValue = valueScore * valueWeight;
    const dynamicQuality = qualityScore * qualityWeight;
    const overall = Math.round(
      ((dynamicIntent + feedbackBoost) * recencyMultiplier * stateBoost) +
      dynamicValue +
      dynamicQuality
    );

    return {
      ...p,
      _scores: {
        overall,
        value: valueScore,
        intentMatch: dynamicIntent,
        quality: qualityScore,
        feedback: feedbackBoost,
        recency: recencyMultiplier
      }
    };
  });

  // 🔥 SORT
  scored.sort((a, b) => b._scores.overall - a._scores.overall);

  // 🔥 RANK TAGS
  const ranks = [
    { icon: "🥇", label: "Best Match", color: "bg-yellow-500" },
    { icon: "🥈", label: "Runner Up", color: "bg-gray-400" },
    { icon: "🥉", label: "Third Pick", color: "bg-orange-400" },
  ];

  scored = scored.map((p, idx) => {
    const price = p.price || 0;
    const priceRatio = (price - minPrice) / range;

    let valueTier = "balanced";
    if (priceRatio < 0.25) valueTier = "budget";
    else if (priceRatio < 0.5) valueTier = "balanced";
    else if (priceRatio < 0.75) valueTier = "premium";
    else valueTier = "luxury";

    return {
      ...p,
      _meta: {
        valueTier,
        rankIcon: ranks[idx]?.icon || null,
        rankLabel: ranks[idx]?.label || null,
        rankColor: ranks[idx]?.color || null,
      }
    };
  });

  return scored;
}