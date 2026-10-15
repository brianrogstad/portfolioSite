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

  it('offers the header logo WebP sibling with the PNG fallback and accessible name', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const logo = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="site-logo"]');
    const source = logo?.querySelector('picture > source[type="image/webp"]');
    const img = logo?.querySelector('picture > img');
    expect(source?.getAttribute('srcset')).toBe('/images/brianrogstad-logo-inverse.webp');
    expect(img?.getAttribute('src')).toBe('/images/brianrogstad-logo-inverse.png');
    expect(img?.getAttribute('alt')).toBe('BrianRogstad.com');
    expect(logo?.getAttribute('aria-label')).toBe('BrianRogstad.com — Home');
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

  describe('footer analytics disclosure', () => {
    it('discloses Google Analytics and links the disclosure to the privacy notice', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const note = compiled.querySelector('.site-footer [data-testid="analytics-disclosure"]');
      expect(note?.textContent).toContain('This site uses Google Analytics');
      expect(note?.querySelector('a')?.getAttribute('href')).toBe('/privacy');
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

  describe('mobile menu', () => {
    it('opens and closes from its toggle buttons, mirrored in aria-expanded', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const open = compiled.querySelector('button.open-menu') as HTMLButtonElement;
      const close = compiled.querySelector('button.close-menu') as HTMLButtonElement;

      open.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.mobileMenuOpen).toBeTrue();
      expect(open.getAttribute('aria-expanded')).toBe('true');

      close.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.mobileMenuOpen).toBeFalse();
      expect(close.getAttribute('aria-expanded')).toBe('false');
    });

    it('closes when one of its links is followed', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      fixture.componentInstance.mobileMenuOpen = true;
      const link = (fixture.nativeElement as HTMLElement).querySelector(
        '#mobile-menu a',
      ) as HTMLAnchorElement;
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      expect(fixture.componentInstance.mobileMenuOpen).toBeFalse();
    });

    it('closes on resize past the desktop breakpoint, and stays open below it', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      const width = spyOnProperty(window, 'innerWidth');

      app.mobileMenuOpen = true;
      width.and.returnValue(800);
      window.dispatchEvent(new Event('resize'));
      expect(app.mobileMenuOpen).toBeTrue();

      width.and.returnValue(1400);
      window.dispatchEvent(new Event('resize'));
      expect(app.mobileMenuOpen).toBeFalse();
    });
  });

  describe('desktop dropdowns', () => {
    const setup = () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const dropdown = compiled.querySelector('.dropdown') as HTMLElement;
      const toggle = dropdown.querySelector('.dropdown-toggle') as HTMLButtonElement;
      return { fixture, app: fixture.componentInstance, compiled, dropdown, toggle };
    };

    it('slugs each label into a stable id', () => {
      const { app } = setup();
      expect(app.dropdownId('Client & Agency Work')).toBe('nav-dropdown-client-agency-work');
      expect(app.dropdownId('  My Projects! ')).toBe('nav-dropdown-my-projects');
    });

    it('opens on hover and closes on mouseleave', () => {
      const { app, dropdown } = setup();
      dropdown.dispatchEvent(new MouseEvent('mouseenter'));
      expect(app.openDropdownLabel).toBe(app.navItems.find((i) => i.children)!.label);
      dropdown.dispatchEvent(new MouseEvent('mouseleave'));
      expect(app.openDropdownLabel).toBeNull();
    });

    it('stays open while focus moves inside it and closes when focus leaves', () => {
      const { app, dropdown, compiled } = setup();
      dropdown.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      const inner = dropdown.querySelector('.dropdown-menu a') as HTMLElement;

      dropdown.dispatchEvent(new FocusEvent('focusout', { relatedTarget: inner }));
      expect(app.openDropdownLabel).not.toBeNull();

      const outside = compiled.querySelector('.site-name') as HTMLElement;
      dropdown.dispatchEvent(new FocusEvent('focusout', { relatedTarget: outside }));
      expect(app.openDropdownLabel).toBeNull();

      app.openDropdownLabel = 'x';
      dropdown.dispatchEvent(new FocusEvent('focusout', { relatedTarget: null }));
      expect(app.openDropdownLabel).toBeNull();
    });

    it('closes on Escape, returns focus to its toggle, and ignores other keys', () => {
      const { app, dropdown, toggle } = setup();
      const label = app.navItems.find((i) => i.children)!.label;
      app.openDropdown(label);
      const inner = dropdown.querySelector('.dropdown-menu a') as HTMLElement;
      // The desktop nav may be display:none at the runner's viewport, so spy
      // on focus() rather than reading document.activeElement.
      const focus = spyOn(toggle, 'focus');

      inner.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
      expect(app.openDropdownLabel).toBe(label);

      inner.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      );
      expect(app.openDropdownLabel).toBeNull();
      expect(app.forceClosedDropdown).toBe(label);
      expect(focus).toHaveBeenCalled();
    });

    it('closes and blurs the focused element when a dropdown link is followed', () => {
      const { app, dropdown } = setup();
      app.openDropdown('x');
      const inner = dropdown.querySelector('.dropdown-menu a') as HTMLAnchorElement;
      const active = document.activeElement as HTMLElement;
      const blur = spyOn(active, 'blur');
      inner.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      expect(app.openDropdownLabel).toBeNull();
      expect(blur).toHaveBeenCalled();
    });
  });
});
