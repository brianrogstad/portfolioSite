import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROJECT_IDS } from './services/projects.service';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  {
    // Without these params the parameterised route fell through to the
    // client-render catch-all, so GitHub Pages had no file to serve for any
    // project page and answered every one of them from 404.html — a 404
    // status on a page that renders fine. Ids come from the loader map, so a
    // new project is prerendered without touching this file.
    path: 'projects/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => PROJECT_IDS.map((id) => ({ id })),
  },
  { path: '**', renderMode: RenderMode.Client },
];
