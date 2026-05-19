import { Injectable, inject, PLATFORM_ID, DOCUMENT } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  /** Path only, e.g. '/about' or '/projects/version-seven'. */
  path: string;
  /** Absolute or root-relative image URL. Defaults to the site-wide OG image. */
  image?: string;
  /** Open Graph type. Defaults to 'website'. */
  type?: 'website' | 'article' | 'profile';
}

/**
 * SeoService updates per-route meta tags, title, and canonical URL as the user
 * navigates the SPA. The static tags in index.html cover the initial crawl
 * (LinkedIn, Slack, X) since the site is deployed as a SPA to GitHub Pages.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject<object>(PLATFORM_ID);

  private readonly origin = 'https://brianrogstad.com';
  private readonly defaultImage = `${this.origin}/images/ProfileImg.png`;

  update(config: SeoConfig): void {
    const url = this.origin + (config.path.startsWith('/') ? config.path : `/${config.path}`);
    let image: string;
    if (!config.image) {
      image = this.defaultImage;
    } else if (config.image.startsWith('http')) {
      image = config.image;
    } else {
      const separator = config.image.startsWith('/') ? '' : '/';
      image = `${this.origin}${separator}${config.image}`;
    }
    const type = config.type ?? 'website';

    this.titleService.setTitle(config.title);

    this.meta.updateTag({ name: 'description', content: config.description });

    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:type', content: type });

    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setCanonical(url);
  }

  private setCanonical(url: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
