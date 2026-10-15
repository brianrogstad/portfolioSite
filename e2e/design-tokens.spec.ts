import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

// Theme and tokens spec (projects/portfolio/specs/theme-and-tokens-spec.md):
// src/styles/base/_tokens.scss is the primitive tier. It owns every raw
// color value and the spacing scale; _colors.scss maps semantic custom
// properties onto those primitives and holds no hex of its own.

const styles = path.resolve(__dirname, '..', 'src', 'styles', 'base');
const read = (file: string) => readFileSync(path.join(styles, file), 'utf8');
const strip = (scss: string) => scss.replace(/\/\/.*$/gm, '');

test('primitive tokens define the documented spacing scale xs through xl', () => {
  // .claude/rules/project.md "Design Tokens": 4px baseline, rem units.
  const tokens = strip(read('_tokens.scss'));
  const scale: Record<string, string> = {};
  for (const m of tokens.matchAll(/^\$spacing-(xs|sm|md|lg|xl):\s*([\d.]+rem)\s*;/gm)) {
    scale[m[1]] = m[2];
  }
  expect(scale).toEqual({ xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' });
  for (const k of Object.keys(scale)) {
    expect(tokens).toContain(`--space-${k}: #{$spacing-${k}}`);
  }
});

test('_colors.scss holds no raw hex; every color comes from a primitive', () => {
  expect(strip(read('_colors.scss'))).not.toMatch(/#[0-9a-f]{3,8}\b/i);
});

test('primitive palette has no duplicate values', () => {
  const hexes = [
    ...strip(read('_tokens.scss')).matchAll(/^\$[\w-]+:\s*(#[0-9a-f]{3,8})\s*;/gim),
  ].map((m) => m[1].toLowerCase());
  expect(hexes.length).toBeGreaterThan(0);
  expect(new Set(hexes).size).toBe(hexes.length);
});

test('no conflicting legacy blue hex outside _tokens.scss', () => {
  const legacy = /#(307ecd|166fc8|0066cc|4285f4|8ab4f8)\b/i;
  const root = path.resolve(__dirname, '..', 'src');
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((f) => {
      const p = path.join(dir, f);
      return statSync(p).isDirectory() ? walk(p) : /\.(scss|html|ts)$/.test(p) ? [p] : [];
    });
  const hits = walk(root).filter(
    (p) => !p.endsWith('_tokens.scss') && legacy.test(readFileSync(p, 'utf8')),
  );
  expect(hits).toEqual([]);
});
