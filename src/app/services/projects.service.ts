import { Injectable } from '@angular/core';
import { ProjectDetail, HomeCardSection, HomeCardsManifest } from '../models/project.model';

// Home cards stay statically imported — small file, needed on first paint
// for the home page, and used to drive project-detail breadcrumbs/prev-next.
import homeCardsData from '../data/home-cards.json';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  // Dynamic-import loaders, one per project JSON. Each import() becomes its
  // own lazy-loaded chunk at build time, so none of these are shipped in the
  // initial bundle — they're fetched on demand when a user navigates to the
  // corresponding /projects/:id route.
  private loaders: Record<string, () => Promise<ProjectDetail>> = {
    'ana-journal': () => import('../data/ana-journal.json').then((m) => m.default as ProjectDetail),
    admin: () => import('../data/admin.json').then((m) => m.default as ProjectDetail),
    bpm: () => import('../data/bpm.json').then((m) => m.default as ProjectDetail),
    contact: () => import('../data/contact.json').then((m) => m.default as ProjectDetail),
    earth: () => import('../data/earth.json').then((m) => m.default as ProjectDetail),
    emails: () => import('../data/emails.json').then((m) => m.default as ProjectDetail),
    findlaw: () => import('../data/findlaw.json').then((m) => m.default as ProjectDetail),
    legal: () => import('../data/legal.json').then((m) => m.default as ProjectDetail),
    life: () => import('../data/life.json').then((m) => m.default as ProjectDetail),
    logo: () => import('../data/logo.json').then((m) => m.default as ProjectDetail),
    mobile: () => import('../data/mobile.json').then((m) => m.default as ProjectDetail),
    model: () => import('../data/model.json').then((m) => m.default as ProjectDetail),
    proto: () => import('../data/proto.json').then((m) => m.default as ProjectDetail),
    reference: () => import('../data/reference.json').then((m) => m.default as ProjectDetail),
    reflow: () => import('../data/reflow.json').then((m) => m.default as ProjectDetail),
    rough: () => import('../data/rough.json').then((m) => m.default as ProjectDetail),
    tremor: () => import('../data/tremor.json').then((m) => m.default as ProjectDetail),
    'tremor-maps': () => import('../data/tremor-maps.json').then((m) => m.default as ProjectDetail),
    'tremor-system': () =>
      import('../data/tremor-system.json').then((m) => m.default as ProjectDetail),
    usb: () => import('../data/usb.json').then((m) => m.default as ProjectDetail),
    'usb-maps': () => import('../data/usb-maps.json').then((m) => m.default as ProjectDetail),
    'usb-system': () => import('../data/usb-system.json').then((m) => m.default as ProjectDetail),
    'usb-wireframes': () =>
      import('../data/usb-wireframes.json').then((m) => m.default as ProjectDetail),
    utility: () => import('../data/utility.json').then((m) => m.default as ProjectDetail),
    'version-seven': () =>
      import('../data/version-seven.json').then((m) => m.default as ProjectDetail),
  };

  // In-memory cache — re-visiting a project after back-nav shouldn't re-fetch.
  private cache = new Map<string, ProjectDetail>();

  private homeCards: HomeCardsManifest = homeCardsData as HomeCardsManifest;

  async getProject(id: string): Promise<ProjectDetail | undefined> {
    const cached = this.cache.get(id);
    if (cached) return cached;
    const loader = this.loaders[id];
    if (!loader) return undefined;
    const data = await loader();
    this.cache.set(id, data);
    return data;
  }

  getHomeCardSections(): HomeCardSection[] {
    return this.homeCards.sections;
  }

  /**
   * Flattens the home cards manifest into the ordered sequence of routed
   * project pages (skipping externals like League Index) and returns the
   * neighbours for the current project plus the section it belongs to.
   * Used by project-detail for breadcrumbs and prev/next navigation.
   */
  getProjectNav(id: string): {
    prev?: { id: string; title: string };
    next?: { id: string; title: string };
    section?: string;
  } {
    const routed: { id: string; title: string; section: string }[] = [];
    for (const section of this.homeCards.sections) {
      for (const card of section.cards) {
        if (card.primaryLink.type !== 'route') continue;
        const targetId = card.primaryLink.target.replace(/^\/projects\//, '');
        routed.push({ id: targetId, title: card.title, section: section.heading });
      }
    }
    const idx = routed.findIndex((c) => c.id === id);
    if (idx === -1) return {};
    return {
      prev: idx > 0 ? { id: routed[idx - 1].id, title: routed[idx - 1].title } : undefined,
      next:
        idx < routed.length - 1
          ? { id: routed[idx + 1].id, title: routed[idx + 1].title }
          : undefined,
      section: routed[idx].section,
    };
  }
}
