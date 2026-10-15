// Serves the production browser artifact the way GitHub Pages does, so E2E
// hard loads see what the deployed site sees: a file or a directory
// index.html answers 200, anything else gets 404.html with status 404.
// The Express SSR server is not used here: Pages never runs it.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// E2E_DIST_DIR points at a copied artifact when another build may rewrite dist/.
const root = path.resolve(
  process.env['E2E_DIST_DIR'] || path.join(__dirname, '..', 'dist', 'portfolio-site', 'browser'),
);
const port = Number(process.env['PORT'] || 4300);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

async function isFile(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

async function resolveFile(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  const target = path.join(root, clean);
  if (!target.startsWith(root)) return null;
  for (const candidate of [target, path.join(target, 'index.html'), `${target}.html`]) {
    if (await isFile(candidate)) return candidate;
  }
  return null;
}

createServer(async (req, res) => {
  try {
    const urlPath = new URL(req.url ?? '/', 'http://localhost').pathname;
    const file = await resolveFile(urlPath);
    const status = file ? 200 : 404;
    const served = file ?? path.join(root, '404.html');
    const body = await readFile(served);
    res.writeHead(status, {
      'content-type': types[path.extname(served)] ?? 'application/octet-stream',
    });
    res.end(body);
  } catch (err) {
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    res.end(`serve-pages-static: ${err instanceof Error ? err.message : String(err)}`);
  }
}).listen(port, () => {
  console.log(`GitHub Pages static mirror on http://localhost:${port} (${root})`);
});
