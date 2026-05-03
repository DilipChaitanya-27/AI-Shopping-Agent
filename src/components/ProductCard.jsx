import { useState } from "react";
import { useShop } from "../context/ShopContext";
import { useTheme } from "../context/ThemeContext";
import ScoreBar from "./ScoreBar";
import { VALUE_TIER_LABELS } from "../lib/scoring";

export default function ProductCard({ product, onFeedback, onToggleCompare, isComparing }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const isWishlisted = wishlist.some(p => p.id === product.id);
  const [expanded, setExpanded] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const tier = product._meta?.valueTier || "balanced";
  const tierStyle = VALUE_TIER_LABELS[tier] || VALUE_TIER_LABELS.balanced;

  const isBest = product.rank === 0;

  return (
    <div
      className={`
        relative border rounded-2xl p-4 transition-all duration-300
        hover:scale-[1.02] hover:-translate-y-[2px]

        ${isDark
          ? "bg-[#1e293b] border-white/10"
          : "bg-white border-gray-200"
        }

        ${isBest
          ? "ring-2 ring-orange-500 shadow-[0_0_20px_rgba(255,115,0,0.25)]"
          : "hover:shadow-lg"
        }
      `}
    >

      {/* 🔥 BEST BADGE */}
      {isBest && (
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow">
          🏆 BEST
        </div>
      )}

      {/* TOP */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">

          {product._meta?.rankIcon && (
            <span className={`text-[10px] px-2 py-1 rounded-full font-bold text-white ${product._meta.rankColor}`}>
              {product._meta.rankIcon} {product._meta.rankLabel}
            </span>
          )}

          <span
            className={`text-[10px] px-2 py-1 rounded-full font-semibold border
              ${tierStyle.bg} ${tierStyle.color} ${tierStyle.border}`}
          >
            {tierStyle.label}
          </span>
        </div>
      </div>

      {/* IMAGE */}
      <div className="overflow-hidden rounded-lg mb-3">
        <img
          src={product.image || "/no-image.png"}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src = "/no-image.png";
          }}
        />
      </div>

      {/* TITLE */}
      <h3 className={`font-bold text-sm leading-tight ${isDark ? "text-gray-100" : "text-gray-900"}`}>
        {product.name}
      </h3>

      {/* PRICE + RATING */}
      <div className="flex items-center justify-between mt-1 mb-2">
        <p className={`text-base font-bold ${isDark ? "text-white" : "text-black"}`}>
          ₹{product.price.toLocaleString()}
        </p>

        <div className="flex items-center gap-1">
          <span className="text-orange-500 text-xs">⭐</span>
          <span className={`text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {product.rating}
          </span>
        </div>
      </div>

      {/* SCORES */}
      {product._scores && (
        <div className="space-y-1 mb-3">
          <ScoreBar label="Overall" score={product._scores.overall} color="bg-orange-500" icon="🎯" />
          <ScoreBar label="Value" score={product._scores.value} color="bg-orange-400" icon="💰" />
          <ScoreBar label="Match" score={product._scores.intentMatch} color="bg-orange-300" icon="🎯" />
        </div>
      )}

      {/* WHY THIS FITS */}
      {product.reason && (
        <div className="mb-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className={`text-xs font-medium flex items-center gap-1 ${
              isDark ? "text-orange-400" : "text-orange-600"
            }`}
          >
            💡 Why this fits {expanded ? "▲" : "▼"}
          </button>

          {expanded && (
            <div className={`mt-2 text-xs p-2.5 rounded-lg border leading-relaxed ${
              isDark
                ? "bg-[#111827] border-white/10 text-gray-300"
                : "bg-orange-50 border-orange-100 text-gray-600"
            }`}>
              {product.reason}
            </div>
          )}
        </div>
      )}

      {/* FEATURES */}
      {product.features?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {product.features.slice(0, 3).map((f, i) => (
            <span
              key={i}
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                isDark
                  ? "bg-[#111827] text-gray-400"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {f}
            </span>
          ))}
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex gap-2">

        {/* WISHLIST */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`flex-1 text-xs py-2.5 rounded-xl transition font-medium ${
            isWishlisted
              ? "bg-red-500 text-white shadow"
              : isDark
                ? "bg-[#111827] text-gray-300 hover:bg-[#1e293b]"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {isWishlisted ? "❤️ Saved" : "🤍 Wishlist"}
        </button>

        {/* ADD TO CART */}
        <button
          onClick={() => addToCart(product)}
          className={`flex-[1.5] text-xs py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
            isDark
              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-[0_0_10px_rgba(255,115,0,0.5)]"
              : "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg"
          }`}
        >
          🛒 Add to Cart
        </button>

      </div>
    </div>
  );
}