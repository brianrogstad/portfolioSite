import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the site name in the header', () => {
    // Note: AppComponent no longer owns an <h1>. Per UNW-192, h1s moved
    // into per-page components for accessibility. AppComponent's chrome
    // exposes the brand via `.site-name` in the header.
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.site-name')?.textContent).toContain('Brian Rogstad');
  });

  describe('footer copyright yearRange', () => {
    function renderFooter(startYear: number, currentYear: number): string {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.componentInstance.startYear = startYear;
      fixture.componentInstance.currentYear = currentYear;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      return compiled.querySelector('.disclaimer')?.textContent ?? '';
    }

    it('renders a single year when start and current years are equal', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.componentInstance.startYear = 2026;
      fixture.componentInstance.currentYear = 2026;
      expect(fixture.componentInstance.yearRange).toBe('2026');
      expect(renderFooter(2026, 2026)).toContain('Brian Rogstad 2026.');
    });

    it('renders the start-current range when the years differ', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.componentInstance.startYear = 2009;
      fixture.componentInstance.currentYear = 2026;
      expect(fixture.componentInstance.yearRange).toBe('2009-2026');
      expect(renderFooter(2009, 2026)).toContain('Brian Rogstad 2009-2026.');
    });
  });

  describe('primary navigation semantics', () => {
    // The nav declared role="menu"/"menuitem" but implemented only Escape,
    // promising an application-menu keyboard model it never had (WCAG 2.1.1,
    // 4.1.2). It is ordinary site navigation, so it keeps native list and
    // link semantics and exposes a disclosure instead.
    it('declares no application-menu roles', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelectorAll('[role="menu"]').length).toBe(0);
      expect(compiled.querySelectorAll('[role="menuitem"]').length).toBe(0);
      expect(compiled.querySelectorAll('[aria-haspopup]').length).toBe(0);
    });

    it('exposes each dropdown as a disclosure pointing at the list it controls', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      const toggles = Array.from(
        compiled.querySelectorAll('.dropdown-toggle'),
      ) as HTMLButtonElement[];
      expect(toggles.length).toBeGreaterThan(0);

      for (const toggle of toggles) {
        expect(toggle.getAttribute('aria-expanded')).toBe('false');
        const controls = toggle.getAttribute('aria-controls');
        expect(controls).toBeTruthy();
        expect(compiled.querySelector(`#${controls}`))
          .withContext(`no element with id ${controls}`)
          .toBeTruthy();
      }
    });

    it('keeps dropdown links in the natural tab order as plain links', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      const links = Array.from(compiled.querySelectorAll('.dropdown-menu a')) as HTMLElement[];
      expect(links.length).toBeGreaterThan(0);
      for (const link of links) {
        expect(link.getAttribute('tabindex')).toBeNull();
        expect(link.getAttribute('role')).toBeNull();
      }
    });

    it('reflects the open dropdown in aria-expanded', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      const dropdown = compiled.querySelector('.dropdown') as HTMLElement;
      const toggle = dropdown.querySelector('.dropdown-toggle') as HTMLButtonElement;

      // Through the real event binding, so OnPush sees the change.
      dropdown.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      fixture.detectChanges();

      expect(toggle.getAttribute('aria-expanded')).toBe('true');
    });
  });
});
