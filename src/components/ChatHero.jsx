import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from "framer-motion";

export default function ChatHero({ onStartChat }) {
  const { user } = useAuth();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`
        text-center px-8 pb-20 pt-[96px]   /* ✅ FIX NAVBAR OVERLAP */
        transition-colors duration-300
        relative
      `}
    >

      {/* 🔥 BACKGROUND GLOW (SUBTLE) */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_20%,rgba(255,115,0,0.15),transparent_60%)]" />
      )}

      {/* AI Mascot */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ scale: 1.08, rotate: 2 }}
        className={`
          mx-auto w-32 h-32 mb-8 rounded-3xl flex items-center justify-center
          transition-all duration-300 cursor-pointer

          ${isDark
            ? "bg-gradient-to-br from-orange-500 to-orange-700 shadow-[0_0_50px_rgba(255,115,0,0.35)]"
            : "bg-gradient-to-br from-orange-400 to-orange-500 shadow-xl"
          }
        `}
      >
        <motion.div
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-4xl"
        >
          🤖
        </motion.div>
      </motion.div>

      {/* Greeting */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`
          text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent

          ${isDark
            ? "bg-gradient-to-r from-white to-orange-300"
            : "bg-gradient-to-r from-gray-900 to-orange-600"
          }
        `}
      >
        Hi {user?.displayName || 'there'}!
      </motion.h1>

      {/* AI Identity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto mb-8"
      >
        <h2 className={`text-2xl font-bold mb-4 ${
          isDark ? "text-gray-200" : "text-gray-800"
        }`}>
          I'm ShopSense ✨
        </h2>

        <p className={`text-xl leading-relaxed mb-8 ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}>
          Your AI shopping companion that discovers, compares, and finds perfect products for you.
          Just tell me what you're looking for!
        </p>
      </motion.div>

      {/* Intro Bubble */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-md mx-auto mb-12"
      >
        <motion.div
          onClick={onStartChat}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.96 }}
          className={`
            relative rounded-3xl p-8 cursor-pointer group border
            transition-all duration-300

            ${isDark
              ? "bg-[#111827]/80 border-white/10 text-gray-200 hover:shadow-[0_0_40px_rgba(255,115,0,0.25)]"
              : "bg-white border-orange-100 text-gray-800 hover:shadow-xl"
            }
          `}
        >

          {/* 🔥 HOVER GLOW */}
          {isDark && (
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,115,0,0.15),transparent_60%)]" />
          )}

          {/* Top bubble icon */}
          <div className={`
            absolute -top-3 left-8 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold

            ${isDark
              ? "bg-[#111827] border border-white/10 text-orange-400"
              : "bg-white border border-orange-200 text-orange-600"
            }
          `}>
            💬
          </div>

          {/* Text */}
          <p className={`
            text-lg font-semibold leading-relaxed transition-colors

            ${isDark
              ? "text-gray-200 group-hover:text-orange-300"
              : "text-gray-800 group-hover:text-orange-600"
            }
          `}>
            "What are you looking for today?"
          </p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute bottom-2 right-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-orange-500 text-white"
          >
            →
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
