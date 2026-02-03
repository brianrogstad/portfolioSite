import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

declare global {
  interface Window {
    __CPEmbed?: (selector: string) => void;
  }
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {

  ngAfterViewInit() {
    // Reinitialize CodePen embeds after view loads
    if (typeof window !== 'undefined' && window.__CPEmbed) {
      window.__CPEmbed('.codepen');
    }
  }

}
