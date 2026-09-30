/**
 * Fallback meta description for a project page.
 *
 * Every project in `src/app/data/` carries a written `description`, and
 * `scripts/check-project-data.mjs` fails the build if one goes missing — so
 * this is a safety net, not shipping copy. It previously interpolated the
 * category straight into the sentence, which produced two bugs at once:
 * "My Projects" is a nav menu label, not prose ("a my projects project"), and
 * the article was hardcoded "a" ("a enterprise design project"). Hence the
 * prose label map and the article lookup below.
 */

/** Prose labels for the nav-facing `category` values in `src/app/data/*.json`. */
const CATEGORY_LABELS: Record<string, string> = {
  'Branding & Marketing': 'branding and marketing project',
  Development: 'development project',
  'Email Design & Development': 'email design and development project',
  'Enterprise Design': 'enterprise design project',
  'Information Architecture': 'information architecture project',
  'Mobile Application Design': 'mobile application design project',
  'My Projects': 'personal project',
  'Responsive Web Design': 'responsive web design project',
  Sketches: 'sketchbook study',
  'UI Design': 'UI design project',
};

/** Used when a new category ships before it gets a prose label here. */
const GENERIC_LABEL = 'design and development project';

/**
 * Letters whose *names* begin with a vowel sound, for initialisms read one
 * letter at a time: "an FBI file", "an SVG", but "a UI" (U is read "you").
 */
const VOWEL_SOUNDING_LETTERS = new Set([
  'A',
  'E',
  'F',
  'H',
  'I',
  'L',
  'M',
  'N',
  'O',
  'R',
  'S',
  'X',
]);

/** Vowel-spelled words read with a leading consonant sound: "a eulogy", "a one-off". */
const CONSONANT_SOUND_PREFIXES = [
  'eu', // eulogy, euro
  'one', // one-off
  'once',
];

/** Consonant-spelled words read with a leading vowel sound: "an hour". */
const VOWEL_SOUND_PREFIXES = ['heir', 'honest', 'honor', 'hour'];

/** `u`-words outside the un-/uni- split below that still take "an". */
const U_VOWEL_SOUND_PREFIXES = ['udd', 'ugl', 'um', 'up', 'ush', 'utt'];

/**
 * `u` is the awkward letter: "a user" but "an umbrella". The split that covers
 * most of English — "uni-" is read "yoo" ("a uniform", "a unique mark"), a
 * negating "un-" is read "un" ("an unusual brief"), and the remaining u-words
 * in this vocabulary ("user", "utility", "usual") take "yoo". Known miss:
 * "unanimous", which is read "yoo" but matches the un- rule.
 */
function articleForU(word: string): 'a' | 'an' {
  if (word.startsWith('uni')) return 'a';
  if (word.startsWith('un')) return 'an';
  return U_VOWEL_SOUND_PREFIXES.some((prefix) => word.startsWith(prefix)) ? 'an' : 'a';
}

/**
 * Picks the indefinite article for a phrase from its initial *sound* rather
 * than its initial letter. Heuristic, not a pronunciation dictionary — it
 * covers initialisms and the common English exceptions, which is what the
 * category labels need.
 */
export function indefiniteArticle(phrase: string): 'a' | 'an' {
  const firstWord =
    phrase
      .trim()
      .split(/\s+/)[0]
      ?.replace(/[^A-Za-z]/g, '') ?? '';
  if (!firstWord) return 'a';

  // Initialism read letter by letter ("UI", "SVG") — go by the letter's name.
  if (firstWord.length > 1 && firstWord === firstWord.toUpperCase()) {
    return VOWEL_SOUNDING_LETTERS.has(firstWord[0]) ? 'an' : 'a';
  }

  const word = firstWord.toLowerCase();

  if (VOWEL_SOUND_PREFIXES.some((prefix) => word.startsWith(prefix))) return 'an';
  if (word.startsWith('u')) return articleForU(word);
  if (CONSONANT_SOUND_PREFIXES.some((prefix) => word.startsWith(prefix))) return 'a';

  return /^[aeio]/.test(word) ? 'an' : 'a';
}

/** Human-readable prose label for a project category. */
export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? GENERIC_LABEL;
}

/**
 * Grammatical one-line description for a project that has no written
 * `description` of its own.
 */
export function fallbackDescription(title: string, category: string): string {
  const label = categoryLabel(category);
  return `${title} — ${indefiniteArticle(label)} ${label} in Brian Rogstad's portfolio.`;
}
