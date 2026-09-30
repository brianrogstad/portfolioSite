import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { SeoService } from '../../services/seo.service';
import { ProjectDetail } from '../../models/project.model';
import { ConnectSectionComponent } from '../../components/connect-section/connect-section.component';
import { ClientsSectionComponent } from '../../components/clients-section/clients-section.component';
import { ContactCtaComponent } from '../../components/contact-cta/contact-cta.component';
import { ParallaxComponent } from '../../components/parallax/parallax.component';
import { ToWebpPipe } from '../../pipes/to-webp.pipe';
import { fallbackDescription } from './project-description';

interface ProjectNeighbor {
  id: string;
  title: string;
}

@Component({
  selector: 'app-project-detail',
  imports: [
    RouterLink,
    ConnectSectionComponent,
    ClientsSectionComponent,
    ContactCtaComponent,
    ParallaxComponent,
    ToWebpPipe,
  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private projectsService = inject(ProjectsService);
  private seo = inject(SeoService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  project?: ProjectDetail;
  projectId = '';
  loading = true;
  /**
   * True when the project's data failed to load (a rejected import: offline,
   * a dropped chunk, a bad deploy). Distinct from `project === undefined`
   * after a successful load, which means the id is genuinely unknown. Without
   * this the template told visitors the project doesn't exist, which is the
   * wrong diagnosis and offers no way forward.
   */
  loadFailed = false;
  prevProject?: ProjectNeighbor;
  nextProject?: ProjectNeighbor;
  sectionLabel?: string;
  /**
   * Title from the home-cards manifest, known before the project's own data
   * arrives, so the loading state can say what it is fetching instead of a
   * bare "Loading…".
   */
  knownTitle?: string;

  ngOnInit() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.projectId = params['id'];
      const nav = this.projectsService.getProjectNav(this.projectId);
      this.prevProject = nav.prev;
      this.nextProject = nav.next;
      this.sectionLabel = nav.section;
      this.knownTitle = nav.title;
      this.loadProject();
    });
  }

  /** Re-runs the data load for the current route. Bound to the retry action. */
  retry() {
    this.loadProject();
  }

  private loadProject() {
    this.project = undefined;
    this.loadFailed = false;
    this.loading = true;
    // OnPush: entering the loading state is a field write with no event
    // behind it, so without this the loading copy never paints when the
    // route params change on an already-mounted component.
    this.cdr.markForCheck();

    this.projectsService
      .getProject(this.projectId)
      .then((data) => {
        this.project = data;
        if (data) {
          const title = `${data.title} — Brian Rogstad`;
          const leadImage =
            data.media?.find((m) => m.type === 'image')?.src ?? data.images?.[0]?.src;
          this.seo.update({
            title,
            description:
              data.description ?? fallbackDescription(data.title, data.category),
            path: `/projects/${this.projectId}/`,
            image: leadImage,
            type: 'article',
          });
        } else {
          this.seo.update({
            title: 'Project Not Found — Brian Rogstad',
            description: "The project you're looking for doesn't exist.",
            path: `/projects/${this.projectId}/`,
          });
        }
      })
      .catch(() => {
        this.loadFailed = true;
        this.seo.update({
          title: 'Project Unavailable — Brian Rogstad',
          description: 'This project could not be loaded. Try again in a moment.',
          path: `/projects/${this.projectId}/`,
        });
      })
      .finally(() => {
        this.loading = false;
        this.cdr.markForCheck();
      });
  }
}
