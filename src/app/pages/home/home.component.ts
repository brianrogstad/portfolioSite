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

  private sections: HomeCardSection[] = this.projectsService.getHomeCardSections();
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

  /**
   * Builds a descriptive accessible name for a project CTA so screen-reader
   * users navigating by links list can tell which project each "View
   * Screenshots"/"View Site" link belongs to (WCAG 2.4.4).
   * e.g. ("View Screenshots", "Version Seven") -> "View Version Seven screenshots"
   */
  ctaAriaLabel(label: string, title: string): string {
    const action = label
      .toLowerCase()
      .replace(/^view\s*/, '')
      .trim();
    return `View ${title} ${action}`;
  }
}
