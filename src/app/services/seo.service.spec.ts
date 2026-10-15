import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { SeoConfig, SeoService } from './seo.service';

describe('SeoService.update', () => {
  const origin = 'https://brianrogstad.com';
  let service: SeoService;
  let meta: Meta;
  let doc: Document;

  const prop = (name: string) => meta.getTag(`property="${name}"`)?.content;
  const named = (name: string) => meta.getTag(`name="${name}"`)?.content;
  const canonical = () =>
    doc.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.getAttribute('href');

  const run = (overrides: Partial<SeoConfig> = {}) =>
    service.update({ title: 'T', description: 'D', path: '/about', ...overrides });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeoService);
    meta = TestBed.inject(Meta);
    doc = TestBed.inject(DOCUMENT);
    doc.querySelectorAll('link[rel="canonical"]').forEach((l) => l.remove());
  });

  afterEach(() => {
    doc.querySelectorAll('link[rel="canonical"]').forEach((l) => l.remove());
  });

  describe('path normalization', () => {
    it('adds a single leading slash to a bare path', () => {
      run({ path: 'projects/usb' });
      expect(prop('og:url')).toBe(`${origin}/projects/usb`);
      expect(canonical()).toBe(`${origin}/projects/usb`);
    });

    it('does not double an already-slashed path', () => {
      run({ path: '/projects/usb/' });
      expect(prop('og:url')).toBe(`${origin}/projects/usb/`);
      expect(canonical()).toBe(`${origin}/projects/usb/`);
    });

    it('reuses one canonical link across updates', () => {
      run({ path: '/a' });
      run({ path: '/b' });
      const links = doc.querySelectorAll('link[rel="canonical"]');
      expect(links.length).toBe(1);
      expect(links[0].getAttribute('href')).toBe(`${origin}/b`);
    });
  });

  describe('image resolution', () => {
    it('falls back to the default ProfileImg.png when no image is given', () => {
      run();
      expect(prop('og:image')).toBe(`${origin}/images/ProfileImg.png`);
      expect(named('twitter:image')).toBe(`${origin}/images/ProfileImg.png`);
    });

    it('passes an absolute http(s) image through unchanged', () => {
      run({ image: 'https://cdn.example.com/x.jpg' });
      expect(prop('og:image')).toBe('https://cdn.example.com/x.jpg');
      run({ image: 'http://cdn.example.com/y.png' });
      expect(prop('og:image')).toBe('http://cdn.example.com/y.png');
    });

    it('joins a root-relative image to origin with exactly one slash', () => {
      run({ image: '/images/a.jpg' });
      expect(prop('og:image')).toBe(`${origin}/images/a.jpg`);
      run({ image: 'images/b.jpg' });
      expect(prop('og:image')).toBe(`${origin}/images/b.jpg`);
      expect(named('twitter:image')).toBe(`${origin}/images/b.jpg`);
    });
  });

  describe('og:type', () => {
    it('defaults to website when type is omitted', () => {
      run();
      expect(prop('og:type')).toBe('website');
    });

    it('honors an explicit profile or article type', () => {
      run({ type: 'profile' });
      expect(prop('og:type')).toBe('profile');
      run({ type: 'article' });
      expect(prop('og:type')).toBe('article');
    });
  });

  it('writes title and description to the document, OG and twitter tags', () => {
    run({ title: 'About — Brian Rogstad', description: 'Designer and engineer.' });
    expect(TestBed.inject(Title).getTitle()).toBe('About — Brian Rogstad');
    expect(named('description')).toBe('Designer and engineer.');
    expect(prop('og:title')).toBe('About — Brian Rogstad');
    expect(prop('og:description')).toBe('Designer and engineer.');
    expect(named('twitter:title')).toBe('About — Brian Rogstad');
    expect(named('twitter:description')).toBe('Designer and engineer.');
  });
});
