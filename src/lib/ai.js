export async function getAIResponse(input, products) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `User: ${input}

Products:
${products.map(p => `${p.name} ₹${p.price}`).join("\n")}

Explain best choice and tradeoffs.`
            }]
          }]
        })
      }
    );

    const data = await res.json();

    return data?.candidates?.[0]?.content?.parts?.[0]?.text;

  } catch {
    return null;
  }
}