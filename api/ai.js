/**
 * AlterCast /api/ai — Vercel Serverless
 * Supports: Groq (free, fast) OR Anthropic Claude
 * Set env vars in Vercel: GROQ_API_KEY or ANTHROPIC_API_KEY
 */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST")   { res.status(405).json({ error: "method not allowed" }); return; }

  const { prompt } = req.body || {};
  if (!prompt) { res.status(400).json({ error: "no prompt" }); return; }

  const GROQ_KEY      = process.env.GROQ_API_KEY || "";
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || "";

  /* ── TRY GROQ FIRST (free, ~200ms) ── */
  if (GROQ_KEY) {
    try {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 120,
          messages: [
            {
              role: "system",
              content: "Kamu AlterCast, AI streamer perempuan santai dan ekspresif. Balas dengan 1-2 kalimat singkat dalam Bahasa Indonesia yang natural dan hangat. Tidak pakai emoji berlebihan.",
            },
            { role: "user", content: prompt },
          ],
        }),
      });
      const data = await r.json();
      const text = data.choices?.[0]?.message?.content || "";
      if (text) { res.status(200).json({ text, provider: "groq" }); return; }
    } catch (e) {
      console.error("Groq error:", e.message);
    }
  }

  /* ── TRY ANTHROPIC CLAUDE ── */
  if (ANTHROPIC_KEY) {
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 120,
          system: "Kamu AlterCast, AI streamer perempuan santai dan ekspresif. Balas dengan 1-2 kalimat singkat dalam Bahasa Indonesia yang natural dan hangat.",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await r.json();
      const text = data.content?.[0]?.text || "";
      if (text) { res.status(200).json({ text, provider: "anthropic" }); return; }
    } catch (e) {
      console.error("Anthropic error:", e.message);
    }
  }

  /* ── FALLBACK — no API key set ── */
  const FALLBACKS = [
    "Halo gaes! Makasih udah nonton, semangat terus ya!",
    "Wah pertanyaan bagus, aku suka itu!",
    "Ayoo kita live bareng-bareng terus!",
    "Keren banget kalian datang, love you all!",
    "Makasih gift-nya, very much appreciated!",
    "Hahaha lucu banget, nice one gaes!",
    "Stay tuned ya, masih banyak yang seru!",
    "Siap, aku jawab satu-satu ya!",
  ];
  const text = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
  res.status(200).json({ text, provider: "fallback" });
}
