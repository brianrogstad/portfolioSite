import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

interface Client {
  href: string;
  title: string;
  src: string;
  alt: string;
}

@Component({
  selector: 'app-clients-section',
  standalone: true,
  imports: [],
  templateUrl: './clients-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsSectionComponent {
  /** When true, images are lazy-loaded (used below the fold on long pages). */
  @Input() lazy = false;

  readonly clients: Client[] = [
    {
      href: 'https://olson.com/',
      title: 'Olson',
      src: '/images/brands/olson-logo.png',
      alt: 'Olson Logo',
    },
    {
      href: 'https://www.citi.com/',
      title: 'Citi Bank',
      src: '/images/brands/citi-logo.png',
      alt: 'Citi Bank Logo',
    },
    {
      href: 'https://www.amtrak.com/home',
      title: 'Amtrak',
      src: '/images/brands/amtrak-logo.png',
      alt: 'Amtrak Logo',
    },
    {
      href: 'https://www.suncountry.com/',
      title: 'Sun Country',
      src: '/images/brands/sun-logo.png',
      alt: 'Sun Country Logo',
    },
    {
      href: 'https://www.thelimited.com/',
      title: 'Limited',
      src: '/images/brands/limited-logo.png',
      alt: 'The Limited Logo',
    },
    {
      href: 'https://www.thomsonreuters.com/',
      title: 'Thomson Reuters',
      src: '/images/brands/thomson-logo.png',
      alt: 'Thomson Reuters Logo',
    },
    {
      href: 'https://www.pfizer.com/',
      title: 'Pfizer',
      src: '/images/brands/pfizer-logo.png',
      alt: 'Pfizer Logo',
    },
    {
      href: 'https://www.luxottica.com/en',
      title: 'Luxottica',
      src: '/images/brands/lux-logo.png',
      alt: 'Luxottica Logo',
    },
    {
      href: 'https://www.usbank.com/',
      title: 'US Bank',
      src: '/images/brands/us-bank.png',
      alt: 'US Bank Logo',
    },
  ];
}
