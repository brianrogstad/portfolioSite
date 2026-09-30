/**
 * Fails the build when a URL advertised in sitemap.xml has no prerendered file
 * in the build output, or resolves to the SPA fallback.
 *
 * GitHub Pages serves whatever file is at the requested path and falls through
 * to 404.html otherwise — and 404.html carries a 404 status. Every project
 * route used to land there: the page rendered fine in a browser but answered
 * crawlers with "this does not exist". This check is the guard, run as part of
 * `postbuild` against the real dist output.
 */
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const browserDistDir = path.join(root, 'dist', 'portfolio-site', 'browser');
const sitemapPath = path.join(browserDistDir, 'sitemap.xml');
const dataDir = path.join(root, 'src', 'app', 'data');

const errors = [];

const sitemap = await readFile(sitemapPath, 'utf8').catch(() => {
  console.error(`check-sitemap-routes: no sitemap.xml in ${browserDistDir}`);
  process.exit(1);
});

const locs = [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
if (locs.length === 0) {
  console.error('check-sitemap-routes: sitemap.xml lists no <loc> entries');
  process.exit(1);
}

/** The file a static host serves for a path: `/a/b/` -> `a/b/index.html`. */
function distFileFor(pathname) {
  const trimmed = pathname.replace(/^\/+/, '');
  if (trimmed === '') return 'index.html';
  if (trimmed.endsWith('/')) return `${trimmed}index.html`;
  return `${trimmed}/index.html`;
}

const fallback = await readFile(path.join(browserDistDir, '404.html'), 'utf8').catch(() => null);

for (const loc of locs) {
  let pathname;
  try {
    pathname = new URL(loc).pathname;
  } catch {
    errors.push(`sitemap lists a malformed URL: ${loc}`);
    continue;
  }

  const relative = distFileFor(pathname);
  const file = path.join(browserDistDir, relative);

  try {
    await access(file);
  } catch {
    errors.push(
      `${pathname} -> no ${relative} in the build output, so the host serves 404.html (HTTP 404)`,
    );
    continue;
  }

  // A file that is byte-identical to the SPA fallback is a soft 404: it
  // renders, but it is the wrong page and carries the wrong meta.
  const html = await readFile(file, 'utf8');
  if (fallback !== null && pathname !== '/' && html === fallback) {
    errors.push(`${pathname} -> ${relative} is byte-identical to the 404.html fallback`);
  }
}

// Each project page must carry its own written description, not the homepage's
// (which is what the fallback shipped).
const projectPaths = locs
  .map((loc) => new URL(loc).pathname)
  .filter((pathname) => pathname.startsWith('/projects/'));

for (const pathname of projectPaths) {
  const id = pathname.replace(/^\/projects\//, '').replace(/\/$/, '');
  const file = path.join(browserDistDir, distFileFor(pathname));

  let expected;
  try {
    expected = JSON.parse(await readFile(path.join(dataDir, `${id}.json`), 'utf8')).description;
  } catch {
    errors.push(`${pathname} -> no src/app/data/${id}.json backing this sitemap entry`);
    continue;
  }

  const html = await readFile(file, 'utf8').catch(() => '');
  const served = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1];
  if (!served) {
    errors.push(`${pathname} -> prerendered HTML has no meta description`);
  } else if (decodeEntities(served) !== expected) {
    errors.push(
      `${pathname} -> prerendered meta description does not match ${id}.json\n` +
        `      served:   ${served}\n` +
        `      expected: ${expected}`,
    );
  }
}

function decodeEntities(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

if (errors.length > 0) {
  console.error(`\ncheck-sitemap-routes: ${errors.length} problem(s):\n`);
  for (const error of errors) console.error(`  - ${error}`);
  console.error('');
  process.exit(1);
}

// Advisory only: prerendered project pages that no sitemap entry advertises.
const prerendered = await readdir(path.join(browserDistDir, 'projects'), {
  withFileTypes: true,
}).catch(() => []);
const listed = new Set(projectPaths.map((p) => p.replace(/^\/projects\//, '').replace(/\/$/, '')));
const unlisted = prerendered
  .filter((entry) => entry.isDirectory() && !listed.has(entry.name))
  .map((entry) => entry.name);
if (unlisted.length > 0) {
  console.log(
    `check-sitemap-routes: ${unlisted.length} prerendered project page(s) not in sitemap.xml ` +
      `(sub-pages, listed intentionally or not): ${unlisted.join(', ')}`,
  );
}

console.log(`check-sitemap-routes: all ${locs.length} sitemap URLs resolve to prerendered HTML`);
