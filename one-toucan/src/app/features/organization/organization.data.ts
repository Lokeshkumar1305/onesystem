export interface DepartmentNode {
  id: string;
  name: string;
  head: string;
  headcount: number;
  color: 'green' | 'blue' | 'purple';
  parentId?: string; // Omitted for a root (top-level) department — any department can parent another, to any depth.
}

// A DepartmentNode annotated with its computed depth in the tree (0 = root), used for rendering/indentation.
export interface DepartmentTreeRow extends DepartmentNode {
  level: number;
}

export interface BranchItem {
  code: string;
  name: string;
  type: string;
  headcount: number;
}

export interface CostCenterSpend {
  code: string;
  name: string;
  amount: string;
  progress: number; // Percentage for horizontal bar (e.g. 70)
  color: 'green' | 'blue' | 'orange' | 'purple';
}

export const DEFAULT_DEPARTMENTS: DepartmentNode[] = [
  { id: 'Engineering', name: 'Engineering', head: 'Rahul Menon', headcount: 142, color: 'green' },
  { id: 'PlatformDevOps', name: 'Platform & DevOps', head: 'Nikhil Gupta', headcount: 38, color: 'green', parentId: 'Engineering' },
  { id: 'BackendGuild', name: 'Backend Guild', head: 'Arman Khan', headcount: 54, color: 'green', parentId: 'Engineering' },
  { id: 'PaymentsSquad', name: 'Payments Squad', head: 'Karthik Iyer', headcount: 14, color: 'green', parentId: 'BackendGuild' },
  { id: 'FrontendGuild', name: 'Frontend Guild', head: '— vacant', headcount: 31, color: 'green', parentId: 'Engineering' },
  { id: 'Delivery', name: 'Delivery', head: 'Sneha Iyer', headcount: 96, color: 'blue' },
  { id: 'ProjectManagement', name: 'Project Management', head: 'Sneha Iyer', headcount: 22, color: 'blue', parentId: 'Delivery' },
  { id: 'BusinessAnalysis', name: 'Business Analysis', head: 'Vikram Kapoor', headcount: 18, color: 'blue', parentId: 'Delivery' },
  { id: 'QualityEngineering', name: 'Quality Engineering', head: 'Priya Sharma', headcount: 34, color: 'purple' }
];

export const DEFAULT_BRANCHES: BranchItem[] = [
  { code: 'BLR-01', name: 'Bengaluru HQ', type: 'Flexible', headcount: 198 },
  { code: 'MUM-02', name: 'Mumbai', type: 'Fixed 9–6', headcount: 184 },
  { code: 'PUN-03', name: 'Pune', type: 'Flexible', headcount: 71 },
  { code: 'HYD-04', name: 'Hyderabad', type: 'Shift', headcount: 42 },
  { code: 'REM-00', name: 'Remote - India', type: 'Flexible', headcount: 13 }
];

export const DEFAULT_COST_CENTERS: CostCenterSpend[] = [
  { code: 'CC-ENG', name: 'Engineering OpEx', amount: '₹2.1 Cr', progress: 75, color: 'green' },
  { code: 'CC-DEL', name: 'Delivery — Billable', amount: '₹3.4 Cr', progress: 95, color: 'blue' },
  { code: 'CC-GNA', name: 'G&A / Admin', amount: '₹64 L', progress: 30, color: 'orange' },
  { code: 'CC-RND', name: 'R&D - Innovation', amount: '₹38 L', progress: 15, color: 'purple' }
];
