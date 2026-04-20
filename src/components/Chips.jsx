export default function Chips({ intent }) {
  return (
    <div>
      {intent.skin && <span>Skin: {intent.skin} </span>}
      {intent.budget && <span>Budget: ₹{intent.budget}</span>}
    </div>
  );
}