import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lays the About card out at the specified 900px width', () => {
    // Had drifted to 1030px.
    const container = fixture.nativeElement.querySelector('.about-container') as HTMLElement;
    expect(container).toBeTruthy();
    expect(getComputedStyle(container).maxWidth).toBe('900px');
  });

  it('reserves the profile image at its real portrait aspect ratio', () => {
    // Declared 538x368 (landscape) for a 3:4 portrait file, so the
    // description shifted down once the image decoded (CLS 0.112).
    const img = fixture.nativeElement.querySelector('img.project-img') as HTMLImageElement;
    const width = Number(img.getAttribute('width'));
    const height = Number(img.getAttribute('height'));
    expect(height).toBeGreaterThan(width);
    expect(width / height).toBeCloseTo(896 / 1200, 2);
  });

  it('keeps the LCP profile image eager and high priority with async decoding', () => {
    // Commit 3638126 switched the image to eager + fetchpriority=high for LCP
    // and dropped the decoding="async" hint shipped in c08de21 (UNW-1327).
    const img = fixture.nativeElement.querySelector('img.project-img') as HTMLImageElement;
    expect(img.getAttribute('loading')).toBe('eager');
    expect(img.getAttribute('fetchpriority')).toBe('high');
    expect(img.getAttribute('decoding')).toBe('async');
  });

  it('points at each destination once', () => {
    // "Connect On LinkedIn" in the bio and "Connect with me on LinkedIn" in
    // the Connect list resolved to the same profile under two labels, so a
    // visitor could not tell whether they differed.
    const hrefs = (
      Array.from(fixture.nativeElement.querySelectorAll('a[href]')) as HTMLAnchorElement[]
    ).map((a) => a.getAttribute('href'));

    const duplicates = hrefs.filter((href, i) => hrefs.indexOf(href) !== i);
    expect(duplicates).withContext(`duplicated destinations: ${duplicates}`).toEqual([]);
  });

  describe('canonical URL', () => {
    // The About page used to ship the homepage canonical, telling crawlers a
    // distinct, indexable page was a duplicate of "/".
    it('self-references the About page, not the homepage', () => {
      const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

      expect(canonical).withContext('no canonical link emitted').toBeTruthy();
      expect(canonical?.getAttribute('href')).toBe('https://brianrogstad.com/about/');
      expect(canonical?.getAttribute('href')).not.toBe('https://brianrogstad.com/');
    });

    it('matches the og:url form, so both name one public URL', () => {
      const canonical = document
        .querySelector<HTMLLinkElement>('link[rel="canonical"]')
        ?.getAttribute('href');
      const ogUrl = document
        .querySelector<HTMLMetaElement>('meta[property="og:url"]')
        ?.getAttribute('content');

      expect(ogUrl).toBe(canonical);
    });
  });
});
