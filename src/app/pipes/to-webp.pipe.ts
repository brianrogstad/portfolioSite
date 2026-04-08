import { Pipe, PipeTransform } from '@angular/core';

/**
 * Derives a `.webp` sibling path from a raster image path.
 *
 * Example: `/images/foo/bar.jpg` → `/images/foo/bar.webp`
 *
 * Used in `<picture>` tags as the `<source type="image/webp">` srcset, with
 * the original raster path as the `<img>` fallback. WebP siblings are
 * generated at build time (see `cwebp -q 82` over `public/images/`,
 * excluding `public/images/brands/`).
 *
 * Returns the original path unchanged if it does not end in a known raster
 * extension, so it is safe to apply universally.
 */
@Pipe({
  name: 'toWebp',
  standalone: true,
})
export class ToWebpPipe implements PipeTransform {
  transform(src: string | null | undefined): string {
    if (!src) {
      return src ?? '';
    }
    return src.replace(/\.(jpe?g|png)(\?.*)?$/i, '.webp$2');
  }
}
