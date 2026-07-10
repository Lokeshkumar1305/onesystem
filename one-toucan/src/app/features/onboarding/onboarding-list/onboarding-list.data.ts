export type OnboardingStage = 'Not Started' | 'In Progress' | 'Completed';

export interface OnboardingCandidate {
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  startDate: string;
  stage: OnboardingStage;
  avatarBgVar: string;
  avatarColorVar: string;
}

const AVATAR_PALETTE: Array<[string, string]> = [
  ['--oh-info-bg', '--oh-info'],
  ['--oh-pink-bg', '--oh-pink'],
  ['--oh-success-bg', '--oh-success'],
  ['--oh-violet-bg', '--oh-violet'],
  ['--oh-warning-bg', '--oh-accent-700'],
  ['--oh-primary-soft', '--oh-primary']
];

function avatarFor(index: number): [string, string] {
  return AVATAR_PALETTE[index % AVATAR_PALETTE.length];
}

const RAW_CANDIDATES: Omit<OnboardingCandidate, 'avatarBgVar' | 'avatarColorVar'>[] = [
  {
    name: 'Tara Reddy',
    email: 'tara.reddy@gmail.com',
    role: 'Machine Learning Engineer',
    department: 'Analytics',
    phone: '+91 99001 22334',
    startDate: '01 Jul 2026',
    stage: 'In Progress'
  },
  {
    name: 'Arjun Nair',
    email: 'arjun.nair@gmail.com',
    role: 'Frontend Engineer',
    department: 'Engineering',
    phone: '+91 98220 44110',
    startDate: '08 Jul 2026',
    stage: 'In Progress'
  },
  {
    name: 'Sneha Kulkarni',
    email: 'sneha.k@gmail.com',
    role: 'Product Designer',
    department: 'Design',
    phone: '+91 97400 33221',
    startDate: '15 Jul 2026',
    stage: 'Not Started'
  },
  {
    name: 'Vikram Shetty',
    email: 'vikram.shetty@gmail.com',
    role: 'DevOps Engineer',
    department: 'Engineering',
    phone: '+91 96200 88774',
    startDate: '22 Jun 2026',
    stage: 'Completed'
  },
  {
    name: 'Ananya Joshi',
    email: 'ananya.joshi@gmail.com',
    role: 'Business Analyst',
    department: 'Analytics',
    phone: '+91 95410 11298',
    startDate: '17 Jun 2026',
    stage: 'Completed'
  },
  {
    name: 'Rahul Mehta',
    email: 'rahul.mehta@gmail.com',
    role: 'Sales Executive',
    department: 'Sales',
    phone: '+91 94120 55667',
    startDate: '29 Jun 2026',
    stage: 'Completed'
  },
  {
    name: 'Divya Krishnan',
    email: 'divya.krishnan@gmail.com',
    role: 'HR Generalist',
    department: 'Human Resources',
    phone: '+91 93330 22110',
    startDate: '20 Jul 2026',
    stage: 'Not Started'
  },
  {
    name: 'Karan Malhotra',
    email: 'karan.malhotra@gmail.com',
    role: 'Backend Engineer',
    department: 'Engineering',
    phone: '+91 92110 99887',
    startDate: '10 Jul 2026',
    stage: 'In Progress'
  },
  {
    name: 'Priyanka Das',
    email: 'priyanka.das@gmail.com',
    role: 'QA Engineer',
    department: 'Engineering',
    phone: '+91 91008 77661',
    startDate: '05 Jul 2026',
    stage: 'In Progress'
  },
  {
    name: 'Aditya Rao',
    email: 'aditya.rao@gmail.com',
    role: 'Sales Executive',
    department: 'Sales',
    phone: '+91 90778 34521',
    startDate: '12 Jun 2026',
    stage: 'Completed'
  },
  {
    name: 'Meera Pillai',
    email: 'meera.pillai@gmail.com',
    role: 'Product Designer',
    department: 'Design',
    phone: '+91 89665 12309',
    startDate: '25 Jul 2026',
    stage: 'Not Started'
  },
  {
    name: 'Siddharth Bose',
    email: 'siddharth.bose@gmail.com',
    role: 'Data Analyst',
    department: 'Analytics',
    phone: '+91 88554 90012',
    startDate: '03 Jul 2026',
    stage: 'In Progress'
  }
];

export const ONBOARDING_CANDIDATES: OnboardingCandidate[] = RAW_CANDIDATES.map((c, i) => {
  const [avatarBgVar, avatarColorVar] = avatarFor(i);
  return { ...c, avatarBgVar, avatarColorVar };
});
