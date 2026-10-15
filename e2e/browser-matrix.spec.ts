import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

// docs/qa/browser-matrix.md is the committed matrix; its Automated rows must
// name exactly the Playwright projects this config runs.

test('browser matrix doc matches the Playwright projects', () => {
  const doc = readFileSync(
    path.resolve(__dirname, '..', 'docs', 'qa', 'browser-matrix.md'),
    'utf8',
  );
  const automated = doc
    .split('\n')
    .filter((line) => /^\|.*\|\s*Automated\s*\|$/.test(line))
    .map((line) => line.split('|')[1].trim())
    .sort();
  const configured = test
    .info()
    .config.projects.map((p) => p.name)
    .sort();
  expect(automated).toEqual(configured);
});
