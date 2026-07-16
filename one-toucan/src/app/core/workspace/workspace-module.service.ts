import { Injectable, computed, signal } from '@angular/core';

export type ModuleId = 'onehr' | 'project-management' | 'atlas';

export interface WorkspaceNavItem {
  label: string;
  icon: string;
  route?: string;
}

export interface WorkspaceNavGroup {
  title: string;
  items: WorkspaceNavItem[];
}

export interface WorkspaceModule {
  id: ModuleId;
  label: string;
  icon: string;
  tagline: string;
  description: string;
  homeRoute: string;
  accent: string;
  groups: WorkspaceNavGroup[];
}

// Single source of truth for module -> nav-group -> route mapping, consumed by
// both the Home module picker and the Sidenav (which filters to the active module).
export const WORKSPACE_MODULES: WorkspaceModule[] = [
  {
    id: 'onehr',
    label: 'OneHR',
    icon: 'people',
    tagline: 'People & Workforce',
    description: 'Organization structure, employees, recruitment, onboarding, attendance and leave.',
    homeRoute: '/onehr-dashboard',
    accent: 'violet',
    groups: [
      { title: 'Workspace', items: [{ label: 'Dashboard', icon: 'grid-1x2', route: '/onehr-dashboard' }] },
      {
        title: 'Foundation',
        items: [
          { label: 'Organization', icon: 'building', route: '/organization' },
          { label: 'Employees', icon: 'people', route: '/employees' },
          { label: 'Recruitment', icon: 'person-plus', route: '/recruitment' },
          { label: 'Onboarding', icon: 'person-check', route: '/onboarding' }
        ]
      },
      {
        title: 'Workforce',
        items: [
          { label: 'Attendance', icon: 'calendar-check', route: '/attendance' },
          { label: 'Leave', icon: 'airplane', route: '/leave' },
          { label: 'Timesheets', icon: 'clock' }
        ]
      },
      {
        title: 'Knowledge',
        items: [
          { label: 'Documents', icon: 'file-text' },
          { label: 'Knowledge Base', icon: 'book' },
          { label: 'KT Management', icon: 'mortarboard' }
        ]
      },
      {
        title: 'Intelligence',
        items: [
          { label: 'Notifications', icon: 'bell' },
          { label: 'Analytics', icon: 'bar-chart', route: '/onehr-dashboard' },
          { label: 'System Config', icon: 'gear' }
        ]
      }
    ]
  },
  {
    id: 'project-management',
    label: 'Project Management',
    icon: 'kanban',
    tagline: 'Plan & Deliver',
    description: 'Create and run projects, allocate resources and track delivery health.',
    homeRoute: '/dashboard',
    accent: 'teal',
    groups: [
      { title: 'Workspace', items: [{ label: 'Dashboard', icon: 'grid-1x2', route: '/dashboard' }] },
      {
        title: 'Execution',
        items: [
          { label: 'Projects', icon: 'folder', route: '/projects' },
          { label: 'Resource Allocation', icon: 'diagram-3', route: '/resource-allocation' }
        ]
      },
      {
        title: 'Delivery',
        items: [
          { label: 'Skills & Competency', icon: 'stars' },
          { label: 'Idea Management', icon: 'lightbulb' },
          { label: 'Business Analysis', icon: 'graph-up' }
        ]
      }
    ]
  },
  {
    id: 'atlas',
    label: 'Atlas',
    icon: 'compass',
    tagline: 'Build & Ship',
    description: 'Author user stories, manage tasks and raise or triage bugs.',
    homeRoute: '/dashboard',
    accent: 'amber',
    groups: [
      { title: 'Workspace', items: [{ label: 'Dashboard', icon: 'grid-1x2', route: '/dashboard' }] },
      {
        title: 'Delivery Board',
        items: [
          { label: 'User Stories', icon: 'list-check', route: '/requirements' },
          { label: 'My Tasks', icon: 'check2-square', route: '/tasks' },
          { label: 'Bugs', icon: 'bug', route: '/bugs' }
        ]
      }
    ]
  }
];

@Injectable({ providedIn: 'root' })
export class WorkspaceModuleService {
  readonly modules = WORKSPACE_MODULES;

  private readonly activeModuleIdSignal = signal<ModuleId | null>(null);
  readonly activeModuleId = this.activeModuleIdSignal.asReadonly();
  readonly activeModule = computed(() => this.modules.find(m => m.id === this.activeModuleIdSignal()) ?? null);

  /** Finds which module owns a given route path, or null (e.g. on /home). */
  moduleForPath(url: string): WorkspaceModule | null {
    const path = url.split('?')[0].split('#')[0];
    for (const module of this.modules) {
      for (const group of module.groups) {
        for (const item of group.items) {
          if (item.route && (path === item.route || path.startsWith(item.route + '/'))) {
            return module;
          }
        }
      }
    }
    return null;
  }

  /** Keeps the active module in sync with the router so a refresh/deep-link still filters the sidenav correctly. */
  syncFromUrl(url: string): void {
    this.activeModuleIdSignal.set(this.moduleForPath(url)?.id ?? null);
  }

  setActiveModule(id: ModuleId): void {
    this.activeModuleIdSignal.set(id);
  }

  clearActiveModule(): void {
    this.activeModuleIdSignal.set(null);
  }
}
