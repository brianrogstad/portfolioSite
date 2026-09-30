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
import { ParallaxComponent } from '../../components/parallax/parallax.component';
import { ToWebpPipe } from '../../pipes/to-webp.pipe';

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
      this.project = undefined;
      this.loading = true;
      const nav = this.projectsService.getProjectNav(this.projectId);
      this.prevProject = nav.prev;
      this.nextProject = nav.next;
      this.sectionLabel = nav.section;
      this.knownTitle = nav.title;
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
                data.description ??
                `${data.title} — a ${data.category.toLowerCase()} project by Brian Rogstad.`,
              path: `/projects/${this.projectId}`,
              image: leadImage,
              type: 'article',
            });
          } else {
            this.seo.update({
              title: 'Project Not Found — Brian Rogstad',
              description: "The project you're looking for doesn't exist.",
              path: `/projects/${this.projectId}`,
            });
          }
        })
        .finally(() => {
          this.loading = false;
          this.cdr.markForCheck();
        });
    });
  }
}
