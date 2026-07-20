export interface ProjectCard {
  id: string;
  type: 'FEATURE' | 'BUG' | 'CHORE' | 'SECURITY';
  title: string;
  points: number;
  assigneeInitials: string;
  assigneeColorClass: string;
  priorityDotColor: 'green' | 'yellow' | 'red';
}

export interface ProjectColumn {
  id: string;
  name: string;
  bulletColor: string;
  cards: ProjectCard[];
}

export interface TeamMember {
  initials: string;
  name: string;
  role: string;
  allocation: number; // percentage
  avatarColor: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: 'BRD' | 'Architecture' | 'User Guide' | 'CTO Review' | 'Other';
  url: string;
  addedBy: string;
  addedDate: string;
}

export interface KtSession {
  id: string;
  topic: string;
  host: string;
  date: string;
  attendees: string;
  recordingUrl: string;
  status: 'Scheduled' | 'Completed' | 'Pending Review';
}

export interface DemoItem {
  id: string;
  title: string;
  date: string;
  audience: string;
  recordingUrl: string;
  ctoFeedback: string;
  status: 'Approved' | 'Requires Changes' | 'Pending Review';
}

export interface AtlasRequirement {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  pts: number;
  status: 'In Sprint' | 'In Progress' | 'To Do' | 'Ready';
}

export interface AtlasUserStory {
  id: string;
  title: string;
  estimation: number; // Story points
  priority: 'High' | 'Medium' | 'Low';
  status: 'Backlog' | 'Sprint Backlog' | 'In Progress' | 'Done';
}

export interface AtlasTask {
  id: string;
  title: string;
  assignee: string;
  status: 'To Do' | 'In Progress' | 'Done';
}

export interface AtlasTestCase {
  id: string;
  title: string;
  description: string;
  linkedRequirementId?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Run' | 'Passed' | 'Failed' | 'Blocked';
}

export interface AtlasBug {
  id: string;
  title: string;
  severity: 'Critical' | 'Major' | 'Minor' | 'Trivial';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Fixed' | 'Reopened' | 'Closed';
  reportedBy: string;
}

export interface ResourcePoolMember {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  role: string;
  skills: string[];
  experienceYears: number;
  previousProjects: string[];
  status: 'available' | 'allocated';
  currentAllocation?: string;
}

export interface ProjectProposal {
  id: string;
  name: string;
  isModule: boolean;
  customType?: string;
  parentProjectId?: string;
  description: string;
  stage: 'ideation' | 'ideation_approval' | 'brd' | 'brd_approval' | 'creation' | 'allocation' | 'completed';
  ideation: {
    title: string;
    description: string;
    valueProps: string;
    submittedBy: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    comments: string;
  };
  brd: {
    title: string;
    description: string;
    documentUrl: string;
    scope: string;
    outOfScope: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    comments: string;
  };
  creation: {
    key: string;
    client: string;
    budget: string;
    methodology: 'scrum' | 'kanban' | 'waterfall';
  };
  team: TeamMember[];
}

export interface ActiveProject {
  id: string;
  name: string;
  key: string;
  client: string;
  description: string;
  isModule: boolean;
  customType?: string;
  parentProjectName?: string;
  // Lifecycle status — drives the Developer's Tech Doc upload gate (Atlas):
  // uploads are only allowed once a project has been marked 'completed'.
  status: 'active' | 'completed';
  board: ProjectColumn[];
  team: TeamMember[];
  documents: DocumentItem[];
  ktSessions: KtSession[];
  demos: DemoItem[];
  requirements: AtlasRequirement[];
  userStories: AtlasUserStory[];
  tasks: AtlasTask[];
  testCases: AtlasTestCase[];
  bugs: AtlasBug[];
}

