import { categoryLabel, fallbackDescription, indefiniteArticle } from './project-description';

/** Every `category` value present in `src/app/data/*.json`. */
const DATA_CATEGORIES = [
  'Branding & Marketing',
  'Development',
  'Email Design & Development',
  'Enterprise Design',
  'Information Architecture',
  'Mobile Application Design',
  'My Projects',
  'Responsive Web Design',
  'Sketches',
  'UI Design',
];

describe('indefiniteArticle', () => {
  it('uses "an" before vowel sounds', () => {
    expect(indefiniteArticle('enterprise design project')).toBe('an');
    expect(indefiniteArticle('information architecture project')).toBe('an');
    expect(indefiniteArticle('email design project')).toBe('an');
    expect(indefiniteArticle('hour-long study')).toBe('an');
    expect(indefiniteArticle('umbrella brand')).toBe('an');
  });

  it('uses "a" before consonant sounds', () => {
    expect(indefiniteArticle('branding and marketing project')).toBe('a');
    expect(indefiniteArticle('personal project')).toBe('a');
    expect(indefiniteArticle('sketchbook study')).toBe('a');
  });

  it('reads initialisms by letter name rather than spelling', () => {
    // U is read "you", so "a UI" — not "an UI".
    expect(indefiniteArticle('UI design project')).toBe('a');
    // F is read "eff", so "an FAQ" — not "a FAQ".
    expect(indefiniteArticle('FAQ rewrite')).toBe('an');
    expect(indefiniteArticle('SVG icon set')).toBe('an');
  });

  it('uses "a" for vowel-spelled words read with a leading consonant sound', () => {
    expect(indefiniteArticle('user research study')).toBe('a');
    expect(indefiniteArticle('unique mark')).toBe('a');
    expect(indefiniteArticle('uniform grid')).toBe('a');
    expect(indefiniteArticle('utility screen')).toBe('a');
    expect(indefiniteArticle('one-off poster')).toBe('a');
  });

  it('keeps "an" for u-words read with a leading vowel sound', () => {
    expect(indefiniteArticle('umbrella brand')).toBe('an');
    expect(indefiniteArticle('unusual brief')).toBe('an');
    expect(indefiniteArticle('upstream change')).toBe('an');
  });

  it('falls back to "a" for empty input', () => {
    expect(indefiniteArticle('')).toBe('a');
    expect(indefiniteArticle('   ')).toBe('a');
  });
});

describe('categoryLabel', () => {
  it('maps the nav-facing category slug to prose', () => {
    // "My Projects" is a menu label; as prose it must not read
    // "a my projects project".
    expect(categoryLabel('My Projects')).toBe('personal project');
    expect(categoryLabel('Sketches')).toBe('sketchbook study');
  });

  it('gives an unmapped category a neutral label rather than raw slug text', () => {
    expect(categoryLabel('Some New Category')).toBe('design and development project');
  });
});

describe('fallbackDescription', () => {
  it('produces grammatical English for every category in the project data', () => {
    for (const category of DATA_CATEGORIES) {
      const sentence = fallbackDescription('Example Project', category);

      expect(sentence)
        .withContext(`category: ${category}`)
        .toMatch(/^Example Project — an? [A-Za-z][\w &-]* in Brian Rogstad's portfolio\.$/);
      // The old template said "project" twice for "My Projects".
      expect(sentence)
        .withContext(`category: ${category}`)
        .not.toMatch(/project project/i);
      // The old template hardcoded "a", producing "a enterprise design project".
      expect(sentence)
        .withContext(`category: ${category}`)
        .not.toMatch(/\ba [aeio]/);
    }
  });

  it('picks the article from the label, not the title', () => {
    expect(fallbackDescription('US Bancorp', 'Enterprise Design')).toBe(
      "US Bancorp — an enterprise design project in Brian Rogstad's portfolio.",
    );
    expect(fallbackDescription('Version Seven', 'My Projects')).toBe(
      "Version Seven — a personal project in Brian Rogstad's portfolio.",
    );
    expect(fallbackDescription('USB Design System Samples', 'UI Design')).toBe(
      "USB Design System Samples — a UI design project in Brian Rogstad's portfolio.",
    );
  });

  it('never emits the old fallback signature', () => {
    for (const category of DATA_CATEGORIES) {
      expect(fallbackDescription('Example Project', category)).not.toContain(
        'project by Brian Rogstad.',
      );
    }
  });
});
