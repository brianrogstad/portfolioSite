import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  // Project detail routes - all use the same component with different IDs
  { path: 'projects/:id', component: ProjectDetailComponent },
  { path: '**', redirectTo: '' }
];
