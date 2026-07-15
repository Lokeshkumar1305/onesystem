export type AllocationLevel = 0 | 1 | 2 | 3 | 4;

export interface Resource {
  name: string;
  role: string;
  initials: string;
  avatarBgVar: string;
  avatarColorVar: string;
  weeklyLoad: AllocationLevel[]; // Array of 5 elements corresponding to Mon, Tue, Wed, Thu, Fri
}

export interface BenchedEmployee {
  name: string;
  skills: string;
  benchDays: number;
  initials: string;
  avatarBgVar: string;
  avatarColorVar: string;
}

export const INITIAL_ACTIVE_RESOURCES: Resource[] = [
  {
    name: 'Rahul Menon',
    role: 'Eng Lead',
    initials: 'RM',
    avatarBgVar: '--oh-primary-soft',
    avatarColorVar: '--oh-primary',
    weeklyLoad: [4, 3, 4, 4, 1]
  },
  {
    name: 'Arman Khan',
    role: 'Backend',
    initials: 'AK',
    avatarBgVar: '--oh-violet-bg',
    avatarColorVar: '--oh-violet',
    weeklyLoad: [3, 4, 4, 3, 3]
  },
  {
    name: 'Priya Sharma',
    role: 'QA',
    initials: 'PS',
    avatarBgVar: '--oh-info-bg',
    avatarColorVar: '--oh-info',
    weeklyLoad: [1, 1, 3, 4, 4]
  },
  {
    name: 'Nikhil Gupta',
    role: 'DevOps',
    initials: 'NG',
    avatarBgVar: '--oh-pink-bg',
    avatarColorVar: '--oh-pink',
    weeklyLoad: [4, 4, 3, 1, 1]
  },
  {
    name: 'Vikram Kapoor',
    role: 'BA',
    initials: 'VK',
    avatarBgVar: '--oh-success-bg',
    avatarColorVar: '--oh-success',
    weeklyLoad: [1, 1, 1, 1, 0]
  }
];

export const INITIAL_BENCH_RESOURCES: BenchedEmployee[] = [
  {
    name: 'Sameer Malik',
    skills: 'React · Node · AWS',
    benchDays: 12,
    initials: 'SM',
    avatarBgVar: '--oh-info-bg',
    avatarColorVar: '--oh-info'
  },
  {
    name: 'Tara Reddy',
    skills: 'Python · ML · GCP',
    benchDays: 8,
    initials: 'TR',
    avatarBgVar: '--oh-violet-bg',
    avatarColorVar: '--oh-violet'
  },
  {
    name: 'Jay Desai',
    skills: 'Java · Spring · K8s',
    benchDays: 5,
    initials: 'JD',
    avatarBgVar: '--oh-pink-bg',
    avatarColorVar: '--oh-pink'
  }
];
