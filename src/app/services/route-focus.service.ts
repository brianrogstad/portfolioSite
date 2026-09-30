import { DestroyRef, DOCUMENT, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Moves focus to the new view after a client-side navigation.
 *
 * Activating a nav link left `document.activeElement` on that same header
 * anchor while the whole main view changed underneath it, so keyboard and
 * screen-reader users got no cue that anything happened and had to rediscover
 * the page from the persistent navigation (WCAG 2.4.3).
 *
 * Focus lands on the destination's `<h1>` where there is one, so the heading
 * text announces the view; otherwise on the main landmark. Neither is added to
 * the tab order: they take `tabindex="-1"`, which makes them programmatically
 * focusable only.
 */
@Injectable({ providedIn: 'root' })
export class RouteFocusService {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject<object>(PLATFORM_ID);

  private started = false;
  /** The first NavigationEnd is the initial page load; focus belongs at the top of the document. */
  private isInitialNavigation = true;

  start(): void {
    if (this.started || !isPlatformBrowser(this.platformId)) return;
    this.started = true;

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        if (this.isInitialNavigation) {
          this.isInitialNavigation = false;
          return;
        }
        this.focusDestination();
      });
  }

  /**
   * Focuses the destination heading or main landmark. Exposed so the caller
   * can drive it directly in tests and so a future in-page navigation can
   * reuse it.
   */
  focusDestination(): void {
    const main = this.document.querySelector<HTMLElement>('#main-content');
    const target = main?.querySelector<HTMLElement>('h1') ?? main;
    if (!target) return;

    // Programmatically focusable, but never a tab stop.
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }
    // The router already restores scroll to the top of the new route; focusing
    // without scrolling avoids fighting it.
    target.focus({ preventScroll: true });
  }
}
