import { Component, AfterViewInit, inject } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { HomeCardSection } from '../../models/project.model';

declare global {
  interface Window {
    __CPEmbed?: (selector: string) => void;
  }
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, NgTemplateOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  private projectsService = inject(ProjectsService);

  sections: HomeCardSection[] = this.projectsService.getHomeCardSections();
  lightSections: HomeCardSection[] = this.sections.filter((s) => s.tone !== 'dark');
  darkSections: HomeCardSection[] = this.sections.filter((s) => s.tone === 'dark');

  ngAfterViewInit() {
    // Reinitialize CodePen embeds after view loads
    if (typeof window !== 'undefined' && window.__CPEmbed) {
      window.__CPEmbed('.codepen');
    }
  }
}
