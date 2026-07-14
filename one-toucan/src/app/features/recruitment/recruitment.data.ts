export interface CandidateCard {
  id: string;
  name: string;
  role: string;
  source: string;
  referredBy?: string;
  agencyName?: string;
  match: number;
  initials: string;
  avatarColor: 'blue' | 'purple' | 'pink' | 'teal';
}

export interface RecruitmentColumn {
  id: string;
  name: string;
  bulletColor: 'gray' | 'blue' | 'purple' | 'green';
  totalCount: number;
  candidates: CandidateCard[];
}

export interface RecruitmentKpi {
  title: string;
  value: number;
  colorClass: 'green' | 'blue' | 'purple' | 'orange';
}

export const RECRUITMENT_KPIS: RecruitmentKpi[] = [
  { title: 'Open Requisitions', value: 17, colorClass: 'green' },
  { title: 'In Pipeline', value: 84, colorClass: 'blue' },
  { title: 'Interviews / wk', value: 12, colorClass: 'purple' },
  { title: 'Offers Out', value: 5, colorClass: 'orange' }
];

export const INITIAL_COLUMNS: RecruitmentColumn[] = [
  {
    id: 'applied',
    name: 'Applied',
    bulletColor: 'gray',
    totalCount: 42,
    candidates: [
      {
        id: 'c1',
        name: 'Aditya Verma',
        role: 'Backend Engineer',
        source: 'Portal',
        match: 82,
        initials: 'AV',
        avatarColor: 'blue'
      },
      {
        id: 'c2',
        name: 'Meera Nair',
        role: 'QA Engineer',
        source: 'Referral',
        referredBy: 'Sneha Iyer',
        match: 76,
        initials: 'MN',
        avatarColor: 'purple'
      },
      {
        id: 'c3',
        name: 'Karan Shah',
        role: 'DevOps',
        source: 'Agency',
        agencyName: 'TechForce',
        match: 71,
        initials: 'KS',
        avatarColor: 'pink'
      }
    ]
  },
  {
    id: 'screening',
    name: 'Screening',
    bulletColor: 'blue',
    totalCount: 18,
    candidates: [
      {
        id: 'c4',
        name: 'Ishaan Roy',
        role: 'Frontend Engineer',
        source: 'Referral',
        referredBy: 'Nikhil Gupta',
        match: 88,
        initials: 'IR',
        avatarColor: 'teal'
      },
      {
        id: 'c5',
        name: 'Sara Khan',
        role: 'Data Analyst',
        source: 'Portal',
        match: 79,
        initials: 'SK',
        avatarColor: 'blue'
      }
    ]
  },
  {
    id: 'interview',
    name: 'Interview',
    bulletColor: 'purple',
    totalCount: 14,
    candidates: [
      {
        id: 'c6',
        name: 'Rohit Das',
        role: 'Backend Engineer',
        source: 'Referral',
        referredBy: 'Karthik Iyer',
        match: 91,
        initials: 'RD',
        avatarColor: 'purple'
      },
      {
        id: 'c7',
        name: 'Anjali Pillai',
        role: 'Product Designer',
        source: 'Portal',
        match: 85,
        initials: 'AP',
        avatarColor: 'pink'
      }
    ]
  },
  {
    id: 'offer',
    name: 'Offer',
    bulletColor: 'green',
    totalCount: 5,
    candidates: [
      {
        id: 'c8',
        name: 'Dev Malhotra',
        role: 'Sr. Engineer',
        source: 'Referral',
        referredBy: 'Rahul Menon',
        match: 94,
        initials: 'DM',
        avatarColor: 'teal'
      }
    ]
  }
];
