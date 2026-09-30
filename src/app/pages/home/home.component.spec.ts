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

  it('gives the hero its visible identity line as the page h1', () => {
    const heading = fixture.nativeElement.querySelector('h1') as HTMLElement;

    expect(heading.textContent?.trim()).toBe('Brian Rogstad');
    expect(heading.classList).toContain('hero-intro__name');
    // It used to be sr-only, with a placeholder paragraph rendered in its place.
    expect(heading.classList).not.toContain('sr-only');
  });

  it('keeps placeholder text out of the top-of-fold hero copy', () => {
    const hero = fixture.nativeElement.querySelector('.hero-intro') as HTMLElement;

    expect(hero.textContent).not.toMatch(/I accept cookies/i);
    expect(hero.textContent).toContain('I design and build systems');
  });
});