// Initial active projects dataset
export const INITIAL_ACTIVE_PROJECTS: ActiveProject[] = [
  {
    id: 'PRJ-001',
    name: 'Atlas Migration',
    key: 'ATL',
    client: 'Razorpay',
    description: 'Migration of legacy settlement systems to the event-driven Atlas pipeline.',
    isModule: false,
    status: 'active',
    board: [
      {
        id: 'backlog',
        name: 'Backlog',
        bulletColor: '#6b7280',
        cards: [
          {
            id: 'ATL-241',
            type: 'FEATURE',
            title: 'Reconciliation report CSV export',
            points: 3,
            assigneeInitials: 'RM',
            assigneeColorClass: 'oh-avatar-circle--blue',
            priorityDotColor: 'green'
          },
          {
            id: 'ATL-238',
            type: 'CHORE',
            title: 'Audit log retention config',
            points: 2,
            assigneeInitials: 'SK',
            assigneeColorClass: 'oh-avatar-circle--purple',
            priorityDotColor: 'yellow'
          },
          {
            id: 'ATL-235',
            type: 'FEATURE',
            title: 'Bulk user import via SCIM',
            points: 5,
            assigneeInitials: 'AK',
            assigneeColorClass: 'oh-avatar-circle--pink',
            priorityDotColor: 'yellow'
          }
        ]
      },
      {
        id: 'in-progress',
        name: 'In Progress',
        bulletColor: '#2563eb',
        cards: [
          {
            id: 'ATL-229',
            type: 'FEATURE',
            title: 'Permission matrix CRUD grid',
            points: 8,
            assigneeInitials: 'PN',
            assigneeColorClass: 'oh-avatar-circle--teal',
            priorityDotColor: 'red'
          },
          {
            id: 'ATL-231',
            type: 'SECURITY',
            title: 'Session monitor — revoke JWT',
            points: 5,
            assigneeInitials: 'DR',
            assigneeColorClass: 'oh-avatar-circle--blue',
            priorityDotColor: 'red'
          }
        ]
      },
      {
        id: 'in-review',
        name: 'In Review',
        bulletColor: '#d97706',
        cards: [
          {
            id: 'ATL-219',
            type: 'BUG',
            title: 'SSO — SAML assertion parse',
            points: 3,
            assigneeInitials: 'RM',
            assigneeColorClass: 'oh-avatar-circle--blue',
            priorityDotColor: 'red'
          }
        ]
      },
      {
        id: 'done',
        name: 'Done',
        bulletColor: '#16a34a',
        cards: [
          {
            id: 'ATL-210',
            type: 'FEATURE',
            title: 'Login — remember device',
            points: 2,
            assigneeInitials: 'SK',
            assigneeColorClass: 'oh-avatar-circle--purple',
            priorityDotColor: 'green'
          }
        ]
      }
    ],
    team: [
      { initials: 'RM', name: 'Rahul Menon', role: 'Project Lead', allocation: 100, avatarColor: 'blue' },
      { initials: 'SK', name: 'Sneha Kulkarni', role: 'Developer', allocation: 100, avatarColor: 'purple' },
      { initials: 'AK', name: 'Arman Khan', role: 'QA Tester', allocation: 50, avatarColor: 'pink' },
      { initials: 'VK', name: 'Vikram Kapoor', role: 'Business Analyst', allocation: 50, avatarColor: 'teal' }
    ],
    documents: [
      { id: 'DOC-001', name: 'Atlas Core Architecture Spec', category: 'Architecture', url: 'https://docs.google.com/spec/1', addedBy: 'Rahul Menon', addedDate: '2026-07-01' },
      { id: 'DOC-002', name: 'Business Requirements (BRD v2.4)', category: 'BRD', url: 'https://docs.google.com/brd/1', addedBy: 'CTO Office', addedDate: '2026-06-25' }
    ],
    ktSessions: [
      { id: 'KT-001', topic: 'Event Stream Setup & Kafka Brokers', host: 'Rahul Menon', date: '2026-07-10', attendees: 'Sneha K., Arman K.', recordingUrl: 'https://loom.com/kt/kafka-stream', status: 'Completed' },
      { id: 'KT-002', topic: 'SSO Integration & Auth Handshakes', host: 'CTO (Lokesh K.)', date: '2026-07-22', attendees: 'All Engineers', recordingUrl: 'https://loom.com/kt/sso-handshake', status: 'Scheduled' }
    ],
    demos: [
      { id: 'DEM-001', title: 'Sprint 12 Core APIs & Admin Console', date: '2026-07-08', audience: 'CTO & Stakeholders', recordingUrl: 'https://loom.com/demo/s12', ctoFeedback: 'Approved. Looks very fast. Keep working on SCIM integration.', status: 'Approved' },
      { id: 'DEM-002', title: 'CSV Reconciliations UI Prototype', date: '2026-07-19', audience: 'Product Manager Review', recordingUrl: 'https://loom.com/demo/csv-recon', ctoFeedback: 'Refine CSV boundary cases. Requires changes.', status: 'Requires Changes' }
    ],
    requirements: [
      { id: 'REQ-001', title: 'Export settlement reports to CSV with dynamic columns', priority: 'High', pts: 5, status: 'In Sprint' },
      { id: 'REQ-002', title: 'SSO Login Integration via Okta & SAML 2.0', priority: 'High', pts: 8, status: 'In Progress' },
      { id: 'REQ-003', title: 'Automated retry trigger for failed Kafka batches', priority: 'Medium', pts: 3, status: 'To Do' }
    ],
    userStories: [
      { id: 'US-001', title: 'As a financial admin, I want to download CSV exports so that I can audit payouts', estimation: 5, priority: 'High', status: 'In Progress' },
      { id: 'US-002', title: 'As a user, I want to authenticate via SAML SSO to log in securely', estimation: 8, priority: 'High', status: 'In Progress' }
    ],
    tasks: [
      { id: 'TSK-001', title: 'Design DB schema for user export logging', assignee: 'Rahul Menon', status: 'Done' },
      { id: 'TSK-002', title: 'Implement SAML assertion parser unit tests', assignee: 'Sneha Kulkarni', status: 'In Progress' },
      { id: 'TSK-003', title: 'Configure retention properties in Kafka topics', assignee: 'Rahul Menon', status: 'To Do' }
    ],
    testCases: [
      { id: 'TC-ATL-1', title: 'Verify CSV export includes all dynamic columns', description: 'Export a settlement report and confirm every configured column appears with correct values.', linkedRequirementId: 'REQ-001', priority: 'High', status: 'Passed' },
      { id: 'TC-ATL-2', title: 'SAML SSO login rejects expired assertions', description: 'Attempt login with an expired SAML assertion and confirm the request is rejected with a clear error.', linkedRequirementId: 'REQ-002', priority: 'High', status: 'Failed' }
    ],
    bugs: [
      { id: 'BUG-ATL-1', title: 'Settlement total off by rounding paise', severity: 'Critical', priority: 'High', status: 'In Progress', reportedBy: 'Arman Khan' },
      { id: 'BUG-ATL-2', title: 'Webhook retries duplicate payout events', severity: 'Major', priority: 'High', status: 'Open', reportedBy: 'Arman Khan' }
    ]
  },
  {
    id: 'PRJ-002',
    name: 'Billing Engine',
    key: 'BIL',
    client: 'Razorpay',
    description: 'Sub-module for managing subscriptions, billing cycles, and invoice rendering.',
    isModule: true,
    status: 'active',
    parentProjectName: 'Atlas Migration',
    board: [
      {
        id: 'backlog',
        name: 'Backlog',
        bulletColor: '#6b7280',
        cards: [
          {
            id: 'BIL-104',
            type: 'FEATURE',
            title: 'Stripe webhook listener module',
            points: 5,
            assigneeInitials: 'SI',
            assigneeColorClass: 'oh-avatar-circle--teal',
            priorityDotColor: 'yellow'
          }
        ]
      },
      {
        id: 'in-progress',
        name: 'In Progress',
        bulletColor: '#2563eb',
        cards: [
          {
            id: 'BIL-102',
            type: 'FEATURE',
            title: 'Invoice PDF generator layout',
            points: 3,
            assigneeInitials: 'PN',
            assigneeColorClass: 'oh-avatar-circle--purple',
            priorityDotColor: 'green'
          }
        ]
      },
      {
        id: 'in-review',
        name: 'In Review',
        bulletColor: '#d97706',
        cards: []
      },
      {
        id: 'done',
        name: 'Done',
        bulletColor: '#16a34a',
        cards: []
      }
    ],
    team: [
      { initials: 'PN', name: 'Prerna Nair', role: 'Developer', allocation: 100, avatarColor: 'teal' },
      { initials: 'SI', name: 'Sneha Iyer', role: 'Developer', allocation: 100, avatarColor: 'blue' }
    ],
    documents: [
      { id: 'DOC-003', name: 'Billing Pipeline Design Schema', category: 'Architecture', url: 'https://docs.google.com/spec/billing', addedBy: 'Prerna Nair', addedDate: '2026-07-05' }
    ],
    ktSessions: [],
    demos: [],
    requirements: [
      { id: 'REQ-011', title: 'Generate high-fidelity PDF invoices dynamically', priority: 'High', pts: 3, status: 'In Progress' }
    ],
    userStories: [
      { id: 'US-011', title: 'As a customer, I want to download invoice PDFs to print them for files', estimation: 3, priority: 'Medium', status: 'In Progress' }
    ],
    tasks: [
      { id: 'TSK-011', title: 'Style the invoice PDF using pdf-lib', assignee: 'Prerna Nair', status: 'In Progress' }
    ],
    testCases: [
      { id: 'TC-BIL-1', title: 'Invoice PDF renders correct line items and totals', description: 'Generate an invoice PDF for a multi-line subscription and verify totals match the billing ledger.', linkedRequirementId: 'REQ-011', priority: 'Medium', status: 'Not Run' }
    ],
    bugs: [
      { id: 'BUG-BIL-1', title: 'CSV export truncates merchant names with commas', severity: 'Major', priority: 'Medium', status: 'Fixed', reportedBy: 'Karthik Iyer' }
    ]
  },
  {
    id: 'PRJ-003',
    name: 'OneHR Portal',
    key: 'OHR',
    client: 'Internal',
    description: 'Core organizational management dashboard for tracking employee details, leave, and resources.',
    isModule: false,
    status: 'active',
    board: [
      {
        id: 'backlog',
        name: 'Backlog',
        bulletColor: '#6b7280',
        cards: []
      },
      {
        id: 'in-progress',
        name: 'In Progress',
        bulletColor: '#2563eb',
        cards: []
      },
      {
        id: 'in-review',
        name: 'In Review',
        bulletColor: '#d97706',
        cards: []
      },
      {
        id: 'done',
        name: 'Done',
        bulletColor: '#16a34a',
        cards: []
      }
    ],
    team: [
      { initials: 'LK', name: 'Lokesh Kanuboina', role: 'Product Lead', allocation: 20, avatarColor: 'blue' }
    ],
    documents: [],
    ktSessions: [],
    demos: [],
    requirements: [],
    userStories: [],
    tasks: [],
    testCases: [],
    bugs: []
  }
];

