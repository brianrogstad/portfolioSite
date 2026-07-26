import { TestBed } from '@angular/core/testing';
import { ConnectSectionComponent } from './connect-section.component';

describe('ConnectSectionComponent', () => {
  it('gives the complementary landmark a distinguishing accessible name', () => {
    const fixture = TestBed.createComponent(ConnectSectionComponent);
    fixture.detectChanges();

    const aside = fixture.nativeElement.querySelector('aside') as HTMLElement;
    expect(aside.getAttribute('aria-label')).toBe('Get in touch');
  });
});
