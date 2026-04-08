import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectSectionComponent } from '../../components/connect-section/connect-section.component';
import { ClientsSectionComponent } from '../../components/clients-section/clients-section.component';
import { ParallaxComponent } from '../../components/parallax/parallax.component';

@Component({
  selector: 'app-about',
  imports: [CommonModule, ConnectSectionComponent, ClientsSectionComponent, ParallaxComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {}
