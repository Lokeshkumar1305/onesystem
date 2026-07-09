import { SparklineColor } from '../../shared/ui/sparkline/sparkline.component';

export interface KpiCard {
  label: string;
  value: string;
  delta: string;
  deltaTone: 'positive' | 'negative';
  sparkline: number[];
  sparklineColor: SparklineColor;
}

export interface RiskProject {
  name: string;
  client: string;
  lead: string;
  health: 'At Risk' | 'Blocked';
  budget: number;
}

export interface AiInsight {
  text: string;
  tags: string;
}

export const KPI_CARDS: KpiCard[] = [
  {
    label: 'Active Projects',
    value: '34',
    delta: '+12%',
    deltaTone: 'positive',
    sparkline: [22, 24, 23, 27, 29, 31, 34],
    sparklineColor: 'success'
  },
  {
    label: 'Billable Utilization',
    value: '79%',
    delta: '+4.1%',
    deltaTone: 'positive',
    sparkline: [68, 70, 71, 73, 75, 77, 79],
    sparklineColor: 'info'
  },
  {
    label: 'Open Risks',
    value: '7',
    delta: '+2',
    deltaTone: 'negative',
    sparkline: [3, 4, 4, 5, 6, 6, 7],
    sparklineColor: 'error'
  },
  {
    label: 'Headcount',
    value: '428',
    delta: '+9',
    deltaTone: 'positive',
    sparkline: [402, 407, 411, 415, 419, 423, 428],
    sparklineColor: 'violet'
  }
];

export const DELIVERY_HEALTH = [
  { label: 'Jan', value: 58 },
  { label: 'Feb', value: 62 },
  { label: 'Mar', value: 60 },
  { label: 'Apr', value: 65 },
  { label: 'May', value: 70 },
  { label: 'Jun', value: 74 },
  { label: 'Jul', value: 79 }
];

export const TOTAL_HEADCOUNT = 428;

export const RESOURCE_ALLOCATION = [
  { label: 'Billable', value: 62, colorVar: '--oh-chart-teal' },
  { label: 'Internal', value: 16, colorVar: '--oh-chart-info' },
  { label: 'Bench', value: 14, colorVar: '--oh-chart-amber' },
  { label: 'On Leave', value: 8, colorVar: '--oh-chart-violet' }
];

export const RISK_PROJECTS: RiskProject[] = [
  { name: 'Atlas Migration', client: 'HDFC Bank', lead: 'R. Menon', health: 'At Risk', budget: 78 },
  { name: 'Falcon Payments', client: 'Razorpay', lead: 'S. Iyer', health: 'Blocked', budget: 94 },
  { name: 'Nimbus Portal', client: 'ICICI Lombard', lead: 'A. Khan', health: 'At Risk', budget: 69 },
  { name: 'Orion Analytics', client: 'PhonePe', lead: 'D. Rao', health: 'Blocked', budget: 88 }
];

export const AI_INSIGHTS: AiInsight[] = [
  {
    text: 'Falcon Payments is trending 6 days over its sprint forecast — 3 blockers unresolved for 48h+.',
    tags: 'PROJECT MGMT · RISK ENGINE'
  },
  {
    text: 'Bench is up 4% this month; 11 backend engineers free to allocate to Atlas Migration.',
    tags: 'RESOURCE ALLOCATION'
  },
  {
    text: 'Q3 timesheet compliance hit 96% — best quarter on record across all branches.',
    tags: 'TIMESHEET MGMT'
  }
];
