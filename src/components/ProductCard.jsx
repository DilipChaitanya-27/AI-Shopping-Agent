export default function ProductCard({ product }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 10, margin: 5 }}>
      <h4>{product.name}</h4>
      <p>₹{product.price}</p>
      <p>Rating: {product.rating}</p>
    </div>
  );
}