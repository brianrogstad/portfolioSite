export interface ProjectDetail {
  id: string;
  title: string;
  category: string;
  content?: string;
  images?: ProjectImage[];
  videos?: ProjectVideo[];
  media?: ProjectMedia[];
  description?: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface ProjectVideo {
  src: string;
  alt: string;
  caption?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export interface HomeCardLink {
  type: 'route' | 'external';
  label?: string;
  target: string;
}

export interface HomeCardImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export interface HomeCard {
  id: string;
  title: string;
  image: HomeCardImage;
  tags: string[];
  summary: string;
  primaryLink: HomeCardLink;
  links: HomeCardLink[];
}

export interface HomeCardSection {
  heading: string;
  tone: 'light' | 'dark';
  cards: HomeCard[];
}

export interface HomeCardsManifest {
  sections: HomeCardSection[];
}

export interface ProjectMedia {
  type: 'image' | 'video';
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  group?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}
