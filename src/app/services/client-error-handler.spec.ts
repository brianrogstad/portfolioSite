import { DOCUMENT, ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { appConfig } from '../app.config';
import { ClientErrorHandler } from './client-error-handler';

describe('ClientErrorHandler', () => {
  let gtag: jasmine.Spy;
  let win: { gtag?: jasmine.Spy };

  function build(withGtag: boolean): ClientErrorHandler {
    gtag = jasmine.createSpy('gtag');
    win = withGtag ? { gtag } : {};
    TestBed.configureTestingModule({
      providers: [ClientErrorHandler, { provide: DOCUMENT, useValue: { defaultView: win } }],
    });
    return TestBed.inject(ClientErrorHandler);
  }

  beforeEach(() => spyOn(console, 'error'));

  it('reports an unhandled error to GA4 as a non-fatal exception and still logs it', () => {
    const handler = build(true);
    handler.handleError(new TypeError('boom at card'));

    expect(gtag).toHaveBeenCalledOnceWith('event', 'exception', {
      description: 'TypeError: boom at card',
      fatal: false,
    });
    expect(console.error).toHaveBeenCalled();
  });

  it('unwraps a rejected promise reason and truncates long descriptions', () => {
    const handler = build(true);
    handler.handleError({ rejection: new Error('x'.repeat(300)) });

    const payload = gtag.calls.mostRecent().args[2];
    expect(payload.description.startsWith('Error: xxx')).toBeTrue();
    expect(payload.description.length).toBe(150);
  });

  it('describes a non-Error throw', () => {
    const handler = build(true);
    handler.handleError('plain string');

    expect(gtag.calls.mostRecent().args[2].description).toBe('plain string');
  });

  it('still logs when gtag is absent (SSR, blocked script)', () => {
    const handler = build(false);
    expect(() => handler.handleError(new Error('no tag'))).not.toThrow();
    expect(console.error).toHaveBeenCalled();
  });

  it('never lets a failing gtag call throw back out of the handler', () => {
    const handler = build(true);
    gtag.and.throwError('gtag broke');
    expect(() => handler.handleError(new Error('first'))).not.toThrow();
  });

  it('is the ErrorHandler the app provides', () => {
    const provider = appConfig.providers.find(
      (p) => typeof p === 'object' && p !== null && 'provide' in p && p.provide === ErrorHandler,
    ) as { useClass?: unknown } | undefined;
    expect(provider?.useClass).toBe(ClientErrorHandler);
  });
});
