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
