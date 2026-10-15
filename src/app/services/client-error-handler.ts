import { DOCUMENT, ErrorHandler, Injectable, inject } from '@angular/core';

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

const MAX_DESCRIPTION = 150;

/**
 * Surfaces unhandled client errors instead of letting them fail silently in
 * front of a visitor. Each one still goes to the console (Angular's default),
 * and is also sent to the GA4 property the page already loads as a non-fatal
 * `exception` event, so no new third-party script or disclosure is needed.
 */
@Injectable()
export class ClientErrorHandler extends ErrorHandler {
  private readonly document = inject(DOCUMENT);

  override handleError(error: unknown): void {
    super.handleError(error);
    const gtag = (this.document.defaultView as GtagWindow | null)?.gtag;
    if (typeof gtag !== 'function') return;
    try {
      gtag('event', 'exception', { description: describe(error), fatal: false });
    } catch {
      // Reporting must never throw back into Angular's error path.
    }
  }
}

function describe(error: unknown): string {
  const reason =
    error && typeof error === 'object' && 'rejection' in error
      ? (error as { rejection: unknown }).rejection
      : error;
  const text = reason instanceof Error ? `${reason.name}: ${reason.message}` : String(reason);
  return text.slice(0, MAX_DESCRIPTION);
}
