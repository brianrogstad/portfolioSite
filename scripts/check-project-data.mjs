/**
 * Fails the build when a project JSON file in `src/app/data/` is missing the
 * written `description` that becomes its meta description and og:description.
 *
 * Without this gate, a project with no `description` silently falls back to a
 * generated sentence (see project-description.ts) and ships machine-assembled
 * copy as the line that represents the work in search results and link
 * previews. Runs as `prebuild`.
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '..', 'src', 'app', 'data');
const labelSource = path.resolve(
  __dirname,
  '..',
  'src',
  'app',
  'pages',
  'project-detail',
  'project-description.ts',
);

/** Manifest files in the same folder that aren't projects. */
const NOT_PROJECTS = new Set(['home-cards.json']);

const MIN_LENGTH = 40;
const MAX_LENGTH = 200;

const errors = [];
const warnings = [];

const files = (await readdir(dataDir))
  .filter((f) => f.endsWith('.json') && !NOT_PROJECTS.has(f))
  .sort();

if (files.length === 0) {
  console.error(`check-project-data: no project JSON files found in ${dataDir}`);
  process.exit(1);
}

const categories = new Set();

for (const file of files) {
  let project;
  try {
    project = JSON.parse(await readFile(path.join(dataDir, file), 'utf8'));
  } catch (err) {
    errors.push(`${file}: not valid JSON — ${err.message}`);
    continue;
  }

  // Every routed project page needs these three to render at all.
  for (const key of ['id', 'title', 'category']) {
    if (typeof project[key] !== 'string' || project[key].trim() === '') {
      errors.push(`${file}: "${key}" is missing or empty`);
    }
  }

  if (typeof project.category === 'string') categories.add(project.category);

  const { description } = project;
  if (description === undefined) {
    errors.push(
      `${file}: "description" is missing — write one sentence about what the work was. ` +
        `It ships as the page's meta description and og:description.`,
    );
    continue;
  }
  if (typeof description !== 'string' || description.trim() === '') {
    errors.push(`${file}: "description" must be a non-empty string`);
    continue;
  }
  const length = description.trim().length;
  if (length < MIN_LENGTH) {
    errors.push(
      `${file}: "description" is ${length} characters — too thin to be useful (min ${MIN_LENGTH})`,
    );
  }
  if (length > MAX_LENGTH) {
    errors.push(
      `${file}: "description" is ${length} characters — search results truncate around ${MAX_LENGTH}`,
    );
  }
}

// Advisory: a category with no prose label falls back to a generic phrase in
// project-description.ts. Not fatal — every project carries its own written
// description, so the generated sentence is only a safety net.
try {
  const source = await readFile(labelSource, 'utf8');
  const mapBody = source.match(/const CATEGORY_LABELS[^{]*\{([\s\S]*?)\n\};/)?.[1] ?? '';
  const labelled = new Set(
    [...mapBody.matchAll(/^\s*(?:'([^']+)'|"([^"]+)"|([A-Za-z_$][\w$]*))\s*:/gm)].map(
      (m) => m[1] ?? m[2] ?? m[3],
    ),
  );
  for (const category of [...categories].sort()) {
    if (!labelled.has(category)) {
      warnings.push(
        `category "${category}" has no prose label in project-description.ts — ` +
          `the generated fallback sentence will read generically for it`,
      );
    }
  }
} catch (err) {
  warnings.push(`could not read category labels from project-description.ts — ${err.message}`);
}

for (const warning of warnings) {
  console.warn(`check-project-data: warning: ${warning}`);
}

if (errors.length > 0) {
  console.error(`\ncheck-project-data: ${errors.length} problem(s) in src/app/data/:\n`);
  for (const error of errors) console.error(`  - ${error}`);
  console.error('');
  process.exit(1);
}

console.log(`check-project-data: ${files.length} project files OK (all carry a description)`);
