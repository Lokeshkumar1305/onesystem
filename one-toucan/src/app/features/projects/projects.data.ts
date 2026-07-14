export interface ProjectCard {
  id: string;
  type: 'FEATURE' | 'BUG' | 'CHORE' | 'SECURITY';
  title: string;
  points: number;
  assigneeInitials: string;
  assigneeColorClass: string; // e.g. 'bg-blue', 'bg-purple', 'bg-pink', 'bg-teal'
  priorityDotColor: 'green' | 'yellow' | 'red';
}

export interface ProjectColumn {
  id: string;
  name: string;
  bulletColor: string;
  cards: ProjectCard[];
}

export const INITIAL_BOARD: ProjectColumn[] = [
  {
    id: 'backlog',
    name: 'Backlog',
    bulletColor: '#6b7280', // gray
    cards: [
      {
        id: 'ATL-241',
        type: 'FEATURE',
        title: 'Reconciliation report CSV export',
        points: 3,
        assigneeInitials: 'RM',
        assigneeColorClass: 'oh-avatar-blue',
        priorityDotColor: 'green'
      },
      {
        id: 'ATL-238',
        type: 'CHORE',
        title: 'Audit log retention config',
        points: 2,
        assigneeInitials: 'SK',
        assigneeColorClass: 'oh-avatar-purple',
        priorityDotColor: 'yellow'
      },
      {
        id: 'ATL-235',
        type: 'FEATURE',
        title: 'Bulk user import via SCIM',
        points: 5,
        assigneeInitials: 'AK',
        assigneeColorClass: 'oh-avatar-pink',
        priorityDotColor: 'yellow'
      }
    ]
  },
  {
    id: 'in-progress',
    name: 'In Progress',
    bulletColor: '#2563eb', // blue
    cards: [
      {
        id: 'ATL-229',
        type: 'FEATURE',
        title: 'Permission matrix CRUD grid',
        points: 8,
        assigneeInitials: 'PN',
        assigneeColorClass: 'oh-avatar-teal',
        priorityDotColor: 'red'
      },
      {
        id: 'ATL-231',
        type: 'SECURITY',
        title: 'Session monitor — revoke JWT',
        points: 5,
        assigneeInitials: 'DR',
        assigneeColorClass: 'oh-avatar-blue',
        priorityDotColor: 'red'
      },
      {
        id: 'ATL-226',
        type: 'FEATURE',
        title: 'Org tree drag reorder',
        points: 5,
        assigneeInitials: 'SI',
        assigneeColorClass: 'oh-avatar-teal',
        priorityDotColor: 'yellow'
      }
    ]
  },
  {
    id: 'in-review',
    name: 'In Review',
    bulletColor: '#d97706', // orange
    cards: [
      {
        id: 'ATL-219',
        type: 'BUG',
        title: 'SSO — SAML assertion parse',
        points: 3,
        assigneeInitials: 'RM',
        assigneeColorClass: 'oh-avatar-blue',
        priorityDotColor: 'red'
      },
      {
        id: 'ATL-222',
        type: 'SECURITY',
        title: 'MFA enforcement for admins',
        points: 5,
        assigneeInitials: 'AK',
        assigneeColorClass: 'oh-avatar-pink',
        priorityDotColor: 'red'
      }
    ]
  },
  {
    id: 'done',
    name: 'Done',
    bulletColor: '#16a34a', // green
    cards: [
      {
        id: 'ATL-210',
        type: 'FEATURE',
        title: 'Login — remember device',
        points: 2,
        assigneeInitials: 'SK',
        assigneeColorClass: 'oh-avatar-purple',
        priorityDotColor: 'green'
      },
      {
        id: 'ATL-205',
        type: 'FEATURE',
        title: 'Role inheritance from parent',
        points: 5,
        assigneeInitials: 'PN',
        assigneeColorClass: 'oh-avatar-teal',
        priorityDotColor: 'yellow'
      }
    ]
  }
];
