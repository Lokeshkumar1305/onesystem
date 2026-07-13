import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'onboarding/new',
    loadComponent: () => import('./features/onboarding/onboarding.component').then(m => m.OnboardingComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: { title: 'Executive Dashboard', subtitle: 'Analytics & Reporting · CTO View' }
      },
      {
        path: 'employees',
        loadComponent: () => import('./features/employees/employees.component').then(m => m.EmployeesComponent),
        data: { title: 'Employees', subtitle: 'Organization directory' }
      },
      {
        path: 'onboarding',
        loadComponent: () =>
          import('./features/onboarding/onboarding-list/onboarding-list.component').then(m => m.OnboardingListComponent),
        data: { title: 'Onboarding', subtitle: 'New hire pipeline' }
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
