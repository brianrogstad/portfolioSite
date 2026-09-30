import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyComponent {
  constructor() {
    inject(SeoService).update({
      title: 'Privacy — Brian Rogstad',
      description:
        'What this site collects: Google Analytics measurement only, no forms, no account, no advertising or retargeting trackers.',
      path: '/privacy/',
    });
  }
}
