import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { RouteFocusService } from './route-focus.service';

describe('RouteFocusService', () => {
  let events$: Subject<NavigationEnd | NavigationStart>;
  let main: HTMLElement;
  let navLink: HTMLAnchorElement;

  function buildPage(withHeading: boolean) {
    navLink = document.createElement('a');
    navLink.href = '/about';
    navLink.textContent = 'About';
    document.body.appendChild(navLink);

    main = document.createElement('main');
    main.id = 'main-content';
    if (withHeading) {
      const h1 = document.createElement('h1');
      h1.textContent = 'About Me';
      main.appendChild(h1);
    }
    document.body.appendChild(main);
  }

  beforeEach(() => {
    events$ = new Subject();
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { events: events$.asObservable() } },
        { provide: DOCUMENT, useValue: document },
      ],
    });
  });

  afterEach(() => {
    navLink?.remove();
    main?.remove();
  });

  /** The first NavigationEnd is the initial load and is deliberately ignored. */
  function navigate(url: string) {
    events$.next(new NavigationEnd(1, url, url));
  }

  it('leaves focus alone on the initial navigation', () => {
    buildPage(true);
    TestBed.inject(RouteFocusService).start();
    navLink.focus();

    navigate('/');

    expect(document.activeElement).toBe(navLink);
  });

  it('moves focus off the nav link and onto the new view heading', () => {
    buildPage(true);
    const service = TestBed.inject(RouteFocusService);
    service.start();
    navigate('/');

    navLink.focus();
    expect(document.activeElement).toBe(navLink);

    navigate('/about');

    const heading = main.querySelector('h1') as HTMLElement;
    expect(document.activeElement).toBe(heading);
    expect(document.activeElement).not.toBe(navLink);
  });

  it('exposes the view context through the focused heading', () => {
    buildPage(true);
    const service = TestBed.inject(RouteFocusService);
    service.start();
    navigate('/');

    navigate('/about');

    expect((document.activeElement as HTMLElement).textContent).toBe('About Me');
  });

  it('makes the target focusable without putting it in the tab order', () => {
    buildPage(true);
    const service = TestBed.inject(RouteFocusService);
    service.start();
    navigate('/');

    navigate('/about');

    expect((document.activeElement as HTMLElement).getAttribute('tabindex')).toBe('-1');
  });

  it('falls back to the main landmark when the view has no h1', () => {
    buildPage(false);
    const service = TestBed.inject(RouteFocusService);
    service.start();
    navigate('/');

    navigate('/about');

    expect(document.activeElement).toBe(main);
  });

  it('ignores navigations that have not completed', () => {
    buildPage(true);
    const service = TestBed.inject(RouteFocusService);
    service.start();
    navigate('/');
    navLink.focus();

    events$.next(new NavigationStart(2, '/about'));

    expect(document.activeElement).toBe(navLink);
  });
});
