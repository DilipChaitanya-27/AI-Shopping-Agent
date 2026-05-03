import { useShop } from '../context/ShopContext';
import ProductCard from './ProductCard';
import { useState, useEffect, useCallback } from 'react';
import MessageSkeleton from './MessageSkeleton';
import { useTheme } from "../context/ThemeContext";

export default function ChatRightSidebar({ products, productsLoading }) {
  const { addToCart, toggleWishlist } = useShop();
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const isDark = theme === "dark";

  const nextIndex = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  useEffect(() => {
    if (productsLoading || products.length === 0) return;
    const interval = setInterval(nextIndex, 4000);
    return () => clearInterval(interval);
  }, [nextIndex, productsLoading, products.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [products]);

  // COMMON CONTAINER (SCROLL HIDDEN)
  const containerStyle = `
    w-80 p-6 h-screen border-l overflow-y-auto
    no-scrollbar transition-all
    ${isDark
      ? "bg-[#0f172a] border-white/10"
      : "bg-white border-orange-100"
    }
  `;

  // LOADING
  if (productsLoading) {
    return (
      <div className={containerStyle}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-transparent bg-clip-text 
            bg-gradient-to-r from-orange-500 to-orange-600">
            Live Recommendations
          </h3>

          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full animate-pulse
            bg-orange-100 text-orange-700">
            Loading
          </span>
        </div>

        <MessageSkeleton />
      </div>
    );
  }

  // EMPTY
  if (!products || products.length === 0) {
    return (
      <div className={containerStyle + " flex items-center justify-center"}>
        <div className="text-center">
          <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center
            ${isDark ? "bg-[#1e293b]" : "bg-gray-100"}`}>
            📦
          </div>
          <p className={isDark ? "text-gray-400" : "text-gray-500"}>
            No products available
          </p>
        </div>
      </div>
    );
  }

  const currentProduct = products[currentIndex];

  return (
    <div className={containerStyle}>
      
      {/* HEADER - More padding, better spacing */}
      <div className="flex items-center justify-between py-6 mb-6 border-b ${isDark ? 'border-white/10' : 'border-orange-100'}">
        <h3 className="font-bold text-xl text-transparent bg-clip-text 
          bg-gradient-to-r from-orange-500 to-orange-600 tracking-tight">
          Live Recommendations
        </h3>

        <span className={`inline-flex px-3 py-1.5 text-sm font-semibold rounded-full shadow-md ${isDark ? 'bg-[#1e293b] text-orange-400 border border-white/20' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
          {currentIndex + 1} / {products.length}
        </span>
      </div>

      {/* PRODUCT WITH PREMIUM HOVER */}
      <div
        className={`
          relative transition-all duration-500 ease-out cursor-pointer

          hover:scale-[1.03]
          hover:-translate-y-1

          ${isDark
            ? "hover:shadow-[0_10px_40px_rgba(255,115,0,0.15)]"
            : "hover:shadow-xl"
          }
        `}
      >
        <ProductCard
          key={currentProduct.id}
          product={currentProduct}
          onToggleWishlist={toggleWishlist}
          onAddToCart={addToCart}
          onToggleCompare={() => {}}
          isComparing={false}
        />

        {/* GLOW LAYER (ONLY DARK) */}
        {isDark && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_center,rgba(255,115,0,0.15),transparent_60%)]" />
        )}
      </div>

      {/* PROGRESS */}
      <div className="flex gap-1 mt-4">
        {products.map((_, i) => (
          <div
            key={i}
            className={`
              h-2 flex-1 rounded-full transition-all duration-300

              ${i === currentIndex
                ? "bg-orange-500 shadow-[0_0_8px_rgba(255,115,0,0.5)]"
                : isDark
                  ? "bg-[#1e293b]"
                  : "bg-gray-200"
              }
            `}
          />
        ))}
      </div>
    </div>
  );
}