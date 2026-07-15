export type BugSeverity = 'Critical' | 'Major' | 'Minor' | 'Trivial';
export type BugPriority = 'High' | 'Med' | 'Low';
export type BugStatus = 'Open' | 'In Progress' | 'Fixed' | 'Reopened' | 'Closed';

export interface Bug {
  id: string; // e.g., 'BUG-201'
  title: string;
  severity: BugSeverity;
  priority: BugPriority;
  status: BugStatus;
  reportedBy: string;
}

export const INITIAL_BUGS: Bug[] = [
  {
    id: 'BUG-201',
    title: 'Settlement total off by rounding paise',
    severity: 'Critical',
    priority: 'High',
    status: 'In Progress',
    reportedBy: 'Aisha Verma'
  },
  {
    id: 'BUG-202',
    title: 'Webhook retries duplicate payout events',
    severity: 'Major',
    priority: 'High',
    status: 'Open',
    reportedBy: 'Rahul Nair'
  },
  {
    id: 'BUG-203',
    title: 'Sandbox onboarding form loses draft on refresh',
    severity: 'Minor',
    priority: 'Med',
    status: 'Open',
    reportedBy: 'Priya Shah'
  },
  {
    id: 'BUG-204',
    title: 'CSV export truncates merchant names with commas',
    severity: 'Major',
    priority: 'Med',
    status: 'Fixed',
    reportedBy: 'Karthik Iyer'
  },
  {
    id: 'BUG-205',
    title: 'Idempotency key header casing rejected by gateway',
    severity: 'Critical',
    priority: 'High',
    status: 'Reopened',
    reportedBy: 'Meera Pillai'
  },
  {
    id: 'BUG-206',
    title: 'Timesheet clock icon misaligned on Safari',
    severity: 'Trivial',
    priority: 'Low',
    status: 'Closed',
    reportedBy: 'Devansh Rao'
  },
  {
    id: 'BUG-207',
    title: 'Bank sandbox auth mock times out after 30s',
    severity: 'Major',
    priority: 'Med',
    status: 'Open',
    reportedBy: 'Aisha Verma'
  }
];
