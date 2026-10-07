import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

// Home is the landing page and stays in the main bundle. Every other page is
// a lazy chunk: the initial download only carries what `/` needs, and the
// prerendered pages get their own chunk as a modulepreload from the SSR build.
export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Brian Rogstad - Digital Portfolio' },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
    title: 'About - Brian Rogstad',
  },
  {
    path: 'projects/:id',
    loadComponent: () =>
      import('./pages/project-detail/project-detail.component').then(
        (m) => m.ProjectDetailComponent,
      ),
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./pages/privacy/privacy.component').then((m) => m.PrivacyComponent),
    title: 'Privacy — Brian Rogstad',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Page Not Found - Brian Rogstad',
  },
];
