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

export interface ProjectMedia {
  type: 'image' | 'video';
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}
