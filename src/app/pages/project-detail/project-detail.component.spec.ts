import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { ProjectDetailComponent } from './project-detail.component';
import { ProjectsService } from '../../services/projects.service';
import { SeoService } from '../../services/seo.service';
import { ProjectDetail } from '../../models/project.model';
import { fallbackDescription } from './project-description';

describe('ProjectDetailComponent', () => {
  let component: ProjectDetailComponent;
  let fixture: ComponentFixture<ProjectDetailComponent>;
  let params$: BehaviorSubject<Params>;
  let getProjectSpy: jasmine.Spy;

  beforeEach(async () => {
    params$ = new BehaviorSubject<Params>({ id: 'test' });

    await TestBed.configureTestingModule({
      imports: [ProjectDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: params$.asObservable(),
          },
        },
      ],
    }).compileComponents();

    getProjectSpy = spyOn(TestBed.inject(ProjectsService), 'getProject').and.resolveTo(undefined);

    fixture = TestBed.createComponent(ProjectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loading microcopy', () => {
    // Driven through the route params, the way a real navigation does it, so
    // the OnPush view is marked dirty by the event binding rather than by hand.
    it('names the project it is fetching when the title is known', () => {
      params$.next({ id: 'version-seven' });
      fixture.detectChanges();

      const text = (
        fixture.nativeElement.querySelector('.project-loading') as HTMLElement
      )?.textContent?.replace(/\s+/g, ' ');
      expect(component.knownTitle).toBe('Version Seven');
      expect(text).toContain('Version Seven');
      expect(text?.trim()).not.toBe('Loading…');
    });

    it('still says something specific when the title is not known', () => {
      params$.next({ id: 'not-in-the-manifest' });
      fixture.detectChanges();

      const text = (
        fixture.nativeElement.querySelector('.project-loading') as HTMLElement
      )?.textContent?.replace(/\s+/g, ' ');
      expect(text).toContain('project');
      expect(text?.trim()).not.toBe('Loading…');
    });
  });

  describe('loading state heading', () => {
    // Holds the lazy project-data import pending, the way an uncached client
    // navigation does, and checks the document still has an h1 while waiting.
    it('exposes an h1 while the project data is pending', () => {
      getProjectSpy.and.returnValue(new Promise(() => undefined));
      params$.next({ id: 'version-seven' });
      fixture.detectChanges();

      expect(component.loading).toBeTrue();
      const h1 = fixture.nativeElement.querySelector('h1') as HTMLElement;
      expect(h1).toBeTruthy();
      expect(h1.textContent?.trim()).toBe('Version Seven');

      const live = fixture.nativeElement.querySelector('[aria-live="polite"]') as HTMLElement;
      expect(live).toBeTruthy();
      expect(live.getAttribute('aria-busy')).toBe('true');
      expect(live.querySelector('.project-loading')?.textContent).toContain(
        'Loading the Version Seven case study',
      );
      expect(live.contains(h1)).toBeFalse();
    });

    it('falls back to a generic h1 when the title is not known', () => {
      getProjectSpy.and.returnValue(new Promise(() => undefined));
      params$.next({ id: 'not-in-the-manifest' });
      fixture.detectChanges();

      const h1 = fixture.nativeElement.querySelector('h1') as HTMLElement;
      expect(h1?.textContent?.trim()).toBe('Project');
    });
  });

  it('keeps one route param subscription across same-outlet self-navigation', () => {
    expect(getProjectSpy).toHaveBeenCalledTimes(1);

    params$.next({ id: 'second' });
    params$.next({ id: 'third' });

    expect(getProjectSpy).toHaveBeenCalledTimes(3);
    expect(component.projectId).toBe('third');
    expect(params$.observed).toBeTrue();
  });

  describe('when the project data fails to load', () => {
    // A rejected import is an operational failure, not a missing project.
    // Reporting it as "doesn't exist" gives the wrong diagnosis and no way out.
    beforeEach(async () => {
      getProjectSpy.and.rejectWith(new Error('chunk load failed'));
      component.retry();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it('reports a load failure rather than a missing project', () => {
      const text = fixture.nativeElement.textContent as string;

      expect(component.loadFailed).toBeTrue();
      expect(text).toContain("didn't load");
      expect(text).not.toContain("doesn't exist");
    });

    it('announces the failure and offers a retry', () => {
      expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.project-error__retry')).toBeTruthy();
    });

    it('recovers when the retry succeeds', async () => {
      getProjectSpy.and.resolveTo({
        id: 'test',
        title: 'Test Project',
        category: 'UI Design',
      });

      (fixture.nativeElement.querySelector('.project-error__retry') as HTMLButtonElement).click();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.loadFailed).toBeFalse();
      expect(fixture.nativeElement.textContent).toContain('Test Project');
    });
  });

  describe('breadcrumb', () => {
    const crumbs = () =>
      Array.from(
        fixture.nativeElement.querySelectorAll('.breadcrumbs li:not([aria-hidden])'),
      ) as HTMLElement[];

    it('shows Home / Section / Project for a project in a home-card section', async () => {
      getProjectSpy.and.resolveTo({ id: 'version-seven', title: 'Version Seven', category: 'x' });
      params$.next({ id: 'version-seven' });
      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.sectionLabel).toBeTruthy();
      const items = crumbs();
      expect(items.map((li) => li.textContent?.trim())).toEqual([
        'Home',
        component.sectionLabel!,
        'Version Seven',
      ]);
      expect(items[0].querySelector('a')?.getAttribute('href')).toBe('/');
      expect(items[1].querySelector('a')).toBeNull();
      expect(items[2].getAttribute('aria-current')).toBe('page');
    });

    it('shows Home / Project when the project has no section', async () => {
      getProjectSpy.and.resolveTo({ id: 'loose', title: 'Loose Project', category: 'x' });
      params$.next({ id: 'loose' });
      await fixture.whenStable();
      fixture.detectChanges();

      expect(crumbs().map((li) => li.textContent?.trim())).toEqual(['Home', 'Loose Project']);
    });
  });

  it('still reports an unknown project id as not found', async () => {
    getProjectSpy.and.resolveTo(undefined);
    component.retry();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.loadFailed).toBeFalse();
    expect(fixture.nativeElement.textContent).toContain("doesn't exist");
  });

  it('tears down the route param subscription on destroy', () => {
    fixture.destroy();

    expect(params$.observed).toBeFalse();
    params$.next({ id: 'after-destroy' });
    expect(getProjectSpy).toHaveBeenCalledTimes(1);
  });

  describe('SEO payload from applyProject', () => {
    let seoSpy: jasmine.Spy;

    const load = async (data: ProjectDetail | undefined, id = 'payload') => {
      getProjectSpy.and.resolveTo(data);
      params$.next({ id });
      await fixture.whenStable();
      return seoSpy.calls.mostRecent().args[0];
    };

    beforeEach(() => {
      seoSpy = spyOn(TestBed.inject(SeoService), 'update');
    });

    it('uses the first media image as the lead image, skipping videos', async () => {
      const payload = await load({
        id: 'payload',
        title: 'Payload',
        category: 'UI Design',
        description: 'Custom.',
        media: [
          { type: 'video', src: '/videos/intro.mp4', alt: 'v' },
          { type: 'image', src: '/images/media-lead.jpg', alt: 'a' },
          { type: 'image', src: '/images/media-second.jpg', alt: 'b' },
        ],
        images: [{ src: '/images/legacy.jpg', alt: 'c' }],
      });

      expect(payload).toEqual({
        title: 'Payload — Brian Rogstad',
        description: 'Custom.',
        path: '/projects/payload/',
        image: '/images/media-lead.jpg',
        type: 'article',
      });
    });

    it('falls back to images[0] when media is absent', async () => {
      const payload = await load({
        id: 'payload',
        title: 'Payload',
        category: 'UI Design',
        images: [
          { src: '/images/legacy-first.jpg', alt: 'a' },
          { src: '/images/legacy-second.jpg', alt: 'b' },
        ],
      });

      expect(payload.image).toBe('/images/legacy-first.jpg');
    });

    it('sends no image (site default) when the project has none', async () => {
      const payload = await load({ id: 'payload', title: 'Payload', category: 'UI Design' });
      expect(payload.image).toBeUndefined();
    });

    it('uses fallbackDescription(title, category) when the description is missing', async () => {
      const payload = await load({ id: 'payload', title: 'Payload', category: 'Illustration' });

      expect(payload.description).toBe(fallbackDescription('Payload', 'Illustration'));
      expect(payload.description).toMatch(/^Payload — an? .+ in Brian Rogstad's portfolio\.$/);
    });

    it('drives the not-found SEO update for an unknown project', async () => {
      const payload = await load(undefined, 'ghost');

      expect(payload).toEqual({
        title: 'Project Not Found — Brian Rogstad',
        description: "The project you're looking for doesn't exist.",
        path: '/projects/ghost/',
      });
    });

    it('applies prerendered data synchronously via peek without calling getProject', () => {
      const projects = TestBed.inject(ProjectsService);
      spyOn(projects, 'peek').and.returnValue({
        id: 'ready',
        title: 'Ready',
        category: 'UI Design',
        media: [{ type: 'image', src: '/images/ready.jpg', alt: 'r' }],
      });
      getProjectSpy.calls.reset();

      params$.next({ id: 'ready' });

      expect(getProjectSpy).not.toHaveBeenCalled();
      expect(component.loading).toBeFalse();
      expect(seoSpy.calls.mostRecent().args[0].image).toBe('/images/ready.jpg');
      expect(seoSpy.calls.mostRecent().args[0].type).toBe('article');
    });
  });
});
