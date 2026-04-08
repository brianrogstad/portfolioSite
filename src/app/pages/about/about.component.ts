import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectSectionComponent } from '../../components/connect-section/connect-section.component';
import { ClientsSectionComponent } from '../../components/clients-section/clients-section.component';
import { ParallaxComponent } from '../../components/parallax/parallax.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-about',
  imports: [CommonModule, ConnectSectionComponent, ClientsSectionComponent, ParallaxComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.update({
      title: 'About — Brian Rogstad',
      description:
        'Brian Rogstad is a designer and frontend engineer with 15 years of enterprise product design for Thomson Reuters, Citi, Amtrak, and US Bank. Currently building AI characters with mood systems, memory engines, and life simulations.',
      path: '/about',
      type: 'profile',
    });
  }
}
