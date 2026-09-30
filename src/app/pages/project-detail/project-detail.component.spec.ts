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

  it('tears down the route param subscription on destroy', () => {
    fixture.destroy();

    expect(params$.observed).toBeFalse();
    params$.next({ id: 'after-destroy' });
    expect(getProjectSpy).toHaveBeenCalledTimes(1);
  });
});
