/**
 * Serves this folder as a static site, the way GitHub Pages does.
 *
 *   pnpm preview              http://localhost:4173
 *   pnpm preview --port 8080  or PORT=8080 pnpm preview
 */
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const portArg = process.argv.indexOf("--port");
const PORT = Number(portArg > -1 ? process.argv[portArg + 1] : process.env.PORT) || 4173;

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

// Never serve repo plumbing, even though it sits in the same folder.
const HIDDEN = /^\/(\.|node_modules\/|scripts\/|package\.json|pnpm-lock\.yaml|tsconfig\.json)/;

const fileFor = (urlPath: string): string | null => {
  let path: string;
  try {
    path = normalize(decodeURIComponent(urlPath));
  } catch {
    return null;
  }
  if (HIDDEN.test(path.replaceAll(sep, "/"))) return null;
  let file = join(ROOT, path);
  if (file !== ROOT && !file.startsWith(ROOT + sep)) return null;
  try {
    if (statSync(file).isDirectory()) file = join(file, "index.html");
    return statSync(file).isFile() ? file : null;
  } catch {
    return null;
  }
};

const server = createServer((req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  const file = req.method === "GET" || req.method === "HEAD" ? fileFor(pathname) : null;
  const status = file ? 200 : 404;
  console.log(`${status} ${req.method} ${req.url}`);

  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
    return;
  }
  res.writeHead(200, {
    "Content-Type": TYPES[extname(file).toLowerCase()] ?? "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  if (req.method === "HEAD") res.end();
  else createReadStream(file).pipe(res);
});

server.on("error", (err: NodeJS.ErrnoException) => {
  console.error(err.code === "EADDRINUSE" ? `Port ${PORT} is in use. Try --port <n>.` : err.message);
  process.exit(1);
});

server.listen(PORT, () => console.log(`Preview at http://localhost:${PORT}/`));
