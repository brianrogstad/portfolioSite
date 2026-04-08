import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-parallax',
  standalone: true,
  template: `<div class="subsection-container parallax-container"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParallaxComponent {}
