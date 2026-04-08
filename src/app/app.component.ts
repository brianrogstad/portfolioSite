import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  label: string;
  route?: string;
  external?: boolean;
  children?: NavItem[];
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private platformId = inject<object>(PLATFORM_ID);

  title = 'portfolioSite';
  mobileMenuOpen = false;
  startYear = 2009;
  currentYear = new Date().getFullYear();
  private readonly DESKTOP_BREAKPOINT = 1620;

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId) && window.innerWidth > this.DESKTOP_BREAKPOINT) {
      this.mobileMenuOpen = false;
    }
  }

  get yearRange(): string {
    return this.startYear === this.currentYear
      ? `${this.currentYear}`
      : `${this.startYear}-${this.currentYear}`;
  }

  navItems: NavItem[] = [
    { label: 'Home', route: '/' },
    { label: 'About', route: '/about' },
    {
      label: 'My Projects',
      children: [
        { label: 'Version Seven', route: '/projects/version-seven' },
        { label: "Ana's Journal", route: '/projects/ana-journal' },
        { label: 'League Index', route: 'https://theleagueindex.com', external: true },
      ],
    },
    {
      label: 'Client & Agency Work',
      children: [
        { label: 'US Bancorp', route: '/projects/usb' },
        { label: 'Tremor Technologies', route: '/projects/tremor' },
        { label: 'FindLaw (Thomson Reuters)', route: '/projects/findlaw' },
      ],
    },
    {
      label: 'Creative',
      children: [
        { label: 'Logo Design Process', route: '/projects/logo' },
        { label: 'Character Development', route: '/projects/rough' },
        { label: 'Observational Sketches', route: '/projects/life' },
      ],
    },
  ];

  openMobileMenu(event: Event) {
    event.preventDefault();
    this.mobileMenuOpen = true;
  }

  closeMobileMenu(event: Event) {
    event.preventDefault();
    this.mobileMenuOpen = false;
  }

  closeMenu() {
    this.mobileMenuOpen = false;
  }

  closeDropdown() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}
