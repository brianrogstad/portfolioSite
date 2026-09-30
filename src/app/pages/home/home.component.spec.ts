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
});
