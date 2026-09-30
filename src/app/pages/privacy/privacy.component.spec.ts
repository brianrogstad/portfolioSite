import { TestBed } from '@angular/core/testing';
import { PrivacyComponent } from './privacy.component';

describe('PrivacyComponent', () => {
  it('discloses the Google Analytics measurement by name', () => {
    const fixture = TestBed.createComponent(PrivacyComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Google Analytics');
    expect(text).toContain('G-B0Y95T7EJM');
    expect(text).toContain('cookies');
  });

  it('tells visitors how to opt out', () => {
    const fixture = TestBed.createComponent(PrivacyComponent);
    fixture.detectChanges();

    const optOut = fixture.nativeElement.querySelector(
      'a[href^="https://tools.google.com/dlpage/gaoptout"]',
    );
    expect(optOut).toBeTruthy();
  });

  it('has exactly one h1', () => {
    const fixture = TestBed.createComponent(PrivacyComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('h1').length).toBe(1);
  });
});
