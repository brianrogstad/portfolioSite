import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { SeoService } from '../../services/seo.service';
import { HomeCardSection } from '../../models/project.model';
import { ToWebpPipe } from '../../pipes/to-webp.pipe';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgTemplateOutlet, ToWebpPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  private seo = inject(SeoService);

  sections: HomeCardSection[] = this.projectsService.getHomeCardSections();
  lightSections: HomeCardSection[] = this.sections.filter((s) => s.tone !== 'dark');
  darkSections: HomeCardSection[] = this.sections.filter((s) => s.tone === 'dark');

  ngOnInit() {
    this.seo.update({
      title: 'Brian Rogstad — Designer and Frontend Engineer',
      description:
        'Designer and frontend engineer building UI, design systems, and applications in Angular and TypeScript. 15 years of enterprise product design for Thomson Reuters, Citi, Amtrak, and US Bank, plus AI character systems with mood and memory engines.',
      path: '/',
    });
  }
}
