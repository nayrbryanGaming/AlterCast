/**
 * AlterCast — Zero-dependency static HTTP server
 * Run: node server.cjs
 * Or:  node server.cjs 8080  (custom port)
 *
 * Serves all files from the project root with proper MIME types.
 * No external network calls. No proxy endpoints. Static files only.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const port = parseInt(process.argv[2], 10) || 3000;
const root = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".mjs":  "application/javascript; charset=utf-8",
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
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";

  const filePath = path.join(root, urlPath);
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`<h1>404 — ${urlPath} tidak ditemukan</h1><p><a href="/">Kembali ke beranda</a></p>`);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": mime,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache",
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`\nAlterCast Dev Server`);
  console.log(`  http://localhost:${port}/         (Landing)`);
  console.log(`  http://localhost:${port}/studio   (Studio)`);
  console.log(`  http://localhost:${port}/live     (Hologram)`);
  console.log(`  http://localhost:${port}/affiliate (TikTok Affiliate)`);
  console.log(`  http://localhost:${port}/overlay  (OBS overlay)`);
  console.log(`Static files only. No proxy. Ctrl+C to stop.\n`);
});

process.on("SIGINT", () => { console.log("\nServer dihentikan."); process.exit(0); });
