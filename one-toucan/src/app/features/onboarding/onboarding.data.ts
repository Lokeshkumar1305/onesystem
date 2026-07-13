export interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  minutesLeft: number;
}

export interface EmergencyContact {
  relation: string;
  name: string;
  phone: string;
}

export type DocumentStatus = 'Verified' | 'In Review' | 'Uploaded' | 'Missing';

export interface OnboardingDocument {
  name: string;
  shortLabel: string;
  required: boolean;
  meta: string;
  status: DocumentStatus;
}

export type CheckStatus = 'Clear' | 'In progress' | 'Pending';

export interface BackgroundCheck {
  name: string;
  meta: string;
  status: CheckStatus;
}

export type AccessBundleId = 'Engineering' | 'Standard' | 'Custom';

export interface AccessBundleOption {
  id: AccessBundleId;
  label: string;
  desc: string;
}

export interface AppAccess {
  name: string;
  meta: string;
  enabled: boolean;
}

export type PrimaryRoleId = 'Engineer' | 'Approver' | 'Admin';

export interface PrimaryRoleOption {
  id: PrimaryRoleId;
  label: string;
  desc: string;
}

export type HardwareStatus = 'Allocated' | 'Pending';

export interface HardwareAsset {
  name: string;
  meta: string;
  status: HardwareStatus;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 1, title: 'Personal Details', subtitle: 'Name, contact, address', minutesLeft: 6 },
  { id: 2, title: 'Role & Department', subtitle: 'Position, team, manager', minutesLeft: 4 },
  { id: 3, title: 'Documents & Compliance', subtitle: 'ID proof, contract, PF', minutesLeft: 3 },
  { id: 4, title: 'System Access', subtitle: 'Apps, roles, devices', minutesLeft: 2 },
  { id: 5, title: 'Review & Invite', subtitle: 'Confirm and send invite', minutesLeft: 1 }
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [{ relation: 'Parent', name: 'Venkateswararao', phone: '+91 98220 11882' }];

export const ONBOARDING_DOCUMENTS: OnboardingDocument[] = [
  { name: 'Aadhaar / National ID', shortLabel: 'Aadhaar', required: true, meta: 'PDF · 1.2 MB · uploaded 24 Jun', status: 'Verified' },
  { name: 'PAN Card', shortLabel: 'PAN', required: true, meta: 'PDF · 480 KB · uploaded 24 Jun', status: 'Verified' },
  { name: 'Signed Offer & Contract', shortLabel: 'Contract', required: true, meta: 'PDF · 2.1 MB · awaiting HR review', status: 'In Review' },
  { name: 'Education Certificates', shortLabel: 'Education', required: true, meta: 'PDF · 3.4 MB · uploaded 25 Jun', status: 'Uploaded' },
  { name: 'Bank & PF (UAN) Details', shortLabel: 'Bank & PF', required: true, meta: 'Not yet provided', status: 'Missing' },
  {
    name: 'Previous Employer Relieving Letter',
    shortLabel: 'Relieving Letter',
    required: false,
    meta: 'Optional · not provided',
    status: 'Missing'
  }
];

export const BACKGROUND_CHECKS: BackgroundCheck[] = [
  { name: 'Identity verification', meta: 'Aadhaar + PAN cross-check', status: 'Clear' },
  { name: 'Employment history', meta: '2 prior employers · AuthBridge', status: 'Clear' },
  { name: 'Education verification', meta: 'B.Tech · IIIT Hyderabad', status: 'In progress' },
  { name: 'Criminal record check', meta: 'Police clearance · pending', status: 'Pending' }
];

export const ACCESS_BUNDLES: AccessBundleOption[] = [
  { id: 'Engineering', label: 'Engineering', desc: '5 apps · GitLab, AWS, Slack...' },
  { id: 'Standard', label: 'Standard', desc: '2 apps · core only' },
  { id: 'Custom', label: 'Custom', desc: 'Pick manually' }
];

export const APP_ACCESS: AppAccess[] = [
  { name: 'Slack', meta: 'Engineering workspace · #analytics', enabled: true },
  { name: 'OneToucan Analytics', meta: 'Read-write · CTO org', enabled: true },
  { name: 'GitLab', meta: 'orion-analytics group · Developer', enabled: true },
  { name: 'AWS Console', meta: 'Dev account · PowerUser', enabled: true },
  { name: 'Confluence / Wiki', meta: 'Engineering space · Editor', enabled: true },
  { name: 'Spira', meta: 'ORN board · Member', enabled: false }
];

export const PRIMARY_ROLES: PrimaryRoleOption[] = [
  { id: 'Engineer', label: 'Engineer', desc: 'Code, deploy to dev, read prod' },
  { id: 'Approver', label: 'Approver', desc: 'Approve leave & timesheets' },
  { id: 'Admin', label: 'Admin', desc: 'Full org configuration' }
];

export const HARDWARE_ASSETS: HardwareAsset[] = [
  { name: 'MacBook Pro 14" M3', meta: 'Asset TPI-LAP-2291 · ready for pickup', status: 'Allocated' },
  { name: 'Dell 27" Monitor', meta: 'Asset TPI-MON-0884', status: 'Allocated' },
  { name: 'Company SIM', meta: 'Pending IT provisioning', status: 'Pending' }
];

// All 28 states plus the 8 union territories, as commonly listed together in Indian address forms.
export const INDIAN_STATES: string[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];
