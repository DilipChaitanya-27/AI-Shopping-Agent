import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // ✅ use global theme
import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import bgLight from "../assets/bg-light.png";
import bgDark from "../assets/bg-dark.png";

function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { user, setUser, loginAsGuest, loading } = useAuth();

  // ✅ FIX: global theme (no local state)
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const shineX = useTransform(mouseX, [0, 300], ["-30%", "30%"]);
  const shineY = useTransform(mouseY, [0, 100], ["-30%", "30%"]);

  useEffect(() => {
    const move = (e) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    if (!loading && user) navigate("/chat", { replace: true });
  }, [user, loading, navigate]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const u = {
        uid: result.user.uid,
        name: result.user.displayName,
        isGuest: false,
      };
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
      navigate("/chat", { replace: true });
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    navigate("/chat", { replace: true });
  };

  if (loading) return null;

  const features = [
    { icon: "🏷️", title: "Understands your needs", desc: "Learns your style, budget and preferences" },
    { icon: "🔍", title: "Finds best products", desc: "From trusted stores, all in one place" },
    { icon: "⏰", title: "Saves time & money", desc: "Smart picks that actually make sense" },
    { icon: "🛡️", title: "Secure & private", desc: "Your data is safe and protected" },
  ];

  return (
    <div className="landing-page min-h-screen relative overflow-hidden -mt-20 lg:-mt-24 pt-20 lg:pt-24">
      {/* PARALLAX BACKGROUND */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${dark ? bgDark : bgLight})`,
        }}
        animate={{
          x: cursor.x * 0.01,
          y: cursor.y * 0.01,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* CURSOR GLOW */}
      <motion.div
        className="pointer-events-none fixed w-[300px] h-[300px] rounded-full bg-orange-400/20 blur-3xl z-[1]"
        animate={{ x: cursor.x - 150, y: cursor.y - 150 }}
      />

      <div className="relative z-10">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 md:px-12 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 text-2xl font-bold">
            <div className="relative flex items-center justify-center">
              <motion.div
                className="absolute w-12 h-12 rounded-full"
                style={{
                  border: "2px dashed rgba(255,115,0,0.7)",
                  boxShadow: "0 0 30px rgba(255,115,0,0.6)",
                }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              />
              <motion.div
                className="absolute w-9 h-9 rounded-full border border-orange-400/40"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <span className="w-8 h-8 relative z-10 flex items-center justify-center text-white text-lg font-bold bg-orange-500 rounded-full">
                S
              </span>
            </div>
            <span>
              <span className={dark ? "text-white" : "text-black"}>Shop</span>
              <span className="text-orange-500">Sense</span>
            </span>
          </div>

          {/* THEME TOGGLE */}
          <motion.button
            whileHover={{ scale: 1.1, y: -2, boxShadow: "0 0 20px rgba(255,115,0,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md ${
              dark
                ? "text-white border-white/30 bg-white/10"
                : "text-black bg-white shadow"
            }`}
          >
            {dark ? "🌙" : "☀️"} {dark ? "Dark" : "Light"}
          </motion.button>
        </div>

        {/* HERO */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-10 items-center mt-10">
          <div>
            <motion.div
              whileHover={{ scale: 1.08, y: -3, boxShadow: "0 0 20px rgba(255,115,0,0.4)" }}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm border ${
                dark
                  ? "bg-orange-500/10 text-orange-300 border-orange-400/20"
                  : "bg-orange-100 text-orange-600 border-orange-200"
              }`}
            >
              ✨ AI-Powered Shopping Assistant
            </motion.div>

            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${dark ? "text-white" : "text-black"}`}>
              Your personal <br />
              <span className="text-orange-500">shopping advisor</span>
            </h1>

            <p className={`${dark ? "text-gray-300" : "text-gray-600"} mb-10 text-lg`}>
              Not search. Not chatbot. A system that understands you.
            </p>

            <div className="flex gap-4 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-3 px-7 py-3 bg-orange-500 text-white rounded-xl shadow-lg border border-orange-600 hover:bg-orange-600 transition-all duration-200 font-semibold shadow-orange-200/50 hover:shadow-orange-300/50"
                onClick={handleGoogleLogin}
              >
                <GoogleIcon className="w-5 h-5" />
                <span className="font-semibold">Continue with Google</span>
              </motion.button>

              <motion.button
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  mouseX.set(e.clientX - rect.left);
                  mouseY.set(e.clientY - rect.top);
                }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="relative overflow-hidden flex items-center gap-3 px-7 py-3 rounded-xl bg-white text-black shadow-lg border border-gray-200"
                onClick={handleGuest}
              >
                <motion.div
                  className="absolute w-[200px] h-[200px] rounded-full bg-white/60 blur-2xl pointer-events-none"
                  style={{ left: shineX, top: shineY }}
                />
                <div className="absolute inset-0 backdrop-blur-md bg-white/30 opacity-40" />
                <span className="relative z-10">👤 Continue as Guest</span>
              </motion.button>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <motion.div
              className="absolute w-[300px] h-[300px] rounded-full border border-orange-400/40"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            />
            <div className="w-[120px] h-[120px] rounded-full bg-orange-400/30 blur-2xl" />
          </div>
        </div>

        {/* FEATURES */}
        <div className="max-w-7xl mx-auto mt-20 px-6 md:px-12 grid md:grid-cols-4 gap-6 pb-20">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8, scale: 1.04 }}
              className={`p-6 rounded-2xl border backdrop-blur-xl ${
                dark
                  ? "bg-orange-500/10 text-white border-orange-400/20"
                  : "bg-white/60 shadow"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{f.icon}</span>
                <h3 className="font-semibold">{f.title}</h3>
              </div>
              <p className="text-sm opacity-70">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}