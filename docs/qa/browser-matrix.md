# Browser and Device Matrix

The browsers and viewports the QA layer covers, and how. The **Automated**
rows must match the `projects` in `playwright.config.ts`;
`e2e/browser-matrix.spec.ts` fails if they drift.

| Project        | Engine   | Device / viewport                  | Coverage  |
| -------------- | -------- | ---------------------------------- | --------- |
| chromium       | Chromium | Desktop Chrome, 1280x720           | Automated |
| firefox        | Gecko    | Desktop Firefox, 1280x720          | Automated |
| webkit         | WebKit   | Desktop Safari, 1280x720           | Automated |
| mobile-chrome  | Chromium | Pixel 7, 412x839, touch            | Automated |
| ios-safari     | WebKit   | Real iPhone, current iOS Safari    | Manual    |
| android-chrome | Chromium | Real Android phone, current Chrome | Manual    |
| desktop-edge   | Chromium | Edge, latest, Windows              | Manual    |
| screen-reader  | -        | VoiceOver on macOS Safari          | Manual    |

## What runs where

- **Automated** (every `npm run e2e`): the harness smoke, the evaluator
  journey, the GitHub Pages deep-link checks and the axe-core scan, in all
  four automated projects.
- **Manual**: real-device rendering, touch feel and screen-reader reading
  order. These are checked in the one-time live-domain pass owned by the
  legal-and-launch spec, and again when a release changes layout or
  navigation.
