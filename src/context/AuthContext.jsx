import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser(null);
      }
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const u = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          isGuest: false,
        };
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      } else {
        const savedUser = localStorage.getItem("user");
        if (!savedUser) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginAsGuest = () => {
    const guest = {
      uid: "guest",
      name: "Guest",
      isGuest: true,
    };
    setUser(guest);
    localStorage.setItem("user", JSON.stringify(guest));
  };

  const logoutUser = async () => {
    try {
      if (auth) await signOut(auth);
    } catch {}
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginAsGuest, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

