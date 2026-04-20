// src/components/Navbar.jsx
import { useAuth } from "../context/AuthContext";
import { login } from "../lib/auth";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white border-b">
      <h1 className="text-lg font-semibold text-stone-900">
        ShopSense
      </h1>

      {user ? (
        <div className="text-sm text-stone-600">
          {user.displayName}
        </div>
      ) : (
        <button
  onClick={login}
  className="bg-amber-600 text-white px-4 py-2 rounded-lg"
>
  Login
</button>
      )}
    </div>
  );
}