import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProjectsService } from '../../services/projects.service';
import { ProjectDetail } from '../../models/project.model';

interface ProjectNeighbor {
  id: string;
  title: string;
}

@Component({
  selector: 'app-project-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private projectsService = inject(ProjectsService);
  private titleService = inject(Title);

  project?: ProjectDetail;
  projectId = '';
  loading = true;
  prevProject?: ProjectNeighbor;
  nextProject?: ProjectNeighbor;
  sectionLabel?: string;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.project = undefined;
      this.loading = true;
      const nav = this.projectsService.getProjectNav(this.projectId);
      this.prevProject = nav.prev;
      this.nextProject = nav.next;
      this.sectionLabel = nav.section;
      this.projectsService
        .getProject(this.projectId)
        .then((data) => {
          this.project = data;
          if (data) {
            this.titleService.setTitle(`${data.title} - Brian Rogstad`);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    });
  }
}
