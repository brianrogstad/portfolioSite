import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Brian Rogstad - Digital Portfolio' },
  { path: 'about', component: AboutComponent, title: 'About - Brian Rogstad' },
  { path: 'projects/:id', component: ProjectDetailComponent },
  { path: '**', component: NotFoundComponent, title: 'Page Not Found - Brian Rogstad' },
];
