import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { ProjectDetailComponent } from './project-detail.component';
import { ProjectsService } from '../../services/projects.service';

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
});
