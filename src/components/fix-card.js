// Utility to fix/enrich product card data with safe defaults
export function fixProductCard(product) {
  if (!product) return null;
  return {
    id: product.id || Math.random().toString(36).slice(2),
    name: product.name || "Unnamed Product",
    price: typeof product.price === "number" ? product.price : 0,
    rating: typeof product.rating === "number" ? product.rating : 0,
    image: product.image || null,
    features: Array.isArray(product.features) ? product.features : [],
    category: product.category || "general",
    skin: product.skin || "all",
    ...product,
  };
}

