/**
 * AlterCast — Dev Server
 * Run: node server.cjs
 * Or:  node server.cjs 3000
 *
 * Features:
 *  - Static file serving with cleanURL (folder → index.html)
 *  - /api/ai proxy to Claude API (needs ANTHROPIC_API_KEY env var)
 *  - All MIME types including GLB/GLTF
 */

const http  = require("http");
const https = require("https");
const fs    = require("fs");
const path  = require("path");

const port = parseInt(process.argv[2], 10) || 3000;
const root = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".mjs":  "application/javascript; charset=utf-8",
  ".cjs":  "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".svg":  "image/svg+xml",
  ".webp": "image/webp",
  ".ico":  "image/x-icon",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
  ".otf":  "font/otf",
  ".map":  "application/json",
  ".glb":  "model/gltf-binary",
  ".gltf": "model/gltf+json",
  ".bin":  "application/octet-stream",
};

/* ── /api/ai  ── */
function handleAI(req, res) {
  let body = "";
  req.on("data", d => { body += d; });
  req.on("end", () => {
    let prompt = "";
    try { prompt = JSON.parse(body).prompt || ""; } catch(e) {}
    if (!prompt) { res.writeHead(400); res.end('{"error":"no prompt"}'); return; }

    const apiKey = process.env.ANTHROPIC_API_KEY || "";
    if (!apiKey) {
      /* Fallback: pre-baked Indonesian streamer responses */
      const FALLBACKS = [
        "Halo gaes! Makasih udah nonton yaa, semangat terus!",
        "Wah mantap banget pertanyaannya, aku suka itu!",
        "Ayooo kita terus live bareng bareng ya!",
        "Keren banget kalian datang, love you all!",
        "Siap siap, aku bakal jawab satu satu ya!",
        "Hahaha lucu banget, nice one gaes!",
        "Makasih gift-nya, very much appreciated!",
        "Stay tuned ya, masih banyak yang seru nih!",
      ];
      const r = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
      res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
      res.end(JSON.stringify({ text: r }));
      return;
    }

    const payload = JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      system: "Kamu adalah AlterCast, AI streamer perempuan santai dan ekspresif. Balas dengan 1-2 kalimat singkat dalam Bahasa Indonesia yang natural dan hangat.",
      messages: [{ role: "user", content: prompt }]
    });

    const options = {
      hostname: "api.anthropic.com",
      path: "/v1/messages",
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "content-length": Buffer.byteLength(payload),
      },
    };

    const apiReq = https.request(options, apiRes => {
      let data = "";
      apiRes.on("data", d => { data += d; });
      apiRes.on("end", () => {
        try {
          const json = JSON.parse(data);
          const text = json.content?.[0]?.text || "";
          res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
          res.end(JSON.stringify({ text }));
        } catch(e) {
          res.writeHead(500); res.end('{"error":"parse"}');
        }
      });
    });
    apiReq.on("error", e => {
      res.writeHead(502); res.end(JSON.stringify({ error: e.message }));
    });
    apiReq.write(payload);
    apiReq.end();
  });
}

/* ── Static file server with cleanURL ── */
function serveFile(filePath, res) {
  const ext  = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || "application/octet-stream";
  res.writeHead(200, {
    "Content-Type": mime,
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-cache",
  });
  fs.createReadStream(filePath).pipe(res);
}

function tryPath(candidates, res, urlPath) {
  const [first, ...rest] = candidates;
  if (!first) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<!DOCTYPE html><html><body style="font:14px sans-serif;padding:40px;background:#0D0F17;color:#8B96B0">
      <h2 style="color:#FF5050">404 — ${urlPath}</h2>
      <p>File tidak ditemukan.</p>
      <a href="/" style="color:#00D4FF">← Kembali ke beranda</a>
    </body></html>`);
    return;
  }
  fs.stat(first, (err, stat) => {
    if (!err && stat.isFile()) { serveFile(first, res); return; }
    tryPath(rest, res, urlPath);
  });
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);

  /* CORS preflight */
  if (req.method === "OPTIONS") {
    res.writeHead(204, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" });
    res.end(); return;
  }

  /* /api/ai */
  if (urlPath === "/api/ai" && req.method === "POST") { handleAI(req, res); return; }

  /* Security: no path traversal */
  const abs = path.join(root, urlPath);
  if (!abs.startsWith(root)) { res.writeHead(403); res.end("Forbidden"); return; }

  /* cleanURL resolution order:
     1. Exact path (file exists)
     2. path.html (e.g. /pure → pure.html)
     3. path/index.html (e.g. /pure → pure/index.html)
     4. /index.html fallback for root
  */
  if (urlPath === "/") {
    tryPath([path.join(root, "index.html")], res, urlPath);
    return;
  }

  tryPath([
    abs,
    abs + ".html",
    path.join(abs, "index.html"),
  ], res, urlPath);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`\n  AlterCast Dev Server — port ${port}`);
  console.log(`  http://localhost:${port}/          Landing`);
  console.log(`  http://localhost:${port}/pure       Studio 3D`);
  console.log(`  http://localhost:${port}/studio     Studio (redirect)`);
  console.log(`  http://localhost:${port}/affiliate  Affiliate`);
  console.log(`  http://localhost:${port}/api/ai     Claude AI proxy`);
  console.log(`\n  AI: ${process.env.ANTHROPIC_API_KEY ? "ANTHROPIC_API_KEY ✓ (live Claude)" : "no key → fallback responses"}`);
  console.log(`  Ctrl+C to stop\n`);
});

process.on("SIGINT", () => { console.log("\nServer dihentikan."); process.exit(0); });
