import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-connect-section',
  standalone: true,
  templateUrl: './connect-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectSectionComponent {
  /** Optional id applied to the <aside> element (e.g. scrollspy target). */
  @Input() sectionId?: string;
  /** Optional id applied to the heading (e.g. anchor link target). */
  @Input() headingId?: string;
}
