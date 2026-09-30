import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lays the About card out at the specified 900px width', () => {
    // Had drifted to 1030px.
    const container = fixture.nativeElement.querySelector('.about-container') as HTMLElement;
    expect(container).toBeTruthy();
    expect(getComputedStyle(container).maxWidth).toBe('900px');
  });
});
