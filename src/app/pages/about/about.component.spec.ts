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
