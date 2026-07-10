export interface KpiCard {
  label: string;
  value: string;
  icon: string;
  cardBgVar: string;
  iconBgVar: string;
}

export interface RiskProject {
  name: string;
  client: string;
  lead: string;
  health: 'At Risk' | 'Blocked';
  budget: number;
  trend: number;
}

export interface TrendPoint {
  label: string;
  actual: number;
  target: number;
}

export interface ApprovalRecord {
  project: string;
  description: string;
  method: string;
  status: 'Success' | 'Pending';
  amount: string;
}

export const KPI_CARDS: KpiCard[] = [
  {
    label: 'Active Projects',
    value: '34',
    icon: 'kanban',
    cardBgVar: '--oh-success-bg',
    iconBgVar: '--oh-success'
  },
  {
    label: 'Billable Utilization',
    value: '79%',
    icon: 'bar-chart',
    cardBgVar: '--oh-info-bg',
    iconBgVar: '--oh-info'
  },
  {
    label: 'Open Risks',
    value: '7',
    icon: 'exclamation-triangle',
    cardBgVar: '--oh-warning-bg',
    iconBgVar: '--oh-chart-amber'
  },
  {
    label: 'Headcount',
    value: '428',
    icon: 'people',
    cardBgVar: '--oh-violet-bg',
    iconBgVar: '--oh-violet'
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
  { name: 'Atlas Migration', client: 'HDFC Bank', lead: 'R. Menon', health: 'At Risk', budget: 78, trend: 3.2 },
  { name: 'Falcon Payments', client: 'Razorpay', lead: 'S. Iyer', health: 'Blocked', budget: 94, trend: -1.8 },
  { name: 'Nimbus Portal', client: 'ICICI Lombard', lead: 'A. Khan', health: 'At Risk', budget: 69, trend: 1.5 },
  { name: 'Orion Analytics', client: 'PhonePe', lead: 'D. Rao', health: 'Blocked', budget: 88, trend: -4.0 }
];

// "Delivery vs Target" — utilization actual vs the quarter's planned goal, per month.
export const DELIVERY_VS_TARGET: TrendPoint[] = [
  { label: 'Jan', actual: 58, target: 60 },
  { label: 'Feb', actual: 62, target: 63 },
  { label: 'Mar', actual: 60, target: 65 },
  { label: 'Apr', actual: 65, target: 68 },
  { label: 'May', actual: 70, target: 70 },
  { label: 'Jun', actual: 74, target: 73 },
  { label: 'Jul', actual: 79, target: 76 }
];

// Full-year view of the same actual-vs-target utilization trend.
export const YTD_DELIVERY_VS_TARGET: TrendPoint[] = [
  { label: 'Jan', actual: 52, target: 55 },
  { label: 'Feb', actual: 56, target: 57 },
  { label: 'Mar', actual: 54, target: 59 },
  { label: 'Apr', actual: 60, target: 61 },
  { label: 'May', actual: 65, target: 63 },
  { label: 'Jun', actual: 63, target: 66 },
  { label: 'Jul', actual: 68, target: 68 },
  { label: 'Aug', actual: 72, target: 70 },
  { label: 'Sep', actual: 70, target: 73 },
  { label: 'Oct', actual: 75, target: 75 },
  { label: 'Nov', actual: 73, target: 78 },
  { label: 'Dec', actual: 79, target: 80 }
];

export const RECENT_APPROVALS: ApprovalRecord[] = [
  {
    project: 'Atlas Migration',
    description: 'Q3 budget consolidated',
    method: 'Finance Review',
    status: 'Success',
    amount: '₹38,50,000'
  },
  {
    project: 'Falcon Payments',
    description: 'Sprint overrun approved',
    method: 'PMO Approval',
    status: 'Success',
    amount: '₹35,75,000'
  },
  {
    project: 'Nimbus Portal',
    description: 'Resource reallocation',
    method: 'Manager Approval',
    status: 'Success',
    amount: '₹32,20,000'
  },
  {
    project: 'Orion Analytics',
    description: 'Contingency spend request',
    method: 'Finance Review',
    status: 'Pending',
    amount: '₹4,50,000'
  }
];
