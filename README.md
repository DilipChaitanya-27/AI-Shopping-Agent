# 🛍️ ShopSense — AI Shopping Advisor

## 🚀 Overview

ShopSense is an AI-powered shopping assistant that goes beyond traditional search.
Instead of showing random products, it **understands user intent**, applies **constraints**, and provides **reasoned recommendations**.

> Not a search engine. Not a chatbot.
> A system that helps users make better decisions.

---

## ✨ Features

### 🧠 Intelligent Query Understanding

- Parses user intent from natural language
- Supports budget constraints (`under ₹500`, `above ₹1000`)
- Category detection and memory across the conversation
- Converts text → structured constraints

---

### 🎯 Smart Product Filtering & Scoring

- Filters products based on budget, category, and intent
- **Scoring engine** assigns match scores (Overall, Value, Intent Match)
- **Visual score bars** with animated progress indicators
- Fallback logic: if no exact match → shows closest alternatives

---

### 💬 Conversational Chat UI

- Clean chat interface with user & AI message bubbles
- **Product cards** with AI reasoning explanations (expandable)
- **Quick demo prompts** for instant testing
- **Follow-up question chips** to guide the conversation
- Auto-scroll to latest message

---

### 🛒 Wishlist & Cart

- Save products to a **wishlist** (persisted in localStorage)
- Add products to **cart** with total calculation
- Dedicated **Wishlist** and **Cart** pages
- Navbar displays live wishlist & cart counts

---

### ⚖️ Product Comparison

- Side-by-side comparison of up to 3 products
- **Head-to-head aspect breakdown** (winner vs loser)
- **Winner badge** with score visualization
- Animated comparison panel

---

### 🧠 ShopSense Advisor Panel

- Displays detected **shopping stage** (Browsing → Narrowing → Comparing → Deciding → Ready)
- Shows **intent summary** and **tradeoffs** to consider
- Suggests the **next best step** for the user

---

### 🛣️ Purchase Path Indicator

- Visual **purchase journey tracker**
- Stage progress bar with confidence percentage
- Helps users understand where they are in the decision process

---

### 🔐 Authentication

- **Google Sign-In** via Firebase Auth
- **Guest mode** for instant access without login
- Persistent user state across sessions (localStorage + Firebase sync)
- Protected routes for chat, wishlist, and cart

---

## 🧪 Example Queries

| User Input | System Behavior |
|------------|-----------------|
| `skincare under 200` | Shows budget products with value scores |
| `skincare above 1000` | Shows premium products with reasoning |
| `gift for mom skincare` | Detects intent + category + suggests options |
| `compare these` | Enables side-by-side comparison |

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Routing | React Router DOM |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| AI / LLM | Groq API (Llama / Mixtral) |
| Auth | Firebase Authentication |
| Data | Shopify API + Local fallback dataset |
| State | React Hooks + Context API |

---

## 🧠 Core Logic Flow

```text
User Input
   ↓
Intent Parsing (budget, category, intent)
   ↓
Smart Filtering Engine
   ↓
AI Response Generation (Groq)
   ↓
Product Scoring & Ranking
   ↓
Response + Product Suggestions + Follow-up
```

---

## 🏗️ Project Structure

```
shopsense/
├── src/
│   ├── components/          # UI components
│   │   ├── AdvisorPanel.jsx
│   │   ├── DemoChips.jsx
│   │   ├── FollowUpChips.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductComparison.jsx
│   │   ├── PurchasePath.jsx
│   │   └── ScoreBar.jsx
│   ├── context/             # Global state
│   │   ├── AuthContext.jsx
│   │   └── ShopContext.jsx
│   ├── data/                # Fallback product dataset
│   ├── lib/                 # Core logic
│   │   ├── ai.js            # Groq AI integration
│   │   ├── auth.js
│   │   ├── filter.js        # Product filtering
│   │   ├── intentParser.js  # NLP intent extraction
│   │   ├── scoring.js       # Product scoring algorithm
│   │   └── shopify.js       # Shopify store API
│   ├── pages/               # Route pages
│   │   ├── Cart.jsx
│   │   ├── Chat.jsx
│   │   ├── Landing.jsx
│   │   └── Wishlist.jsx
│   ├── App.jsx
│   ├── firebase.js
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🚧 In Progress / Roadmap

### 🔴 Intelligence Upgrades
- Constraint merging ("actually..." updates)
- Deeper persona-based recommendations

### 🟠 Decision Engine
- Real-time price change awareness
- Stock availability handling
- "Slightly above budget" smarter logic

### 🟡 UI Enhancements
- Typing stages indicator (Parsing → Filtering → Generating)
- Toast notifications
- Constraint sidebar

### 🔵 User Features
- Saved chat sessions
- User-specific recommendation history

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
✅ Tracks purchase journey stage  

---

## 🏁 Future Vision

ShopSense aims to become:

> A **decision-making engine** for shopping, not just a recommendation system.

---

## 🧑‍💻 Setup Instructions

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GROQ_API_KEY=your_groq_key
VITE_SHOPIFY_STOREFRONT_TOKEN=your_shopify_token
VITE_SHOPIFY_STORE_DOMAIN=your_store.myshopify.com
```

---

## 📌 Status

✅ **Phase 1** — Core System + UI + Constraints + Auth  
✅ **Phase 2** — AI Reasoning + Decision Intelligence + Scoring  
🚧 **Phase 3** — Advanced Personalization + Session Memory

---

## 💡 Final Thought

> The goal is not to help users *search faster* —
> but to help them *decide smarter*.

