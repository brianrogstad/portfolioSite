import {
  Injectable,
  inject,
  PendingTasks,
  PLATFORM_ID,
  TransferState,
  makeStateKey,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { ProjectDetail, HomeCardSection, HomeCardsManifest } from '../models/project.model';

// Home cards stay statically imported — small file, needed on first paint
// for the home page, and used to drive project-detail breadcrumbs/prev-next.
import homeCardsData from '../data/home-cards.json';

// Dynamic-import loaders, one per project JSON. Each import() becomes its
// own lazy-loaded chunk at build time, so none of these are shipped in the
// initial bundle — they're fetched on demand when a user navigates to the
// corresponding /projects/:id route.
//
// Module-level so PROJECT_IDS below can be read without instantiating the
// service — app.routes.server.ts needs the id list at build time to prerender
// every project page.
const PROJECT_LOADERS: Record<string, () => Promise<ProjectDetail>> = {
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

/**
 * Every routed project id, derived from the loader map above so a project
 * added there is prerendered without a further code change.
 */
export const PROJECT_IDS: readonly string[] = Object.freeze(Object.keys(PROJECT_LOADERS).sort());

const projectKey = (id: string) => makeStateKey<ProjectDetail>(`project:${id}`);

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private loaders = PROJECT_LOADERS;

  // In-memory cache — re-visiting a project after back-nav shouldn't re-fetch.
  private cache = new Map<string, ProjectDetail>();

  private homeCards: HomeCardsManifest = homeCardsData as HomeCardsManifest;

  private transferState = inject(TransferState);
  private pendingTasks = inject(PendingTasks);
  private isServer = isPlatformServer(inject(PLATFORM_ID));

  async getProject(id: string): Promise<ProjectDetail | undefined> {
    const cached = this.peek(id);
    if (cached) return cached;
    const loader = this.loaders[id];
    if (!loader) return undefined;
    // The app is zoneless, so nothing else tells server rendering to wait
    // for this import; without the pending task the page would serialize
    // in its loading state.
    const done = this.pendingTasks.add();
    let data: ProjectDetail;
    try {
      data = await loader();
    } finally {
      done();
    }
    this.cache.set(id, data);
    // Ship the data inside the prerendered page, so the browser can hydrate
    // the project synchronously instead of clearing the server-rendered DOM
    // and repainting it after its own import() resolves (which is what made
    // the lead image the late LCP on every project page).
    if (this.isServer) this.transferState.set(projectKey(id), data);
    return data;
  }

  /** Project data available right now (memory cache or transferred from the server), if any. */
  peek(id: string): ProjectDetail | undefined {
    const cached = this.cache.get(id);
    if (cached) return cached;
    const transferred = this.transferState.get(projectKey(id), undefined);
    if (transferred) {
      this.cache.set(id, transferred);
      return transferred;
    }
    return undefined;
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
    title?: string;
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
      title: routed[idx].title,
    };
  }
}
