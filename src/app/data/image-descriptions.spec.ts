import lifeData from './life.json';
import modelData from './model.json';
import roughData from './rough.json';

import { ProjectDetail } from '../models/project.model';

/**
 * Guards the image alt text on the sketch projects, where two separate
 * defects landed: model.json carried alt copy for an unrelated mobile app on
 * every image, and rough/life used the nonexistent word "Compotation".
 */
const projects: { name: string; data: ProjectDetail }[] = [
  { name: 'model.json', data: modelData as ProjectDetail },
  { name: 'rough.json', data: roughData as ProjectDetail },
  { name: 'life.json', data: lifeData as ProjectDetail },
];

function imagesOf(project: ProjectDetail): { src: string; alt: string }[] {
  return (project.media ?? project.images ?? []).map((item) => ({
    src: item.src,
    alt: item.alt,
  }));
}

describe('sketch project image descriptions', () => {
  for (const { name, data } of projects) {
    describe(name, () => {
      const images = imagesOf(data);

      it('has images to describe', () => {
        expect(images.length).toBeGreaterThan(0);
      });

      it('gives every image a non-empty description', () => {
        for (const image of images) {
          expect(image.alt?.trim()).withContext(`${name} ${image.src}`).toBeTruthy();
        }
      });

      it('describes each image distinctly', () => {
        const alts = images.map((image) => image.alt);
        expect(new Set(alts).size).withContext(`${name} repeats an alt`).toBe(alts.length);
      });

      it('uses real words', () => {
        for (const image of images) {
          expect(image.alt)
            .withContext(`${name} ${image.src}`)
            .not.toMatch(/compotation/i);
        }
      });

      it('describes the drawing rather than an unrelated app screenshot', () => {
        for (const image of images) {
          expect(image.alt)
            .withContext(`${name} ${image.src}`)
            .not.toMatch(/mobile app|screenshots? of/i);
        }
      });
    });
  }
});
