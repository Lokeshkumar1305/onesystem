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
      // TEMP: added so login can land directly on a project-only dashboard,
      // skipping the OneHR/Atlas/Project-Management picker at /home.
      {
        path: 'temp-project',
        loadComponent: () => import('./features/temp-project/temp-project.component').then(m => m.TempProjectComponent),
        data: { title: 'Projects', subtitle: 'Analytics & Reporting · CTO View' }
      },
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
        path: 'atlas/projects',
        loadComponent: () =>
          import('./features/atlas/atlas-projects/atlas-projects.component').then(m => m.AtlasProjectsComponent),
        data: { title: 'Atlas Projects', subtitle: 'Delivery workspaces you have access to' }
      },
      {
        path: 'atlas/projects/:id',
        loadComponent: () =>
          import('./features/atlas/atlas-workspace/atlas-workspace.component').then(m => m.AtlasWorkspaceComponent),
        data: { title: 'Atlas Workspace', subtitle: 'Requirements, tasks & delivery tracking' },
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'board' },
          {
            path: 'board',
            loadComponent: () =>
              import('./features/atlas/atlas-workspace/tabs/board-tab.component').then(m => m.BoardTabComponent)
          },
          {
            path: 'requirements',
            loadComponent: () =>
              import('./features/atlas/atlas-workspace/tabs/backlog/requirements-panel.component').then(m => m.RequirementsPanelComponent)
          },
          {
            path: 'stories',
            loadComponent: () =>
              import('./features/atlas/atlas-workspace/tabs/backlog/user-stories-panel.component').then(m => m.UserStoriesPanelComponent)
          },
          {
            path: 'tasks',
            loadComponent: () =>
              import('./features/atlas/atlas-workspace/tabs/backlog/tasks-panel.component').then(m => m.TasksPanelComponent)
          },
          {
            path: 'test-cases',
            loadComponent: () =>
              import('./features/atlas/atlas-workspace/tabs/backlog/test-cases-panel.component').then(m => m.TestCasesPanelComponent)
          },
          {
            path: 'bugs',
            loadComponent: () =>
              import('./features/atlas/atlas-workspace/tabs/backlog/bugs-panel.component').then(m => m.BugsPanelComponent)
          },
          {
            path: 'operational',
            loadComponent: () =>
              import('./features/atlas/atlas-workspace/tabs/operational-tab.component').then(m => m.OperationalTabComponent)
          }
        ]
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
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then(m => m.ProfileComponent),
        data: { title: 'Profile', subtitle: 'Manage your personal & professional information' }
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
