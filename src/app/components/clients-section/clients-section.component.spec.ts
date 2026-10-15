import { TestBed } from '@angular/core/testing';
import { ClientsSectionComponent } from './clients-section.component';

describe('ClientsSectionComponent', () => {
  const render = (lazy: boolean) => {
    const fixture = TestBed.createComponent(ClientsSectionComponent);
    fixture.componentRef.setInput('lazy', lazy);
    fixture.detectChanges();
    return fixture;
  };

  it('renders one linked, described logo per client', () => {
    const fixture = render(false);
    const component = fixture.componentInstance;
    const items = Array.from(
      fixture.nativeElement.querySelectorAll('.clients li'),
    ) as HTMLLIElement[];

    expect(items.length).toBe(component.clients.length);
    items.forEach((li, i) => {
      const client = component.clients[i];
      const a = li.querySelector('a') as HTMLAnchorElement;
      const img = li.querySelector('img') as HTMLImageElement;
      expect(a.getAttribute('href')).withContext(client.title).toBe(client.href);
      expect(a.rel).withContext(client.title).toContain('noopener');
      expect(img.getAttribute('src')).withContext(client.title).toBe(client.src);
      expect(img.alt).withContext(client.title).toBe(client.alt);
      expect(img.alt.trim()).withContext(client.title).not.toBe('');
    });
  });

  it('lazy-loads the logos only when asked to', () => {
    const eager = render(false).nativeElement.querySelector('img') as HTMLImageElement;
    expect(eager.getAttribute('loading')).toBeNull();

    const lazy = render(true).nativeElement.querySelector('img') as HTMLImageElement;
    expect(lazy.getAttribute('loading')).toBe('lazy');
    expect(lazy.getAttribute('decoding')).toBe('async');
  });
});
