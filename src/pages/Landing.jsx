// src/pages/Landing.jsx
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="text-center px-6 py-20">
      <h1 className="text-4xl font-semibold mb-4">
        Your personal <span className="text-amber-600">shopping advisor</span>
      </h1>

      <p className="text-stone-500 mb-8">
        Not search. Not chatbot. A system that understands you.
      </p>

      <button
        onClick={() => navigate("/chat")}
        className="bg-stone-900 text-white px-6 py-3 rounded-xl"
      >
        Start Shopping →
      </button>
    </div>
  );
}