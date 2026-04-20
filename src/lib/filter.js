export function filterProducts(products, intent = {}) {
  if (!products || !Array.isArray(products)) {
    return { type: "normal", items: [] };
  }

  const minBudget = intent?.minBudget || null;
  const maxBudget = intent?.maxBudget || null;

  // 🔹 ABOVE (min budget)
  if (minBudget) {
    const exact = products.filter(p => p.price >= minBudget);

    if (exact.length > 0) {
      return {
        type: "above",
        items: exact.sort((a, b) => a.price - b.price).slice(0, 3),
      };
    }

    const fallback = products
      .filter(p => p.price >= minBudget * 0.7)
      .sort((a, b) => b.price - a.price)
      .slice(0, 3);

    return {
      type: "fallbackAbove",
      items: fallback,
    };
  }

  // 🔹 UNDER (max budget)
  if (maxBudget) {
    const exact = products.filter(p => p.price <= maxBudget);

    if (exact.length > 0) {
      return {
        type: "under",
        items: exact.sort((a, b) => a.price - b.price).slice(0, 3),
      };
    }

    const fallback = products
      .filter(p => p.price <= maxBudget * 1.5)
      .sort((a, b) => a.price - b.price)
      .slice(0, 3);

    return {
      type: "fallbackUnder",
      items: fallback,
    };
  }

  // 🔹 DEFAULT
  return {
    type: "normal",
    items: products.slice(0, 3),
  };
}