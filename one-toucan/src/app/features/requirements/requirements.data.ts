export type RequirementType = 'EPIC' | 'STORY' | 'TASK' | 'BUG';
export type RequirementPriority = 'High' | 'Med' | 'Low';
export type RequirementStatus = 'In Sprint' | 'In Progress' | 'To Do' | 'Ready';

export interface Requirement {
  id: string; // e.g., 'PSE-142'
  type: RequirementType;
  title: string;
  priority: RequirementPriority;
  pts: number;
  status: RequirementStatus;
}

export const INITIAL_REQUIREMENTS: Requirement[] = [
  {
    id: 'PSE-E1',
    type: 'EPIC',
    title: 'Real-time Settlement Engine',
    priority: 'High',
    pts: 89,
    status: 'In Sprint'
  },
  {
    id: 'PSE-142',
    type: 'STORY',
    title: 'Merchant payout webhook delivery',
    priority: 'High',
    pts: 8,
    status: 'In Progress'
  },
  {
    id: 'PSE-143',
    type: 'TASK',
    title: 'Retry queue with exponential backoff',
    priority: 'Med',
    pts: 3,
    status: 'To Do'
  },
  {
    id: 'PSE-144',
    type: 'TASK',
    title: 'Idempotency keys on payout API',
    priority: 'High',
    pts: 2,
    status: 'In Progress'
  },
  {
    id: 'PSE-150',
    type: 'STORY',
    title: 'Reconciliation CSV export',
    priority: 'Med',
    pts: 5,
    status: 'Ready'
  },
  {
    id: 'PSE-E2',
    type: 'EPIC',
    title: 'Partner Bank Sandbox',
    priority: 'Med',
    pts: 34,
    status: 'To Do'
  },
  {
    id: 'PSE-161',
    type: 'STORY',
    title: 'Guided sandbox onboarding flow',
    priority: 'Med',
    pts: 8,
    status: 'To Do'
  },
  {
    id: 'PSE-158',
    type: 'BUG',
    title: 'Settlement total off by rounding paise',
    priority: 'High',
    pts: 2,
    status: 'In Progress'
  },
  {
    id: 'PSE-162',
    type: 'TASK',
    title: 'Mock IdP for sandbox auth',
    priority: 'Low',
    pts: 3,
    status: 'To Do'
  }
];
