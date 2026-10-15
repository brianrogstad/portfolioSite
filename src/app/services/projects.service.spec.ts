import { TestBed } from '@angular/core/testing';

import { ProjectsService } from './projects.service';
import { HomeCard, HomeCardsManifest, ProjectDetail } from '../models/project.model';

/** Test seam: the manifest and loader map are private fields. */
interface ProjectsServiceInternals {
  homeCards: HomeCardsManifest;
  loaders: Record<string, () => Promise<ProjectDetail>>;
}

const card = (id: string, title: string, type: 'route' | 'external' = 'route'): HomeCard => ({
  id,
  title,
  image: { src: `/images/${id}.jpg`, alt: title },
  tags: [],
  summary: '',
  primaryLink: { type, target: type === 'route' ? `/projects/${id}` : `https://${id}.example.com` },
  links: [],
});

const manifest: HomeCardsManifest = {
  sections: [
    {
      heading: 'My Projects',
      tone: 'light',
      cards: [
        card('alpha', 'Alpha'),
        card('league', 'League Index', 'external'),
        card('beta', 'Beta'),
      ],
    },
    {
      heading: 'Client Work',
      tone: 'dark',
      cards: [card('gamma', 'Gamma'), card('delta', 'Delta')],
    },
  ],
};

describe('ProjectsService', () => {
  let service: ProjectsService;
  let internals: ProjectsServiceInternals;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectsService);
    internals = service as unknown as ProjectsServiceInternals;
  });

  describe('getProjectNav', () => {
    beforeEach(() => {
      internals.homeCards = manifest;
    });

    it('skips external cards when linking neighbours', () => {
      // League Index sits between Alpha and Beta in the manifest.
      expect(service.getProjectNav('alpha').next).toEqual({ id: 'beta', title: 'Beta' });
      expect(service.getProjectNav('beta').prev).toEqual({ id: 'alpha', title: 'Alpha' });
      expect(service.getProjectNav('league')).toEqual({});
    });

    it('has no prev at the first routed card', () => {
      const nav = service.getProjectNav('alpha');
      expect(nav.prev).toBeUndefined();
      expect(nav.next).toEqual({ id: 'beta', title: 'Beta' });
    });

    it('has no next at the last routed card', () => {
      const nav = service.getProjectNav('delta');
      expect(nav.prev).toEqual({ id: 'gamma', title: 'Gamma' });
      expect(nav.next).toBeUndefined();
    });

    it('links across section boundaries', () => {
      const nav = service.getProjectNav('gamma');
      expect(nav.prev).toEqual({ id: 'beta', title: 'Beta' });
      expect(nav.next).toEqual({ id: 'delta', title: 'Delta' });
    });

    it('reports the owning section and card title', () => {
      expect(service.getProjectNav('beta').section).toBe('My Projects');
      expect(service.getProjectNav('gamma').section).toBe('Client Work');
      expect(service.getProjectNav('gamma').title).toBe('Gamma');
    });

    it('returns {} for an unknown id', () => {
      expect(service.getProjectNav('nope')).toEqual({});
    });
  });

  describe('getProject', () => {
    const project: ProjectDetail = { id: 'known', title: 'Known', category: 'UI Design' };
    let loader: jasmine.Spy<() => Promise<ProjectDetail>>;

    beforeEach(() => {
      loader = jasmine.createSpy('loader').and.resolveTo(project);
      internals.loaders = { known: loader };
    });

    it('resolves an unknown id to undefined', async () => {
      expect(await service.getProject('unknown')).toBeUndefined();
    });

    it('loads and returns a known project', async () => {
      expect(await service.getProject('known')).toEqual(project);
      expect(loader).toHaveBeenCalledTimes(1);
    });

    it('serves a second call from the cache without re-invoking the loader', async () => {
      const first = await service.getProject('known');
      const second = await service.getProject('known');
      expect(second).toBe(first!);
      expect(loader).toHaveBeenCalledTimes(1);
      expect(service.peek('known')).toBe(first!);
    });
  });
});
