import { TestBed } from '@angular/core/testing';
import { ContactCtaComponent } from './contact-cta.component';

describe('ContactCtaComponent', () => {
  it('renders a mailto action with an accessible name', () => {
    const fixture = TestBed.createComponent(ContactCtaComponent);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a[href^="mailto:"]') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('mailto:brianrogstad@gmail.com');
    expect(link.textContent).toContain('Email Brian');
    // Styled as an action rather than footnote text — see _contact-cta.scss.
    expect(link.classList).toContain('email-cta');
  });

  it('names the section landmark from its heading', () => {
    const fixture = TestBed.createComponent(ContactCtaComponent);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section') as HTMLElement;
    const headingId = section.getAttribute('aria-labelledby');
    expect(headingId).toBe('contact-cta-heading');
    expect(fixture.nativeElement.querySelector(`#${headingId}`)?.textContent).toContain(
      'Get in touch',
    );
  });

  it('takes a per-page lead line', () => {
    const fixture = TestBed.createComponent(ContactCtaComponent);
    fixture.componentRef.setInput('lead', 'A page-specific ask.');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('A page-specific ask.');
  });
});
