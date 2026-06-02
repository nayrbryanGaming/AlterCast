/**
 * AlterCast /api/ai — Vercel Serverless + Neon PostgreSQL
 * POST { prompt, sessionId? } → { text, provider }
 *
 * Database: Neon (DATABASE_URL auto-set by Vercel integration)
 * AI: Groq LLaMA (primary, fast, free) → Anthropic (fallback)
 */
import { neon } from "@neondatabase/serverless";

/* ── Init Neon DB ── */
async function getDB() {
  if (!process.env.DATABASE_URL) return null;
  try {
    const sql = neon(process.env.DATABASE_URL);
    /* Create tables if not exists */
    await sql`
      CREATE TABLE IF NOT EXISTS ai_chat_history (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL DEFAULT 'default',
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS streamer_sessions (
        id SERIAL PRIMARY KEY,
        session_id TEXT UNIQUE NOT NULL,
        character TEXT,
        bg TEXT,
        total_messages INT DEFAULT 0,
        started_at TIMESTAMPTZ DEFAULT NOW(),
        last_active TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    return sql;
  } catch (e) {
    console.error("DB init error:", e.message);
    return null;
  }
}

/* ── Get recent chat history for context ── */
async function getHistory(sql, sessionId, limit = 10) {
  if (!sql) return [];
  try {
    const rows = await sql`
      SELECT role, content FROM ai_chat_history
      WHERE session_id = ${sessionId}
      ORDER BY created_at DESC LIMIT ${limit}
    `;
    return rows.reverse(); /* oldest first for context */
  } catch (e) {
    return [];
  }
}

/* ── Save message to history ── */
async function saveMessage(sql, sessionId, role, content) {
  if (!sql) return;
  try {
    await sql`
      INSERT INTO ai_chat_history (session_id, role, content)
      VALUES (${sessionId}, ${role}, ${content})
    `;
    /* Update session stats */
    await sql`
      INSERT INTO streamer_sessions (session_id, total_messages, last_active)
      VALUES (${sessionId}, 1, NOW())
      ON CONFLICT (session_id) DO UPDATE SET
        total_messages = streamer_sessions.total_messages + 1,
        last_active = NOW()
    `;
  } catch (e) {
    console.error("Save message error:", e.message);
  }
}

const SYSTEM_PROMPT = `Kamu adalah AlterCast, AI streamer perempuan yang santai, ekspresif, dan hangat.
Kamu sedang live streaming. Balas dengan 1-2 kalimat singkat dalam Bahasa Indonesia yang natural.
Jangan pakai emoji berlebihan. Jangan sebut nama dirimu kecuali ditanya.`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST")   { res.status(405).json({ error: "method not allowed" }); return; }

  const { prompt, sessionId = "default" } = req.body || {};
  if (!prompt) { res.status(400).json({ error: "no prompt" }); return; }

  /* Connect to Neon database */
  const sql = await getDB();

  /* Get conversation history for context */
  const history = await getHistory(sql, sessionId, 8);

  /* Save user message */
  await saveMessage(sql, sessionId, "user", prompt);

  /* Build messages array with history */
  const messages = [
    ...history.map(h => ({ role: h.role, content: h.content })),
    { role: "user", content: prompt },
  ];

  const GROQ_KEY      = process.env.GROQ_API_KEY || "";
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || "";

  let responseText = "";
  let provider = "fallback";

  /* ── TRY GROQ FIRST (free, fast ~200ms) ── */
  if (GROQ_KEY) {
    try {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 150,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        }),
      });
      const data = await r.json();
      responseText = data.choices?.[0]?.message?.content || "";
      if (responseText) provider = "groq";
    } catch (e) { console.error("Groq:", e.message); }
  }

  /* ── FALLBACK: ANTHROPIC ── */
  if (!responseText && ANTHROPIC_KEY) {
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
          max_tokens: 150,
          system: SYSTEM_PROMPT,
          messages,
        }),
      });
      const data = await r.json();
      responseText = data.content?.[0]?.text || "";
      if (responseText) provider = "anthropic";
    } catch (e) { console.error("Anthropic:", e.message); }
  }

  /* ── HARDCODED FALLBACK ── */
  if (!responseText) {
    const FALLBACKS = [
      "Halo gaes! Makasih udah nonton ya!",
      "Wah pertanyaan bagus banget itu!",
      "Ayoo kita terus live bareng!",
      "Keren banget kalian di sini, love you!",
      "Siap, aku jawab ya!",
    ];
    responseText = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
  }

  /* Save AI response to history */
  await saveMessage(sql, sessionId, "assistant", responseText);

  res.status(200).json({
    text: responseText,
    provider,
    db: sql ? "neon-connected" : "no-db",
    historyCount: history.length,
  });
}
