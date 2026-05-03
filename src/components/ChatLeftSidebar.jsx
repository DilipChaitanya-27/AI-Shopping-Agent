import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useTheme } from "../context/ThemeContext";

export default function ChatLeftSidebar({
  onNewChat,
  onQuickPrompt,
  chatSessions,
  onLoadChat,
  onDeleteChat,
  currentChatId // 🔥 REQUIRED
}) {
  const [menuOpenChatId, setMenuOpenChatId] = useState(null);
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  const quickPrompts = [
    'skincare for oily skin under 500',
    'gift for mom skincare',
    'routine for dry skin'
  ];

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/chat");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div
      className={`
        w-[260px] h-full flex flex-col overflow-hidden

        ${isDark
          ? "bg-[#0f172a] border-r border-white/10"
          : "bg-white border-r border-orange-100"
        }
      `}
    >

      {/* TOP */}
      <div className={`p-4 border-b ${isDark ? "border-white/10" : "border-orange-100"}`}>
        <button
          onClick={onNewChat}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold
            bg-gradient-to-r from-orange-500 to-orange-600 text-white

            transition-all duration-300 cursor-pointer
            hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.97]

            ${isDark
              ? "hover:shadow-[0_0_25px_rgba(255,115,0,0.4)]"
              : "hover:shadow-lg"
            }
          `}
        >
          ➕ New Chat
        </button>
      </div>

      {/* MIDDLE */}
      <div className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">

        {/* QUICK PROMPTS */}
        <div>
          <h3 className={`text-xs font-semibold uppercase tracking-wide mb-2 
            ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Quick prompts
          </h3>

          <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => onQuickPrompt(prompt)}
                className={`
                  w-full text-left p-3 rounded-lg text-sm border

                  transition-all duration-300 cursor-pointer
                  hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.97]

                  ${isDark
                    ? "bg-[#1e293b] text-gray-200 border-orange-500/40 hover:border-orange-400 hover:bg-[#263244]"
                    : "bg-white text-gray-700 border-orange-200 hover:border-orange-400 hover:bg-orange-50"
                  }
                `}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* RECENT */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <h3 className={`text-xs font-semibold uppercase tracking-wide mb-2 
            ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Recent
          </h3>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">
            {chatSessions && chatSessions.length > 0 ? (
              chatSessions.slice(0, 10).map((chat) => {

                const isActive = chat.id === currentChatId;

                return (
                  <div key={chat.id} className="relative group">

                    <button
                      onClick={() => onLoadChat(chat.id)}
                      className={`
                        w-full text-left p-3 rounded-lg text-sm truncate pr-10 border

                        transition-all duration-300 cursor-pointer

                        ${isActive
                          ? isDark
                            ? "border-orange-400 bg-[#1e293b] text-white shadow-[0_0_20px_rgba(255,115,0,0.25)]"
                            : "border-orange-400 bg-orange-50 text-gray-900 shadow"
                          : isDark
                            ? "text-gray-300 border-orange-500/20 hover:border-orange-400 hover:bg-[#1e293b]"
                            : "text-gray-700 border-orange-200 hover:border-orange-400 hover:bg-orange-50"
                        }
                      `}
                    >
                      {chat.title}
                    </button>

                    {/* 3 DOTS */}
                    <button
                      className={`
                        absolute right-2 top-1/2 -translate-y-1/2 opacity-0 
                        group-hover:opacity-100 transition-all p-1 rounded-full

                        ${isDark
                          ? "text-gray-400 hover:text-white hover:bg-[#334155]"
                          : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                        }
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenChatId(chat.id === menuOpenChatId ? null : chat.id);
                      }}
                    >
                      ⋯
                    </button>

                    {/* DELETE */}
                    {menuOpenChatId === chat.id && (
                      <div
                        className={`
                          absolute right-0 top-full mt-1 w-24 rounded-lg py-1 z-50 border shadow-lg

                          ${isDark
                            ? "bg-[#111827] border-white/10 text-gray-200"
                            : "bg-white border-gray-200 text-gray-700"
                          }
                        `}
                      >
                        <button
                          className={`w-full text-left px-3 py-2 text-sm transition-all
                            ${isDark ? "hover:bg-[#1f2937]" : "hover:bg-gray-100"}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChat(chat.id);
                            setMenuOpenChatId(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className={`text-sm p-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                Your conversations will appear here
              </p>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className={`p-4 border-t h-[80px] flex items-stretch 
        ${isDark ? "border-white/10" : "border-orange-100"}`}>

        {user?.isGuest ? (
          <button
            onClick={handleGoogleLogin}
            className={`
              w-full py-4 px-4 rounded-lg text-sm font-medium border

              transition-all duration-300 cursor-pointer
              hover:scale-[1.03] active:scale-[0.97]

              ${isDark
                ? "bg-[#1e293b] text-orange-400 border-orange-500/30 hover:border-orange-400 hover:bg-[#263244]"
                : "bg-orange-100 text-orange-700 border-orange-200 hover:border-orange-400 hover:bg-orange-200"
              }
            `}
          >
            Sign in for personalization
          </button>
        ) : (
          <div className={`flex items-center gap-3 p-4 rounded-xl w-full
            ${isDark ? "bg-[#1e293b]" : "bg-gray-50"}`}>

            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                {(user.displayName || user.email || "U")[0].toUpperCase()}
              </div>
            )}

            <div className="flex flex-col min-w-0 flex-1">
              <span className={`text-sm font-semibold truncate
                ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                {user.displayName?.trim() || user.email?.split("@")[0] || "User"}
              </span>

              <span className="text-xs text-gray-400">
                Logged in
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}