import { readFileSync } from 'node:fs';
import path from 'node:path';

const appDir = path.resolve(__dirname, '..', '..', 'src', 'app');

/** The ids app.routes.server.ts prerenders: the keys of PROJECT_LOADERS. */
export function projectIds(): string[] {
  const source = readFileSync(path.join(appDir, 'services', 'projects.service.ts'), 'utf8');
  const block = source.slice(
    source.indexOf('const PROJECT_LOADERS'),
    source.indexOf('export const PROJECT_IDS'),
  );
  return [...block.matchAll(/^\s+'?([\w-]+)'?:\s*\(\)\s*=>/gm)].map((m) => m[1]).sort();
}

/** The case-study title a project page renders, from src/app/data/<id>.json. */
export function projectTitle(id: string): string {
  const file = path.join(appDir, 'data', `${id}.json`);
  return (JSON.parse(readFileSync(file, 'utf8')) as { title: string }).title;
}
