import { cp, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const browserDistDir = path.resolve(__dirname, '..', 'dist', 'portfolio-site', 'browser');
const indexHtmlPath = path.join(browserDistDir, 'index.html');
const spaFallbackPath = path.join(browserDistDir, '404.html');
const staticRoutes = ['about'];

await cp(indexHtmlPath, spaFallbackPath);

for (const route of staticRoutes) {
  const routeDir = path.join(browserDistDir, route);
  const routeIndexPath = path.join(routeDir, 'index.html');
  await mkdir(routeDir, { recursive: true });

  try {
    await access(routeIndexPath);
  } catch {
    await cp(indexHtmlPath, routeIndexPath);
  }
}

console.log(`Generated GitHub Pages route entry points for: ${staticRoutes.join(', ')}`);
