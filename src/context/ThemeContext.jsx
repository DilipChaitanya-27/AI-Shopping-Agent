import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // ✅ Prevent flicker: initialize immediately
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved;

      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
    return "light";
  });

  // ✅ Apply theme to HTML properly
  useEffect(() => {
    const root = document.documentElement;

    // Remove previous theme class
    root.classList.remove("light", "dark");

    // Add current theme
    root.classList.add(theme);

    // Persist
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ✅ Smooth transitions (optional but premium)
  useEffect(() => {
    const root = document.documentElement;

    root.style.transition = "background-color 0.3s ease, color 0.3s ease";

    return () => {
      root.style.transition = "";
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};