// Initial project proposals/pipeline dataset
export const INITIAL_PROPOSALS: ProjectProposal[] = [
  {
    id: 'PROP-001',
    name: 'Global Search & Indexing Service',
    isModule: true,
    parentProjectId: 'PRJ-001',
    description: 'A centralized elasticsearch index that syncs updates across employees, projects, and requirements for fast prefix searching.',
    stage: 'brd_approval',
    ideation: {
      title: 'Global Search Indexer',
      description: 'Provides quick, system-wide search functionality to enhance navigation.',
      valueProps: 'Improves onboarding discovery rates and productivity by ~20%. Avoids duplicate employee checks.',
      submittedBy: 'Sneha Kulkarni',
      status: 'Approved',
      comments: 'Excellent ideation. Let\'s proceed with the Business Requirements Specification immediately.'
    },
    brd: {
      title: 'Elasticsearch Search Rails Specification',
      description: 'Defines replication pipelines from PostgreSQL using Kafka CDC connect to Elasticsearch cluster.',
      documentUrl: 'https://docs.google.com/brd/search-indexing',
      scope: 'Index database tables (employees, profile, projects, tasks). Expose REST API with authorization headers.',
      outOfScope: 'Log indexation, full-text file attachment parsing (pdf, docx).',
      status: 'Pending',
      comments: 'Need CTO review on query performance constraints.'
    },
    creation: {
      key: 'GSI',
      client: 'Razorpay',
      budget: '12,000',
      methodology: 'scrum'
    },
    team: []
  },
  {
    id: 'PROP-002',
    name: 'AI-driven Performance Reviews',
    isModule: false,
    description: 'Leverages Gemini models to compile peer feedback, Git activity, and self-assessments into high-quality quarterly reviews.',
    stage: 'ideation_approval',
    ideation: {
      title: 'AI Automated Appraisals',
      description: 'Analyze manager reviews, developer PR metrics, and peer logs to build feedback outlines.',
      valueProps: 'Reduces performance appraisal cycles for team managers from 8 hours per employee to 30 minutes.',
      submittedBy: 'Prerna Nair',
      status: 'Pending',
      comments: ''
    },
    brd: {
      title: '',
      description: '',
      documentUrl: '',
      scope: '',
      outOfScope: '',
      status: 'Pending',
      comments: ''
    },
    creation: {
      key: 'APR',
      client: 'Internal',
      budget: '25,000',
      methodology: 'kanban'
    },
    team: []
  }
];

