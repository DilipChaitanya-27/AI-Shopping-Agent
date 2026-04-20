# 🛍️ ShopSense — AI Shopping Advisor

## 🚀 Overview

ShopSense is an AI-powered shopping assistant that goes beyond traditional search.
Instead of showing random products, it **understands user intent**, applies **constraints**, and provides **reasoned recommendations**.

> Not a search engine. Not a chatbot.
> A system that helps users make better decisions.

---

## ✨ Current Features (Implemented)

### 🧠 Intelligent Query Understanding

* Parses user intent from natural language
* Supports:

  * Budget constraints (`under ₹500`)
  * Premium queries (`above ₹1000`)
* Converts text → structured constraints

---

### 🎯 Smart Product Filtering

* Filters products based on:

  * Maximum budget (under)
  * Minimum budget (above)
* Includes **fallback logic**:

  * If no exact match → shows closest alternatives
* Prevents irrelevant recommendations

---

### 💬 Conversational Chat UI

* Clean chat interface with:

  * User & AI message bubbles
  * Product cards inside chat
* Supports:

  * Quick demo prompts
  * Continuous interaction

---

### 🧩 Robust Edge Case Handling

* No crash on invalid input
* Handles:

  * Empty queries
  * No matching products
  * API failures (safe fallback responses)
* Always returns meaningful output

---

### 🎨 UI / UX (Tailwind CSS)

* Modern minimal design
* Responsive layout
* Components:

  * Navbar
  * Landing page
  * Chat interface
  * Product cards

---

### 🔐 Authentication (Firebase)

* Google Sign-In integration
* User state management
* Ready for personalization features

---

## 🧪 Example Queries

| User Input            | System Behavior                             |
| --------------------- | ------------------------------------------- |
| `skincare under 200`  | Shows only budget products or closest match |
| `skincare above 1000` | Shows premium products                      |
| `random query`        | Shows safe default suggestions              |

---

## ⚙️ Tech Stack

* **Frontend:** React + Vite
* **Styling:** Tailwind CSS
* **AI Integration:** Google Gemini API (planned enhancement layer)
* **Backend/Auth:** Firebase
* **State Management:** React Hooks

---

## 🧠 Core Logic Flow

```text
User Input
   ↓
Intent Parsing
   ↓
Constraint Extraction (budget, type)
   ↓
Smart Filtering Engine
   ↓
Fallback Handling (if needed)
   ↓
Response + Product Suggestions
```

---

## 🚧 What’s Missing / In Progress

### 🔴 Intelligence Upgrades

* Multi-turn memory (context retention)
* Constraint merging ("actually..." updates)
* Category detection (skincare, shoes, etc.)

---

### 🟠 Decision Engine Enhancements

* Product scoring system
* Confidence score (% match)
* “Top Pick” logic
* Tradeoff explanation (why A over B)

---

### 🟡 Advanced AI Layer

* Structured JSON responses from Gemini
* Hallucination control
* Better reasoning prompts
* Follow-up question generation

---

### 🔵 UI Enhancements

* Compare products modal
* Tradeoff explanation box
* Intent tags display
* Typing stages (Parsing → Filtering → Generating)
* Toast notifications
* Constraint sidebar

---

### 🟣 User Features

* Wishlist system
* Saved sessions
* User-specific recommendations

---

### 🟢 Dynamic Adaptation

* Price change awareness
* Stock availability handling
* “Slightly above budget” smarter logic
* Real-time ranking adjustments

---

## 🎯 What Makes This Project Different

Unlike typical e-commerce or chatbot systems:

❌ Shows random products
❌ Ignores constraints
❌ No reasoning

### ShopSense:

✅ Understands user intent
✅ Applies constraints intelligently
✅ Explains recommendations
✅ Adapts when constraints fail

---

## 🏁 Future Vision

ShopSense aims to become:

> A **decision-making engine** for shopping, not just a recommendation system.

---

## 🧑‍💻 Setup Instructions

```bash
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create `.env`:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_GEMINI_API_KEY=your_key
```

---

## 📌 Status

🚧 Currently in **Phase 1 (Core System + UI + Constraints)**
🚀 Moving towards **Phase 2 (AI Reasoning + Decision Intelligence)**

---

## 🤝 Contribution / Demo Note

This project is actively being enhanced for:

* Hackathon demo readiness
* Production-level UX
* Advanced AI reasoning capabilities

---

## 💡 Final Thought

> The goal is not to help users *search faster* —
> but to help them *decide smarter*.
