// Tiny static file server for Kazana Travel.
// Usage:  node server.js  (defaults to http://127.0.0.1:8000)
const http = require("http");
const fs   = require("fs");
const path = require("path");

const PORT = parseInt(process.env.PORT || "8000", 10);
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".webp": "image/webp",
  ".ico":  "image/x-icon",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
  ".otf":  "font/otf"
};

function safeJoin(root, urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const resolved = path.normalize(path.join(root, decoded));
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

const server = http.createServer((req, res) => {
  let urlPath = req.url || "/";
  if (urlPath === "/") urlPath = "/index.html";
  let filePath = safeJoin(ROOT, urlPath);
  if (!filePath) { res.writeHead(403); return res.end("Forbidden"); }

  fs.stat(filePath, (err, stat) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain" }); return res.end("Not found: " + urlPath); }
    if (stat.isDirectory()) {
      filePath = path.join(filePath, "index.html");
      fs.stat(filePath, (e2) => {
        if (e2) { res.writeHead(404); return res.end("Not found"); }
        serveFile(filePath, res);
      });
      return;
    }
    serveFile(filePath, res);
  });
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  res.writeHead(200, {
    "Content-Type": type,
    "Cache-Control": "no-cache"
  });
  fs.createReadStream(filePath).pipe(res);
}

server.listen(PORT, "127.0.0.1", () => {
  console.log("Kazana Travel running at http://127.0.0.1:" + PORT + "/");
  console.log("Serving from: " + ROOT);
});
