import { DestroyRef, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

/** The subset of gtag.js this app calls. Installed by the snippet in index.html. */
type GtagFn = (command: 'event', eventName: string, params?: Record<string, unknown>) => void;

type GtagWindow = Window & { gtag?: GtagFn };

/**
 * Bridges Angular routing to GA4.
 *
 * The gtag snippet in index.html reports the initial document load and
 * nothing else, which is correct for a static site and silently insufficient
 * for an SPA: every in-app navigation, including every `projects/:id` page,
 * went unrecorded. That made "project detail visits" unanswerable from the
 * collected data, and it failed quietly, showing as low engagement rather
 * than as missing instrumentation.
 *
 * Lives in a service rather than inline in AppComponent so the behavior can
 * be tested against a stubbed Router.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject<object>(PLATFORM_ID);

  private started = false;

  /**
   * Starts reporting a `page_view` per completed navigation. Safe to call
   * more than once; only the first call subscribes. No-op during server
   * rendering, where there is no gtag and no browsing session.
   */
  start(): void {
    if (this.started || !isPlatformBrowser(this.platformId)) return;
    this.started = true;

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => this.trackPageView(event.urlAfterRedirects));
  }

  /**
   * Sends one GA4 `page_view`. Does nothing when gtag is absent, which is the
   * normal state when an ad blocker or the analytics opt-out is in play.
   */
  trackPageView(path: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const win = window as GtagWindow;
    if (typeof win.gtag !== 'function') return;

    win.gtag('event', 'page_view', {
      page_path: path,
      page_location: win.location?.href,
      page_title: this.title.getTitle(),
    });
  }
}
