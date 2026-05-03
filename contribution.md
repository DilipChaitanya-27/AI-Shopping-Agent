# 👥 Contribution Note

This project was developed collaboratively by a team of two, with clear ownership across product thinking and engineering, while jointly contributing to system integration and refinement.

---

## 🧠 P Dilip Sri Satya Chaitanya — Product Thinking & AI System Design Lead

Focused on defining the problem, designing the user experience, and structuring the AI-driven decision system.

### Key Contributions:
- Identified the core problem of **decision friction in e-commerce**
- Designed the **chat-first interaction model** to replace traditional search/filter flows  
- Planned the **multi-panel UI architecture** (context → interaction → recommendations)
- Defined the **AI behavior model**:
  - Intent understanding
  - Constraint extraction (budget, category, preferences)
  - Guided recommendations and follow-ups
- Designed the **user decision journey**:
  - Browsing → Narrowing → Comparing → Deciding
- Led key **product decisions & tradeoffs**:
  - Speed vs intelligence
  - Structured data vs flexible AI
  - Scope control (excluded voice, multi-store, deep personalization)

---

## ⚙️ Sravya E — Engineering & Implementation Lead

Focused on building the system and implementing the AI pipeline and frontend architecture.

### Key Contributions:
- Developed the **frontend using React + Vite + Tailwind CSS**
- Built the **AI processing pipeline**:
  - Input normalization & typo handling
  - Intent parsing (embeddings-based)
  - Semantic memory + FSM state management
  - Cosine similarity filtering
  - Dynamic scoring system
- Integrated **Groq API (LLM)** for reasoning-based responses
- Connected **Shopify GraphQL API** for real-time product data
- Implemented core features:
  - Conversational chat UI with product cards & explanations
  - Wishlist & cart (localStorage)
  - Product comparison system
- Built a **5-level fallback system** to ensure reliable outputs
- Managed **state using React Context API**
- Integrated **Firebase Authentication (Google Sign-In + Guest mode)**

---

## 🤝 Joint Contributions

Both team members collaborated on:
- System architecture design (AI + frontend integration)
- Feature refinement and usability improvements  
- Debugging, testing, and performance optimization  
- Ensuring alignment between product decisions and technical implementation  

---

## ⏱️ Effort Distribution

- **P Dilip Sri Satya Chaitanya** — 50% (Product Thinking + AI Design)  
- **Sravya E** — 50% (Engineering + Implementation)  

---

## 💡 Summary

This project reflects a balanced collaboration where:
- Product strategy, UX, and AI behavior design were clearly defined  
- Engineering execution translated these decisions into a working system  
- Both contributors worked together to deliver a cohesive, intelligent, and user-centric AI shopping assistant  