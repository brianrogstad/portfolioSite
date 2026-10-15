import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AnalyticsService } from './analytics.service';

type GtagCall = [string, string, Record<string, unknown>?];

describe('AnalyticsService', () => {
  let events$: Subject<NavigationEnd | NavigationStart>;
  let calls: GtagCall[];
  let originalGtag: unknown;

  beforeEach(() => {
    events$ = new Subject();
    calls = [];
    originalGtag = (window as unknown as Record<string, unknown>)['gtag'];
    (window as unknown as Record<string, unknown>)['gtag'] = (...args: GtagCall) => {
      calls.push(args);
    };

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: { events: events$.asObservable() } }],
    });
    TestBed.inject(Title).setTitle('US Bancorp — Brian Rogstad');
  });

  afterEach(() => {
    (window as unknown as Record<string, unknown>)['gtag'] = originalGtag;
  });

  /** The bootstrap navigation, whose page_view gtag('config') in index.html already sent. */
  const initialLoad = () => events$.next(new NavigationEnd(1, '/', '/'));

  it('does not double-count the initial document load', () => {
    TestBed.inject(AnalyticsService).start();

    initialLoad();

    expect(calls.length).toBe(0);
  });

  it('reports a page_view for each completed in-app navigation', () => {
    TestBed.inject(AnalyticsService).start();

    initialLoad();
    events$.next(new NavigationEnd(2, '/projects/usb', '/projects/usb'));

    expect(calls.length).toBe(1);
    const [command, eventName, params] = calls[0];
    expect(command).toBe('event');
    expect(eventName).toBe('page_view');
    expect(params?.['page_path']).toBe('/projects/usb');
    expect(params?.['page_title']).toBe('US Bancorp — Brian Rogstad');
  });

  it('reports project detail routes as distinct pageviews', () => {
    TestBed.inject(AnalyticsService).start();

    initialLoad();
    events$.next(new NavigationEnd(2, '/projects/usb', '/projects/usb'));
    events$.next(new NavigationEnd(3, '/projects/tremor', '/projects/tremor'));
    events$.next(new NavigationEnd(4, '/', '/'));

    expect(calls.map((call) => call[2]?.['page_path'])).toEqual([
      '/projects/usb',
      '/projects/tremor',
      '/',
    ]);
  });

  it('uses the post-redirect url', () => {
    TestBed.inject(AnalyticsService).start();

    initialLoad();
    events$.next(new NavigationEnd(2, '/projects/usb', '/projects/usb/'));

    expect(calls[0][2]?.['page_path']).toBe('/projects/usb/');
  });

  it('ignores navigations that have not completed', () => {
    TestBed.inject(AnalyticsService).start();

    events$.next(new NavigationStart(1, '/about'));

    expect(calls.length).toBe(0);
  });

  it('only subscribes once however many times start is called', () => {
    const service = TestBed.inject(AnalyticsService);
    service.start();
    service.start();

    initialLoad();
    events$.next(new NavigationEnd(2, '/about', '/about'));

    expect(calls.length).toBe(1);
  });

  it('does nothing when gtag is absent', () => {
    delete (window as unknown as Record<string, unknown>)['gtag'];
    TestBed.inject(AnalyticsService).start();

    initialLoad();
    expect(() => events$.next(new NavigationEnd(2, '/about', '/about'))).not.toThrow();
  });
});
