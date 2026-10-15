import { TestBed } from '@angular/core/testing';
import { ConnectSectionComponent } from './connect-section.component';

describe('ConnectSectionComponent', () => {
  it('gives the complementary landmark a distinguishing accessible name', () => {
    const fixture = TestBed.createComponent(ConnectSectionComponent);
    fixture.detectChanges();

    const aside = fixture.nativeElement.querySelector('aside') as HTMLElement;
    expect(aside.getAttribute('aria-label')).toBe('Get in touch');
  });

  it('links each social profile in a new tab, safely, with a spoken name', () => {
    const fixture = TestBed.createComponent(ConnectSectionComponent);
    fixture.detectChanges();

    const links = Array.from(
      fixture.nativeElement.querySelectorAll('nav[aria-label="Social links"] a'),
    ) as HTMLAnchorElement[];
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      'https://github.com/brianrogstad',
      'https://x.com/B_Rogstad',
      'https://www.linkedin.com/in/brian-rogstad-06130b24',
      'https://codepen.io/brogstad/pens/public/',
    ]);
    for (const a of links) {
      expect(a.target).withContext(a.href).toBe('_blank');
      expect(a.rel).withContext(a.href).toContain('noopener');
      expect(a.textContent?.trim()).withContext(a.href).toBeTruthy();
    }
  });
});
