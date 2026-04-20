// src/components/ProductCard.jsx
export default function ProductCard({ product }) {
  return (
    <div className="border bg-white rounded-xl p-3 shadow-sm">
      <h3 className="font-medium">{product.name}</h3>
      <p className="text-sm text-stone-500">₹{product.price}</p>
      <p className="text-xs text-stone-400">⭐ {product.rating}</p>
    </div>
  );
}