import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotFoundComponent } from './not-found.component';
import { SeoService } from '../../services/seo.service';

describe('NotFoundComponent', () => {
  let seoUpdate: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [provideRouter([])],
    });
    seoUpdate = spyOn(TestBed.inject(SeoService), 'update');
  });

  it('tells the visitor the page is missing and links them home', () => {
    const fixture = TestBed.createComponent(NotFoundComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('h1')?.textContent?.trim()).toBe('Page Not Found');
    expect(el.textContent).toContain("The page you were looking for isn't here.");
    expect(el.querySelector('a')?.getAttribute('href')).toBe('/');
    expect(el.querySelector('a')?.textContent?.trim()).toBe('Return Home');
  });

  it('marks the page as not found for search and sharing', () => {
    TestBed.createComponent(NotFoundComponent);
    expect(seoUpdate).toHaveBeenCalledWith(
      jasmine.objectContaining({ title: 'Page Not Found — Brian Rogstad', path: '/404' }),
    );
  });
});
