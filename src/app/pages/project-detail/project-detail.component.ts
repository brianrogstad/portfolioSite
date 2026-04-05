import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProjectsService } from '../../services/projects.service';
import { ProjectDetail } from '../../models/project.model';

@Component({
  selector: 'app-project-detail',
  imports: [CommonModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private projectsService = inject(ProjectsService);
  private titleService = inject(Title);

  project?: ProjectDetail;
  projectId = '';

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.project = this.projectsService.getProject(this.projectId);
      if (this.project) {
        this.titleService.setTitle(`${this.project.title} - Brian Rogstad`);
      }
    });
  }
}
