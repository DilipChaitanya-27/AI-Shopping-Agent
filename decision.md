# 🧠 Decision Log — ShopSense: AI Shopping Agent

This document captures key product and technical decisions made during development.

Format:
**Considered → Chose → Because → Tradeoff**

---

## 1. Search/Filter UI vs Conversational Interface

**Considered:**
- Traditional search + filters
- Conversational AI interface

**Chose:**
- Conversational, chat-first interface

**Because:**
- Users express intent naturally ("best headphones under ₹2000")
- Reduces multiple steps (search → filter → compare)

**Tradeoff:**
- Requires accurate intent parsing
- Higher complexity in AI design

---

## 2. Static Filtering vs AI + Structured Hybrid System

**Considered:**
- Pure rule-based filtering
- Pure LLM-based recommendations
- Hybrid system (structured data + AI reasoning)

**Chose:**
- Hybrid approach (Shopify GraphQL + AI reasoning)

**Because:**
- Ensures accuracy (real product data)
- Enables reasoning and explanations

**Tradeoff:**
- Less flexible than pure AI
- Requires integration between systems

---

## 3. Single Panel UI vs Multi-Panel Layout

**Considered:**
- Single chat interface
- Multi-panel layout

**Chose:**
- Multi-panel (Left: context, Center: chat, Right: recommendations)

**Because:**
- Reduces context switching
- Keeps alternatives visible
- Improves decision clarity

**Tradeoff:**
- Increased UI complexity
- Requires careful layout balancing

---

## 4. Fast Response vs Deep Intelligence

**Considered:**
- Deep reasoning (slower responses)
- Fast responses with constrained logic

**Chose:**
- Fast responses (<2 seconds)

**Because:**
- Users prefer speed in shopping
- Improves interaction flow

**Tradeoff:**
- Slightly reduced reasoning depth

---

## 5. Strict Filtering vs Flexible Recommendations

**Considered:**
- Strict constraint enforcement
- Flexible suggestions

**Chose:**
- Strict filtering with fallback system

**Because:**
- Maintains user trust (no over-budget results)
- Still avoids dead-ends using fallbacks

**Tradeoff:**
- More system complexity (fallback pipeline)

---

## 6. No Results vs Fallback System

**Considered:**
- Show "No results found"
- Implement fallback strategy

**Chose:**
- 5-level fallback system:
  Strict → Relax → Category → Alternatives → Show-all

**Because:**
- Prevents user frustration
- Ensures continuous interaction

**Tradeoff:**
- Slight deviation from exact constraints

---

## 7. Stateless Chat vs Memory-Based System

**Considered:**
- Stateless interactions
- Context-aware memory system

**Chose:**
- Semantic memory + FSM-based state management

**Because:**
- Maintains context across queries
- Enables follow-up interactions

**Tradeoff:**
- Increased implementation complexity

---

## 8. Simple List vs Scored Recommendations

**Considered:**
- Display product list
- Show scored recommendations

**Chose:**
- Scoring system (Intent match, Value, Overall)

**Because:**
- Improves transparency
- Helps users compare quickly

**Tradeoff:**
- Requires additional computation and UI elements

---

## 9. Backend Server vs API-Based Architecture

**Considered:**
- Custom Node.js backend
- Direct API integrations

**Chose:**
- API-based (Shopify + Groq + Firebase)

**Because:**
- Faster development
- Reduced infrastructure overhead

**Tradeoff:**
- Less control over backend logic

---

## 10. Authentication vs Guest Mode

**Considered:**
- Mandatory login
- Optional login (guest mode)

**Chose:**
- Guest mode + Google Sign-In

**Because:**
- Reduces entry friction
- Improves accessibility

**Tradeoff:**
- Limited personalization for guest users

---

## 11. Feature Scope (MVP vs Full System)

**Considered:**
- Full feature set (voice, multi-store, personalization)
- Focused MVP

**Chose:**
- Focused MVP:
  - Chat
  - Recommendations
  - Compare
  - Wishlist/cart

**Because:**
- Faster execution
- Clear core value demonstration

**Tradeoff:**
- Limited feature breadth

---

## 12. Local Dataset vs Real-Time Data

**Considered:**
- Static dataset
- Real-time product data

**Chose:**
- Hybrid:
  - Shopify API (primary)
  - Local fallback dataset

**Because:**
- Ensures reliability
- Handles API failures

**Tradeoff:**
- Data consistency challenges

---

## 💡 Final Reflection

The system was built with a consistent principle:

> Prioritize **decision efficiency** over feature complexity.

Each decision was made to:
- Reduce user effort
- Improve clarity
- Maintain system reliability
- Balance speed and intelligence

---