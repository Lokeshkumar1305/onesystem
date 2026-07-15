export type TaskStatus = 'Open' | 'In Progress' | 'In Review' | 'Backlog' | 'Done';
export type TaskPriority = 'High' | 'Med' | 'Low';

export interface Task {
  id: string; // e.g. ATL-229
  title: string;
  project: string;
  status: TaskStatus;
  priority: TaskPriority;
  due: string; // e.g. Today, Tomorrow, Thu, Fri, Mon
  completed: boolean;
  assignedToMe: boolean;
  watching: boolean;
}

export const INITIAL_TASKS: Task[] = [
  {
    id: 'ATL-229',
    title: 'Wire up permission store audit logging',
    project: 'Atlas Migration',
    status: 'In Progress',
    priority: 'High',
    due: 'Today',
    completed: true,
    assignedToMe: true,
    watching: false
  },
  {
    id: 'ATL-219',
    title: 'Review SAML assertion parser PR',
    project: 'Atlas Migration',
    status: 'In Review',
    priority: 'High',
    due: 'Today',
    completed: false,
    assignedToMe: true,
    watching: true
  },
  {
    id: 'NIM-88',
    title: 'Draft FRD for Cost Center dashboard',
    project: 'Nimbus Portal',
    status: 'Open',
    priority: 'Med',
    due: 'Tomorrow',
    completed: false,
    assignedToMe: false,
    watching: true
  },
  {
    id: 'ATL-244',
    title: 'Sync with HDFC on UAT access',
    project: 'Atlas Migration',
    status: 'Open',
    priority: 'Med',
    due: 'Thu',
    completed: false,
    assignedToMe: true,
    watching: false
  },
  {
    id: 'ORN-12',
    title: 'Estimate Knowledge Graph spike',
    project: 'Orion Analytics',
    status: 'Backlog',
    priority: 'Low',
    due: 'Fri',
    completed: false,
    assignedToMe: false,
    watching: false
  },
  {
    id: 'INT-301',
    title: 'Close attendance regularization bug',
    project: 'Internal',
    status: 'Done',
    priority: 'Low',
    due: 'Mon',
    completed: true,
    assignedToMe: true,
    watching: true
  }
];
