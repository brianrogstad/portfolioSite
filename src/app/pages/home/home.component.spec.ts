import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps the external-link arrow inline with its label', () => {
    // The svg reset sets `display: block`, which dropped the arrow onto its
    // own line under "View Site" and made .link-icon's vertical-align a no-op.
    const icons = Array.from(
      fixture.nativeElement.querySelectorAll('.project-card__links .link-icon'),
    ) as SVGElement[];
    expect(icons.length).toBeGreaterThan(0);

    for (const icon of icons) {
      expect(getComputedStyle(icon).display)
        .withContext('a block-level arrow breaks onto its own line')
        .not.toBe('block');
    }
  });
});