export const INITIAL_BOARD = INITIAL_ACTIVE_PROJECTS[0].board;

// Resource pool used in Step 6 (Team Allocation) of the proposal wizard
export const RESOURCE_POOL: ResourcePoolMember[] = [
  {
    id: 'EMP-101',
    name: 'Sameer Malik',
    initials: 'SM',
    avatarColor: 'blue',
    role: 'Developer',
    skills: ['React', 'Node.js', 'AWS'],
    experienceYears: 3,
    previousProjects: ['Payments Gateway Revamp', 'Vendor Onboarding Portal'],
    status: 'available'
  },
  {
    id: 'EMP-102',
    name: 'Tara Reddy',
    initials: 'TR',
    avatarColor: 'purple',
    role: 'Developer',
    skills: ['Python', 'Machine Learning', 'GCP'],
    experienceYears: 5,
    previousProjects: ['AI Performance Insights', 'Fraud Detection Engine'],
    status: 'available'
  },
  {
    id: 'EMP-103',
    name: 'Jay Desai',
    initials: 'JD',
    avatarColor: 'pink',
    role: 'Developer',
    skills: ['Java', 'Spring Boot', 'Kubernetes'],
    experienceYears: 6,
    previousProjects: ['Core Banking Migration', 'Atlas Migration'],
    status: 'available'
  },
  {
    id: 'EMP-104',
    name: 'Ananya Rao',
    initials: 'AR',
    avatarColor: 'teal',
    role: 'UI/UX Designer',
    skills: ['Figma', 'Design Systems', 'User Research'],
    experienceYears: 2,
    previousProjects: ['OneHR Portal Redesign'],
    status: 'available'
  },
  {
    id: 'EMP-105',
    name: 'Karthik Iyer',
    initials: 'KI',
    avatarColor: 'blue',
    role: 'QA Tester',
    skills: ['Selenium', 'QA Automation', 'API Testing'],
    experienceYears: 4,
    previousProjects: ['Billing Engine', 'SSO Integration Suite'],
    status: 'available'
  },
  {
    id: 'EMP-111',
    name: 'Vikram Kapoor',
    initials: 'VK',
    avatarColor: 'teal',
    role: 'Business Analyst',
    skills: ['Requirements Gathering', 'Stakeholder Interviews', 'JIRA'],
    experienceYears: 5,
    previousProjects: ['Atlas Migration', 'Vendor Onboarding Portal'],
    status: 'allocated',
    currentAllocation: 'Atlas Migration'
  },
  {
    id: 'EMP-106',
    name: 'Sneha Kulkarni',
    initials: 'SK',
    avatarColor: 'purple',
    role: 'Developer',
    skills: ['Node.js', 'Kafka', 'PostgreSQL'],
    experienceYears: 4,
    previousProjects: ['Loyalty Rewards Engine', 'Settlement Reconciliation'],
    status: 'allocated',
    currentAllocation: 'Atlas Migration'
  },
  {
    id: 'EMP-107',
    name: 'Arman Khan',
    initials: 'AK',
    avatarColor: 'pink',
    role: 'QA Tester',
    skills: ['Manual QA', 'Regression Testing', 'JIRA'],
    experienceYears: 3,
    previousProjects: ['Bulk SCIM Import', 'Session Monitor'],
    status: 'allocated',
    currentAllocation: 'Atlas Migration'
  },
  {
    id: 'EMP-108',
    name: 'Prerna Nair',
    initials: 'PN',
    avatarColor: 'teal',
    role: 'Developer',
    skills: ['Angular', 'PDF Generation', 'Stripe API'],
    experienceYears: 3,
    previousProjects: ['Invoice PDF Generator'],
    status: 'allocated',
    currentAllocation: 'Billing Engine'
  },
  {
    id: 'EMP-109',
    name: 'Sneha Iyer',
    initials: 'SI',
    avatarColor: 'blue',
    role: 'Developer',
    skills: ['Node.js', 'Webhooks', 'Stripe API'],
    experienceYears: 2,
    previousProjects: ['Billing Engine'],
    status: 'allocated',
    currentAllocation: 'Billing Engine'
  },
  {
    id: 'EMP-110',
    name: 'Lokesh Kanuboina',
    initials: 'LK',
    avatarColor: 'blue',
    role: 'Project Lead',
    skills: ['Product Strategy', 'Stakeholder Management'],
    experienceYears: 8,
    previousProjects: ['OneHR Portal', 'Atlas Migration'],
    status: 'allocated',
    currentAllocation: 'OneHR Portal'
  }
];
