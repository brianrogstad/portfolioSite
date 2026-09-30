import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('gives the hero its visible identity line as the page h1', () => {
    const heading = fixture.nativeElement.querySelector('h1') as HTMLElement;

    expect(heading.textContent?.trim()).toBe('Brian Rogstad');
    expect(heading.classList).toContain('hero-intro__name');
    // It used to be sr-only, with a placeholder paragraph rendered in its place.
    expect(heading.classList).not.toContain('sr-only');
  });

  it('keeps placeholder text out of the top-of-fold hero copy', () => {
    const hero = fixture.nativeElement.querySelector('.hero-intro') as HTMLElement;

    expect(hero.textContent).not.toMatch(/I accept cookies/i);
    expect(hero.textContent).toContain('I design and build systems');
  });

  describe('target size (WCAG 2.2 SC 2.5.8)', () => {
    // Neither axe-core nor Lighthouse covers 2.5.8, so measure it directly.
    // The card CTAs are the unambiguous case: standalone, button-role
    // affordances in a card layout with no inline-text exemption.
    it('renders every project card CTA at least 24px tall', () => {
      const ctas = Array.from(
        fixture.nativeElement.querySelectorAll('.project-card__links a'),
      ) as HTMLAnchorElement[];
      expect(ctas.length).toBeGreaterThan(0);

      for (const cta of ctas) {
        const { height } = cta.getBoundingClientRect();
        expect(height)
          .withContext(`"${(cta.textContent ?? '').trim()}" is ${Math.round(height)}px tall`)
          .toBeGreaterThanOrEqual(24);
      }
    });
  });

  describe('project card CTA accessible names (WCAG 2.5.3 Label in Name)', () => {
    it('contains the visible label verbatim', () => {
      expect(component.ctaAriaLabel('View Screenshots', 'Version Seven')).toContain(
        'View Screenshots',
      );
      expect(component.ctaAriaLabel('View Site', "Ana's Journal")).toContain('View Site');
    });

    it('still names the project, so link purpose stays clear (WCAG 2.4.4)', () => {
      expect(component.ctaAriaLabel('View Screenshots', 'Version Seven')).toBe(
        'View Screenshots: Version Seven',
      );
      expect(component.ctaAriaLabel('View Site', "Ana's Journal")).toBe("View Site: Ana's Journal");
    });

    it('gives every rendered CTA a unique accessible name containing its visible text', () => {
      const ctas = Array.from(
        fixture.nativeElement.querySelectorAll('.project-card__links a'),
      ) as HTMLAnchorElement[];
      expect(ctas.length).toBeGreaterThan(0);

      const names = ctas.map((cta) => cta.getAttribute('aria-label') ?? '');
      for (const cta of ctas) {
        const visible = (cta.textContent ?? '').trim();
        const name = cta.getAttribute('aria-label') ?? '';
        expect(name).withContext(`visible "${visible}" not in name "${name}"`).toContain(visible);
      }
      expect(new Set(names).size).toBe(names.length);
    });
  });

  it('keeps the external-link arrow inline with its label', () => {
    // The svg reset sets `display: block`, which dropped the arrow onto its
    // own line under "View Site" and made .link-icon's vertical-align a no-op.
    const icons = Array.from(
      fixture.nativeElement.querySelectorAll('.project-card__links .link-icon'),
    ) as SVGElement[];
    expect(icons.length).toBeGreaterThan(0);

    for (const icon of icons) {
      // Inside a flex CTA the icon is blockified but still sits on the label's
      // line, so the check is layout: the arrow shares a row with the label.
      const parentDisplay = getComputedStyle(icon.parentElement as HTMLElement).display;
      const inFlexRow = parentDisplay.includes('flex');
      expect(inFlexRow || getComputedStyle(icon).display !== 'block')
        .withContext('a block-level arrow outside a flex row breaks onto its own line')
        .toBeTrue();
    }
  });
});
