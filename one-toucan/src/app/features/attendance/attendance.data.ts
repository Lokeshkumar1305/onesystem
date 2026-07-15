export interface TimelineSegment {
  type: 'work' | 'break';
  widthPct: number;
}

export interface LogEntry {
  date: string;
  isWeekend: boolean;
  effectiveHours: string;
  breakTaken: string;
  grossHours: string;
  timelineSegments?: TimelineSegment[];
}

export interface TeamAttendance {
  name: string;
  avatar: string;
  initials: string;
  location: 'Office' | 'Remote' | 'Hybrid' | 'Leave';
  inTime: string;
  outTime: string;
  hours: number;
  status: 'Present' | 'Late' | 'On Leave' | 'Absent';
  avatarBgVar: string;
  avatarColorVar: string;
}

export const INITIAL_LOG_ENTRIES: LogEntry[] = [
  {
    date: 'Tue, 14 Jul',
    isWeekend: false,
    effectiveHours: '0h 0m+',
    breakTaken: '0h 0m',
    grossHours: '0h 0m+',
    timelineSegments: []
  },
  {
    date: 'Mon, 13 Jul',
    isWeekend: false,
    effectiveHours: '8h 38m',
    breakTaken: '0h 29m',
    grossHours: '9h 8m',
    timelineSegments: [
      { type: 'work', widthPct: 45 },
      { type: 'break', widthPct: 5 },
      { type: 'work', widthPct: 50 }
    ]
  },
  {
    date: 'Sun, 12 Jul',
    isWeekend: true,
    effectiveHours: '0h 0m',
    breakTaken: '0h 0m',
    grossHours: '0h 0m'
  },
  {
    date: 'Sat, 11 Jul',
    isWeekend: true,
    effectiveHours: '0h 0m',
    breakTaken: '0h 0m',
    grossHours: '0h 0m'
  },
  {
    date: 'Fri, 10 Jul',
    isWeekend: false,
    effectiveHours: '8h 14m',
    breakTaken: '0h 30m',
    grossHours: '8h 44m',
    timelineSegments: [
      { type: 'work', widthPct: 30 },
      { type: 'break', widthPct: 8 },
      { type: 'work', widthPct: 62 }
    ]
  },
  {
    date: 'Thu, 09 Jul',
    isWeekend: false,
    effectiveHours: '8h 50m',
    breakTaken: '0h 0m',
    grossHours: '8h 50m',
    timelineSegments: [
      { type: 'work', widthPct: 100 }
    ]
  },
  {
    date: 'Wed, 08 Jul',
    isWeekend: false,
    effectiveHours: '8h 9m',
    breakTaken: '0h 27m',
    grossHours: '8h 36m',
    timelineSegments: [
      { type: 'work', widthPct: 50 },
      { type: 'break', widthPct: 10 },
      { type: 'work', widthPct: 40 }
    ]
  },
  {
    date: 'Tue, 07 Jul',
    isWeekend: false,
    effectiveHours: '9h 4m',
    breakTaken: '0h 19m',
    grossHours: '9h 23m',
    timelineSegments: [
      { type: 'work', widthPct: 60 },
      { type: 'break', widthPct: 5 },
      { type: 'work', widthPct: 35 }
    ]
  },
  {
    date: 'Mon, 06 Jul',
    isWeekend: false,
    effectiveHours: '8h 56m',
    breakTaken: '0h 18m',
    grossHours: '9h 14m',
    timelineSegments: [
      { type: 'work', widthPct: 40 },
      { type: 'break', widthPct: 6 },
      { type: 'work', widthPct: 54 }
    ]
  },
  {
    date: 'Sun, 05 Jul',
    isWeekend: true,
    effectiveHours: '0h 0m',
    breakTaken: '0h 0m',
    grossHours: '0h 0m'
  },
  {
    date: 'Sat, 04 Jul',
    isWeekend: true,
    effectiveHours: '0h 0m',
    breakTaken: '0h 0m',
    grossHours: '0h 0m'
  },
  {
    date: 'Fri, 03 Jul',
    isWeekend: false,
    effectiveHours: '1h 19m',
    breakTaken: '0h 0m',
    grossHours: '1h 19m',
    timelineSegments: [
      { type: 'work', widthPct: 15 }
    ]
  },
  {
    date: 'Thu, 02 Jul',
    isWeekend: false,
    effectiveHours: '8h 49m',
    breakTaken: '0h 0m',
    grossHours: '8h 49m',
    timelineSegments: [
      { type: 'work', widthPct: 100 }
    ]
  },
  {
    date: 'Wed, 01 Jul',
    isWeekend: false,
    effectiveHours: '8h 16m',
    breakTaken: '0h 14m',
    grossHours: '8h 30m',
    timelineSegments: [
      { type: 'work', widthPct: 70 },
      { type: 'break', widthPct: 5 },
      { type: 'work', widthPct: 25 }
    ]
  },
  {
    date: 'Tue, 30 Jun',
    isWeekend: false,
    effectiveHours: '9h 19m',
    breakTaken: '0h 28m',
    grossHours: '9h 47m',
    timelineSegments: [
      { type: 'work', widthPct: 45 },
      { type: 'break', widthPct: 7 },
      { type: 'work', widthPct: 48 }
    ]
  }
];

export const INITIAL_TEAM_MEMBERS: TeamAttendance[] = [
  {
    name: 'Rahul Menon',
    avatar: 'RM',
    initials: 'RM',
    location: 'Office',
    inTime: '09:02 AM',
    outTime: '—',
    hours: 8.2,
    status: 'Present',
    avatarBgVar: '--oh-primary-soft',
    avatarColorVar: '--oh-primary'
  },
  {
    name: 'Arman Khan',
    avatar: 'AK',
    initials: 'AK',
    location: 'Remote',
    inTime: '09:48 AM',
    outTime: '—',
    hours: 7.4,
    status: 'Late',
    avatarBgVar: '--oh-violet-bg',
    avatarColorVar: '--oh-violet'
  },
  {
    name: 'Priya Sharma',
    avatar: 'PS',
    initials: 'PS',
    location: 'Office',
    inTime: '08:51 AM',
    outTime: '—',
    hours: 8.5,
    status: 'Present',
    avatarBgVar: '--oh-info-bg',
    avatarColorVar: '--oh-info'
  },
  {
    name: 'Divya Rao',
    avatar: 'DR',
    initials: 'DR',
    location: 'Leave',
    inTime: '—',
    outTime: '—',
    hours: 0.0,
    status: 'On Leave',
    avatarBgVar: '--oh-success-bg',
    avatarColorVar: '--oh-success'
  },
  {
    name: 'Nikhil Gupta',
    avatar: 'NG',
    initials: 'NG',
    location: 'Hybrid',
    inTime: '09:15 AM',
    outTime: '—',
    hours: 7.9,
    status: 'Present',
    avatarBgVar: '--oh-pink-bg',
    avatarColorVar: '--oh-pink'
  },
  {
    name: 'Vikram Kapoor',
    avatar: 'VK',
    initials: 'VK',
    location: 'Office',
    inTime: '—',
    outTime: '—',
    hours: 0.0,
    status: 'Absent',
    avatarBgVar: '--oh-warning-bg',
    avatarColorVar: '--oh-warning'
  }
];
