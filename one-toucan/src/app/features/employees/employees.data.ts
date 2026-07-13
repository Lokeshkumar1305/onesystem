export interface EmployeeRecord {
  name: string;
  department: string;
  role: string;
  location: string;
  utilization: string;
  status: 'Active' | 'On Leave' | 'Notice';
  avatarBgVar: string;
  avatarColorVar: string;
}

export const EMPLOYEES_DATA: EmployeeRecord[] = [
  {
    name: 'Rahul Menon',
    department: 'Engineering',
    role: 'Engineering Lead',
    location: 'Bengaluru',
    utilization: '92%',
    status: 'Active',
    avatarBgVar: '--oh-success-bg',
    avatarColorVar: '--oh-success'
  },
  {
    name: 'Sneha Iyer',
    department: 'Delivery',
    role: 'Sr. Project Manager',
    location: 'Mumbai',
    utilization: '88%',
    status: 'Active',
    avatarBgVar: '--oh-info-bg',
    avatarColorVar: '--oh-info'
  },
  {
    name: 'Arman Khan',
    department: 'Engineering',
    role: 'Backend Engineer',
    location: 'Pune',
    utilization: '76%',
    status: 'Active',
    avatarBgVar: '--oh-violet-bg',
    avatarColorVar: '--oh-violet'
  },
  {
    name: 'Divya Rao',
    department: 'Analytics',
    role: 'Data Analyst',
    location: 'Hyderabad',
    utilization: '81%',
    status: 'On Leave',
    avatarBgVar: '--oh-pink-bg',
    avatarColorVar: '--oh-pink'
  },
  {
    name: 'Vikram Kapoor',
    department: 'Delivery',
    role: 'Business Analyst',
    location: 'Bengaluru',
    utilization: '64%',
    status: 'Active',
    avatarBgVar: '--oh-warning-bg',
    avatarColorVar: '--oh-accent-700'
  },
  {
    name: 'Priya Sharma',
    department: 'Quality',
    role: 'QA Engineer',
    location: 'Remote',
    utilization: '90%',
    status: 'Active',
    avatarBgVar: '--oh-info-bg',
    avatarColorVar: '--oh-info'
  },
  {
    name: 'Nikhil Gupta',
    department: 'Platform',
    role: 'DevOps Engineer',
    location: 'Pune',
    utilization: '85%',
    status: 'Notice',
    avatarBgVar: '--oh-violet-bg',
    avatarColorVar: '--oh-violet'
  },
  {
    name: 'Ananya Mehta',
    department: 'Design',
    role: 'UX Designer',
    location: 'Mumbai',
    utilization: '72%',
    status: 'Active',
    avatarBgVar: '--oh-pink-bg',
    avatarColorVar: '--oh-pink'
  }
];
