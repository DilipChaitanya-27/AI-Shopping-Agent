import { useShop } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState, useRef } from "react";

import bgLight from "../assets/bg-light.png";
import bgDark from "../assets/bg-dark.png";

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useShop();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  // Background parallax
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Cursor glow position
  const glowRef = useRef(null);

  useEffect(() => {
    let rafId;

    const handleMouseMove = (e) => {
      // Background parallax
      const x = (e.clientX - window.innerWidth / 2) / 40;
      const y = (e.clientY - window.innerHeight / 2) / 40;
      setOffset({ x, y });

      // Cursor glow (smooth via RAF)
      if (glowRef.current) {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          glowRef.current.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="min-h-screen flex justify-center items-start pt-24 lg:pt-28 relative overflow-hidden"
      style={{
        backgroundImage: `url(${isDark ? bgDark : bgLight})`,
        backgroundSize: "cover",
        backgroundPosition: `${50 + offset.x}% ${50 + offset.y}%`,
        backgroundRepeat: "no-repeat",
        transition: "background-position 0.1s ease-out",
      }}
    >
      {/* 🔥 Golden Cursor Glow */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed top-0 left-0 w-[300px] h-[300px] rounded-full z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(255,165,0,0.25) 0%, rgba(255,140,0,0.15) 40%, transparent 70%)",
          filter: "blur(40px)",
          transition: "transform 0.05s linear",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl p-4 backdrop-blur-md bg-white/80 dark:bg-black/70 rounded-xl shadow-lg">
        
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          ❤️ Your Wishlist
        </h2>

        {wishlist.length === 0 ? (
          <div className="text-gray-700 dark:text-gray-200 text-sm">
            No items in your wishlist.
            
            <button
              onClick={() => navigate("/chat")}
              className="
                relative ml-3 px-4 py-2 rounded-lg text-sm font-medium
                bg-orange-500 text-white overflow-hidden
                transition-all duration-300 hover:scale-105 hover:shadow-lg
              "
            >
              <span className="relative z-10">Browse Products →</span>

              <span className="
                absolute inset-0 bg-white/20 translate-x-[-100%]
                transition-transform duration-500
                hover:translate-x-[100%]
              " />
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-orange-400 dark:scrollbar-thumb-orange-500 scrollbar-track-transparent">
            
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="
                  group relative cursor-pointer
                  flex items-center gap-4 rounded-xl p-3
                  backdrop-blur-md
                  bg-orange-500/10
                  border border-orange-400/40

                  transition-all duration-300 ease-out

                  hover:scale-[1.02]
                  hover:-translate-y-1
                  hover:bg-orange-500/20
                  hover:border-orange-400/70

                  shadow-[0_0_8px_rgba(255,115,0,0.12)]
                  hover:shadow-[0_0_20px_rgba(255,115,0,0.35)]
                "
              >
                {/* Glow layer */}
                <div className="
                  absolute inset-0 rounded-xl
                  bg-orange-500/10 opacity-0
                  blur-xl
                  transition-opacity duration-300
                  group-hover:opacity-100
                " />

                {/* Content */}
                <div className="relative z-10 flex items-center gap-4 w-full">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}

                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      ₹{product.price}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className="text-xs bg-red-500 text-white px-3 py-2 rounded-lg hover:scale-105 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}