import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'jobs', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(c => c.RegisterComponent) },
  { path: 'jobs', loadComponent: () => import('./features/jobs/job-list/job-list.component').then(c => c.JobListComponent) },
  { path: 'jobs/:id', loadComponent: () => import('./features/jobs/job-detail/job-detail.component').then(c => c.JobDetailComponent) },
  { 
    path: 'my-applications', 
    loadComponent: () => import('./features/applications/my-applications/my-applications.component').then(c => c.MyApplicationsComponent),
    canActivate: [authGuard] 
  },
  {
    path: 'admin/jobs',
    loadComponent: () => import('./features/admin/manage-jobs/manage-jobs.component').then(c => c.ManageJobsComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/applications/:jobId',
    loadComponent: () => import('./features/admin/manage-applications/manage-applications.component').then(c => c.ManageApplicationsComponent),
    canActivate: [adminGuard]
  },
  { path: '**', redirectTo: 'jobs' }
];