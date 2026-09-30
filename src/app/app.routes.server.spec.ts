import { RenderMode } from '@angular/ssr';

import { serverRoutes } from './app.routes.server';
import { PROJECT_IDS } from './services/projects.service';

describe('serverRoutes', () => {
  const projectRoute = serverRoutes.find((route) => route.path === 'projects/:id');

  it('prerenders every project page', async () => {
    expect(projectRoute).withContext('projects/:id server route is missing').toBeDefined();
    // Falling through to the '**' client-render catch-all is what made every
    // project URL answer with 404.html on a static host.
    expect(projectRoute?.renderMode).toBe(RenderMode.Prerender);

    const getPrerenderParams = (
      projectRoute as { getPrerenderParams?: () => Promise<Record<string, string>[]> }
    ).getPrerenderParams;
    expect(getPrerenderParams).toBeDefined();

    const params = await getPrerenderParams!();
    expect(params.length).toBe(PROJECT_IDS.length);
    expect(params.map((param) => param['id']).sort()).toEqual([...PROJECT_IDS].sort());
  });

  it('derives the id list from the loader map rather than a hardcoded list', () => {
    expect(PROJECT_IDS.length).toBeGreaterThan(0);
    // Spot-check ids the sitemap advertises.
    for (const id of ['version-seven', 'usb', 'logo', 'life']) {
      expect(PROJECT_IDS).withContext(`missing project id: ${id}`).toContain(id);
    }
  });

  it('keeps the client-render catch-all last so it cannot shadow a real route', () => {
    expect(serverRoutes[serverRoutes.length - 1].path).toBe('**');
  });
});
