import { ApplicationConfig, ErrorHandler, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { ClientErrorHandler } from './services/client-error-handler';
import { provideClientHydration, withNoIncrementalHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    // Zoneless: every component is OnPush and marks itself for check, so
    // zone.js was only adding weight (its polyfill chunk plus the zone-aware
    // scheduler in main). Async work SSR must wait for goes through
    // PendingTasks (see ProjectsService.getProject).
    provideZonelessChangeDetection(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideClientHydration(withNoIncrementalHydration()),
    { provide: ErrorHandler, useClass: ClientErrorHandler },
  ],
};
