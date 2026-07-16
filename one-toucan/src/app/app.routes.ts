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
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
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
        path: 'onehr-dashboard',
        loadComponent: () => import('./features/onehr-dashboard/onehr-dashboard.component').then(m => m.OnehrDashboardComponent),
        data: { title: 'OneHR', subtitle: 'Hope you are having a great day' }
      },
      {
        path: 'organization',
        loadComponent: () => import('./features/organization/organization.component').then(m => m.OrganizationComponent),
        data: { title: 'Organization', subtitle: 'Structure & hierarchy' }
      },
      {
        path: 'employees',
        loadComponent: () => import('./features/employees/employees.component').then(m => m.EmployeesComponent),
        data: { title: 'Employees', subtitle: 'Organization directory' }
      },
      // recruitment tracking pipeline
      {
        path: 'recruitment',
        loadComponent: () => import('./features/recruitment/recruitment.component').then(m => m.RecruitmentComponent),
        data: { title: 'Recruitment', subtitle: 'Pipeline & candidate tracking' }
      },
      {
        path: 'onboarding',
        loadComponent: () =>
          import('./features/onboarding/onboarding-list/onboarding-list.component').then(m => m.OnboardingListComponent),
        data: { title: 'Onboarding', subtitle: 'New hire pipeline' }
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/projects.component').then(m => m.ProjectsComponent),
        data: { title: 'Projects', subtitle: 'Project list & execution details' }
      },
      {
        path: 'requirements',
        loadComponent: () =>
          import('./features/requirements/requirements.component').then(m => m.RequirementsComponent),
        data: { title: 'Product Backlog', subtitle: 'Requirements & issue tracking' }
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/tasks/tasks.component').then(m => m.TasksComponent),
        data: { title: 'My Tasks', subtitle: 'Task tracking and execution' }
      },
      {
        path: 'resource-allocation',
        loadComponent: () =>
          import('./features/resource-allocation/resource-allocation.component').then(m => m.ResourceAllocationComponent),
        data: { title: 'Resource Allocation', subtitle: 'Workload & capacity management' }
      },
      {
        path: 'attendance',
        loadComponent: () =>
          import('./features/attendance/attendance.component').then(m => m.AttendanceComponent),
        data: { title: 'Attendance', subtitle: 'Work logs & team trackings' }
      },
      {
        path: 'leave',
        loadComponent: () =>
          import('./features/leave/leave.component').then(m => m.LeaveComponent),
        data: { title: 'Leave Management', subtitle: 'Balances, requests & time-off planning' }
      },
      {
        path: 'bugs',
        loadComponent: () =>
          import('./features/bugs/bugs.component').then(m => m.BugsComponent),
        data: { title: 'Bugs', subtitle: 'Defect tracking & triage' }
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
