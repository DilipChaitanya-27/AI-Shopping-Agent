import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logoutUser, loginAsGuest } = useAuth();
  const { cart, wishlist } = useShop();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'G';
  const isDark = theme === "dark";

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-50 backdrop-blur-md

        ${scrolled
          ? isDark
            ? "bg-[rgba(10,14,20,0.85)] shadow-[0_4px_25px_rgba(255,115,0,0.12)]"
            : "bg-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
          : isDark
            ? "bg-[rgba(10,14,20,0.6)]"
            : "bg-white/70"
        }

        border-b ${isDark ? "border-white/10" : "border-black/5"}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold
            bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
          >
            <span>🛒</span>
            <span>ShopSense</span>
          </Link>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex items-center space-x-5">

            {/* WISHLIST */}
            <Link
              to="/wishlist"
              className={`
                relative p-2 transition-all duration-200 hover:scale-110
                ${isDark
                  ? "text-gray-300 hover:text-orange-400 hover:drop-shadow-[0_0_6px_rgba(255,115,0,0.6)]"
                  : "text-gray-600 hover:text-orange-500"
                }
              `}
            >
              ❤️
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* CART */}
            <Link
              to="/cart"
              className={`
                relative p-2 transition-all duration-200 hover:scale-110
                ${isDark
                  ? "text-gray-300 hover:text-orange-400 hover:drop-shadow-[0_0_6px_rgba(255,115,0,0.6)]"
                  : "text-gray-600 hover:text-orange-500"
                }
              `}
            >
              🛒
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-all
                ${isDark
                  ? "bg-[#1f2937] text-orange-400 hover:shadow-[0_0_10px_rgba(255,115,0,0.4)]"
                  : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                }
              `}
            >
              {isDark ? "🌙 Dark" : "🌞 Light"}
            </button>

            {/* USER */}
            <div className="relative">
              <button
                onClick={() => setIsUserOpen(!isUserOpen)}
                className={`
                  flex items-center space-x-2 p-2 rounded-lg transition-all
                  ${isDark
                    ? "hover:bg-[#1f2937]"
                    : "hover:bg-gray-100"
                  }
                `}
              >
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-semibold
                    ${isDark
                      ? "bg-gradient-to-br from-orange-500 to-orange-700 text-white"
                      : "bg-orange-100 text-orange-600"
                    }
                  `}
                >
                  {userInitial}
                </div>

                {user?.isGuest && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700">
                    Guest
                  </span>
                )}
              </button>

              {/* DROPDOWN */}
              {isUserOpen && (
                <div
                  className={`
                    absolute right-0 mt-2 w-48 rounded-lg shadow-xl py-1 z-50 border
                    ${isDark
                      ? "bg-[#111827] border-white/10 text-gray-200"
                      : "bg-white border-gray-200 text-gray-700"
                    }
                  `}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm">
                        {user.name || "User"}
                      </div>
                      <button
                        onClick={logoutUser}
                        className={`
                          w-full text-left px-4 py-2 text-sm transition-colors
                          ${isDark
                            ? "hover:bg-[#1f2937]"
                            : "hover:bg-gray-100"
                          }
                        `}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={loginAsGuest}
                      className={`
                        w-full text-left px-4 py-2 text-sm transition-colors
                        ${isDark
                          ? "hover:bg-[#1f2937]"
                          : "hover:bg-gray-100"
                        }
                      `}
                    >
                      Continue as Guest
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* MOBILE */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`
                p-2 rounded-md transition
                ${isDark
                  ? "text-gray-300 hover:text-orange-400"
                  : "text-gray-700 hover:text-orange-500"
                }
              `}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div
          className={`
            md:hidden backdrop-blur-md border-t
            ${isDark
              ? "bg-[#0f172a] border-white/10"
              : "bg-white border-gray-200"
            }
          `}
        >
          <div className="px-4 pt-2 pb-3 space-y-2">

            <Link to="/wishlist" className="block px-3 py-2">
              Wishlist ({wishlist.length}) ❤️
            </Link>

            <Link to="/cart" className="block px-3 py-2">
              Cart ({cart.length}) 🛒
            </Link>

            <button
              onClick={() => {
                toggleTheme();
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2"
            >
              Toggle Theme {isDark ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;