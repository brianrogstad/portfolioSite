import { ToWebpPipe } from './to-webp.pipe';

describe('ToWebpPipe.transform', () => {
  const pipe = new ToWebpPipe();

  it('derives .webp from .jpg, .jpeg and .png, case-insensitively', () => {
    expect(pipe.transform('/images/foo/bar.jpg')).toBe('/images/foo/bar.webp');
    expect(pipe.transform('/images/foo/bar.jpeg')).toBe('/images/foo/bar.webp');
    expect(pipe.transform('/images/foo/bar.png')).toBe('/images/foo/bar.webp');
    expect(pipe.transform('/images/foo/BAR.JPG')).toBe('/images/foo/BAR.webp');
    expect(pipe.transform('/images/foo/bar.PnG')).toBe('/images/foo/bar.webp');
  });

  it('keeps a trailing query string after the new extension', () => {
    expect(pipe.transform('/images/a.jpg?v=2')).toBe('/images/a.webp?v=2');
  });

  it('only rewrites the final extension', () => {
    expect(pipe.transform('/images/a.png.backup/b.jpg')).toBe('/images/a.png.backup/b.webp');
  });

  it('passes a non-raster path through unchanged', () => {
    expect(pipe.transform('/images/logo.svg')).toBe('/images/logo.svg');
    expect(pipe.transform('/images/already.webp')).toBe('/images/already.webp');
    expect(pipe.transform('/videos/clip.mp4')).toBe('/videos/clip.mp4');
  });

  it('returns an empty string for null, undefined and empty input', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
  });
});
