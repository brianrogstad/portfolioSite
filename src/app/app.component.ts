import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  label: string;
  route?: string;
  external?: boolean;
  children?: NavItem[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portfolioSite';
  mobileMenuOpen = false;
  startYear = 2009;
  currentYear = new Date().getFullYear();
  private readonly DESKTOP_BREAKPOINT = 1620;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

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
      label: 'Design Systems',
      children: [
        { label: 'USB Design System Sample', route: '/projects/usb-system' },
        { label: 'USB Themed Wireframes', route: '/projects/usb-wireframes' },
        { label: 'Component Library Mockup', route: 'https://www.figma.com/file/O3mueZB1Fl1DmNzu9EiZdV/Pattern-Library-Design?type=design&node-id=0%3A1&mode=design&t=cqrLPeKKCAkP7vUL-1', external: true },
        { label: 'Tremor Design System Sample', route: '/projects/tremor-system' }
      ]
    },
    {
      label: 'Applications',
      children: [
        { label: 'League Index', route: 'https://theleagueindex.com', external: true },
        { label: 'Salvage Auction Estimator', route: 'https://salvageauctionestimator.com', external: true },
        { label: 'Version Seven Application', route: 'https://www.figma.com/file/0VcaG6JEeFydywrTQo5iN1/Version-Seven?type=design&node-id=0%3A1&mode=design&t=XAjhBFIkeHaps7TE-1', external: true },
        { label: 'FindLaw Workspace Application', route: '/projects/bpm' },
        { label: 'Workflow Admin Application', route: '/projects/admin' },
        { label: 'Tremor Application (Admin UI)', route: '/projects/utility' },
        { label: 'Contacts Application', route: '/projects/contact' }
      ]
    },
    {
      label: 'Prototypes & Flows',
      children: [
        { label: 'USB Flow Samples', route: '/projects/usb-maps' },
        { label: 'Prototype Samples', route: '/projects/proto' },
        { label: 'Authentication Flow', route: '/projects/tremor-maps' },
        { label: 'Weather App Prototype', route: '/projects/mobile' },
        { label: 'Adobe Edge Reflow', route: '/projects/reflow' }
      ]
    },
    {
      label: 'Marketing & Branding',
      children: [
        { label: 'Logo Design Process', route: '/projects/logo' },
        { label: 'Earth Day Poster', route: '/projects/earth' },
        { label: 'Amtrak Email Campaigns', route: '/projects/emails' },
        { label: 'Attorney Websites', route: '/projects/legal' }
      ]
    },
    {
      label: 'Code Samples',
      children: [
        { label: 'Knockout JS Sample', route: 'https://codepen.io/brogstad/pen/wGGXgg', external: true },
        { label: 'Giphy Search using React', route: 'https://codepen.io/brogstad/pen/ybZyBN', external: true },
        { label: 'Local Storage Demo', route: 'https://codepen.io/brogstad/pen/BZGxm', external: true },
        { label: 'Dynamic Data', route: 'https://codepen.io/brogstad/pen/RgqQdE', external: true }
      ]
    },
    {
      label: 'Sketching & Drawing',
      children: [
        { label: 'Animal Character Design', route: '/projects/rough' },
        { label: 'Observational Sketches', route: '/projects/life' },
        { label: 'Model Sessions', route: '/projects/model' },
        { label: 'Reference Sketches', route: '/projects/reference' }
      ]
    }
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
}
