import { CommonModule } from '@angular/common';
import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import {
  INITIAL_LOG_ENTRIES,
  INITIAL_TEAM_MEMBERS,
  LogEntry,
  TeamAttendance
} from './attendance.data';

@Component({
  selector: 'oh-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent implements OnInit, OnDestroy {
  // Navigation Tabs: 'personal' (My Attendance) or 'team' (Team Attendance)
  readonly activeTab = signal<'personal' | 'team'>('personal');

  // Personal View Logs Subtabs: 'logs' | 'calendar' | 'requests'
  readonly logsSubTab = signal<'logs' | 'calendar' | 'requests'>('logs');

  // 12/24 hour display config
  readonly use24HourFormat = signal(false);

  // Time-range filter for Personal Log: '30days' | 'jun' | 'may' | 'apr'
  readonly activeMonthFilter = signal<string>('30days');

  // Real-time ticking Clock
  readonly clockTime = signal<string>('');
  private timerInterval: any;

  // Personal Check-In status
  readonly isCheckedIn = signal(true);
  readonly checkInTime = signal<string>('09:02 AM');
  readonly checkInElapsed = signal<string>('8h 12m');
  checkInDateTime: Date | null = new Date(new Date().getTime() - (8 * 60 * 60 * 1000 + 12 * 60 * 1000));

  // Mock Logs and Team members list
  readonly personalLogs = signal<LogEntry[]>(INITIAL_LOG_ENTRIES);
  readonly teamMembers = signal<TeamAttendance[]>(INITIAL_TEAM_MEMBERS);

  // Live Team metrics
  readonly teamMetrics = computed(() => {
    const list = this.teamMembers();
    const present = list.filter(m => m.status === 'Present' || m.status === 'Late').length;
    const leave = list.filter(m => m.status === 'On Leave').length;
    const late = list.filter(m => m.status === 'Late').length;
    const avgHrs = list.length > 0 ? (list.reduce((acc, curr) => acc + curr.hours, 0) / list.length).toFixed(1) : '0.0';
    return { present, leave, late, avgHrs };
  });

  // Search filter for team
  readonly teamSearchQuery = signal<string>('');
  readonly filteredTeam = computed(() => {
    const query = this.teamSearchQuery().toLowerCase().trim();
    const list = this.teamMembers();
    if (!query) return list;
    return list.filter(
      m =>
        m.name.toLowerCase().includes(query) ||
        m.location.toLowerCase().includes(query) ||
        m.status.toLowerCase().includes(query)
    );
  });

  // Active calendar navigation month & year signals
  readonly currentMonth = signal<number>(6); // 6 = July (0-indexed)
  readonly currentYear = signal<number>(2026);

  readonly monthLabel = computed(() => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${monthNames[this.currentMonth()]} ${this.currentYear()}`;
  });

  // Calendar days grid list mapping (includes previous & next month dates)
  readonly calendarDays = computed(() => {
    const month = this.currentMonth();
    const year = this.currentYear();
    
    const days: { dayNumber: number; dateStr: string; isWeekend: boolean; isCurrentMonth: boolean; log?: LogEntry }[] = [];
    
    const startDay = this.getStartDayOfWeek(year, month);
    const totalDays = this.getDaysInMonth(year, month);
    
    // Previous month details
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevTotalDays = this.getDaysInMonth(prevYear, prevMonth);
    
    // 1. Add previous month dates (styled gray)
    for (let i = startDay - 1; i >= 0; i--) {
      const d = prevTotalDays - i;
      const dayName = this.getDayName(d, prevYear, prevMonth);
      const dateStr = `${dayName}, ${d.toString().padStart(2, '0')} ${this.getMonthAbbr(prevMonth)}`;
      const isWeekend = dayName === 'Sat' || dayName === 'Sun';
      
      days.push({
        dayNumber: d,
        dateStr,
        isWeekend,
        isCurrentMonth: false
      });
    }
    
    const logs = this.personalLogs();
    
    // 2. Add current month dates
    for (let d = 1; d <= totalDays; d++) {
      const dayName = this.getDayName(d, year, month);
      const dateStr = `${dayName}, ${d.toString().padStart(2, '0')} ${this.getMonthAbbr(month)}`;
      const isWeekend = dayName === 'Sat' || dayName === 'Sun';
      
      const log = logs.find(l => 
        l.date.includes(`${d.toString().padStart(2, '0')} ${this.getMonthAbbr(month)}`) || 
        l.date.includes(`${d} ${this.getMonthAbbr(month)}`)
      );
      
      days.push({
        dayNumber: d,
        dateStr,
        isWeekend,
        isCurrentMonth: true,
        log
      });
    }
    
    // 3. Add next month dates (styled gray)
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const totalSlots = Math.ceil(days.length / 7) * 7;
    const nextDaysNeeded = totalSlots - days.length;
    
    for (let d = 1; d <= nextDaysNeeded; d++) {
      const dayName = this.getDayName(d, nextYear, nextMonth);
      const dateStr = `${dayName}, ${d.toString().padStart(2, '0')} ${this.getMonthAbbr(nextMonth)}`;
      const isWeekend = dayName === 'Sat' || dayName === 'Sun';
      
      days.push({
        dayNumber: d,
        dateStr,
        isWeekend,
        isCurrentMonth: false
      });
    }
    
    return days;
  });

  // Row Action Context Menu state
  readonly activeMenuRowDate = signal<string | null>(null);

  // Request side drawers
  readonly showRegularizeDrawer = signal(false);
  readonly showLeaveDrawer = signal(false);
  readonly selectedLogDate = signal<string>('');

  readonly regularizeForm: FormGroup;
  readonly leaveForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.regularizeForm = this.fb.group({
      timeIn: ['09:00 AM', Validators.required],
      timeOut: ['06:00 PM', Validators.required],
      reason: ['', Validators.required]
    });

    this.leaveForm = this.fb.group({
      leaveType: ['Casual', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.updateClock();
    this.timerInterval = setInterval(() => {
      this.updateClock();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    document.body.classList.remove('oh-modal-open');
  }

  updateClock(): void {
    const now = new Date();
    if (this.use24HourFormat()) {
      const pad = (n: number) => n.toString().padStart(2, '0');
      this.clockTime.set(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    } else {
      this.clockTime.set(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    }

    // Update live elapsed timer
    if (this.isCheckedIn() && this.checkInDateTime) {
      const diffMs = now.getTime() - this.checkInDateTime.getTime();
      const diffHrs = Math.floor(diffMs / (3600 * 1000));
      const diffMins = Math.floor((diffMs % (3600 * 1000)) / (60 * 1000));
      this.checkInElapsed.set(`${diffHrs}h ${diffMins}m`);
    }
  }

  prevMonth(): void {
    this.currentMonth.update(m => {
      if (m === 0) {
        this.currentYear.update(y => y - 1);
        return 11;
      }
      return m - 1;
    });
  }

  nextMonth(): void {
    this.currentMonth.update(m => {
      if (m === 11) {
        this.currentYear.update(y => y + 1);
        return 0;
      }
      return m + 1;
    });
  }

  toggleCheckIn(): void {
    this.isCheckedIn.update(state => {
      const nextState = !state;
      if (nextState) {
        this.checkInDateTime = new Date();
        const now = new Date();
        this.checkInTime.set(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
        this.checkInElapsed.set('0h 0m');
      } else {
        this.checkInDateTime = null;
        this.checkInTime.set('');
        this.checkInElapsed.set('—');
      }
      return nextState;
    });
  }

  toggle24Hour(checked: boolean): void {
    this.use24HourFormat.set(checked);
    this.updateClock();
  }

  // Row Menu handlers
  toggleRowMenu(date: string, event: MouseEvent): void {
    event.stopPropagation();
    this.activeMenuRowDate.update(curr => (curr === date ? null : date));
  }

  closeRowMenu(): void {
    this.activeMenuRowDate.set(null);
  }

  // Open Regularize Drawer
  openRegularize(date: string): void {
    this.selectedLogDate.set(date);
    this.regularizeForm.reset({
      timeIn: '09:00 AM',
      timeOut: '06:00 PM',
      reason: ''
    });
    this.showRegularizeDrawer.set(true);
    this.closeRowMenu();
    document.body.classList.add('oh-modal-open');
  }

  // Open Leave Drawer
  openLeaveRequest(date: string): void {
    this.selectedLogDate.set(date);
    
    // Convert e.g. "Fri, 10 Jul" to a date format "2026-07-10"
    const parsedDate = this.parseDateString(date);

    this.leaveForm.reset({
      leaveType: 'Casual',
      startDate: parsedDate,
      endDate: parsedDate,
      reason: ''
    });
    this.showLeaveDrawer.set(true);
    this.closeRowMenu();
    document.body.classList.add('oh-modal-open');
  }

  closeDrawers(): void {
    this.showRegularizeDrawer.set(false);
    this.showLeaveDrawer.set(false);
    document.body.classList.remove('oh-modal-open');
  }

  submitRegularization(): void {
    if (this.regularizeForm.invalid) {
      this.regularizeForm.markAllAsTouched();
      return;
    }
    
    const date = this.selectedLogDate();
    const val = this.regularizeForm.value;

    alert(`Regularization request submitted for ${date} (In: ${val.timeIn}, Out: ${val.timeOut})`);
    
    // Update local state: let's update the row with effective hours!
    this.personalLogs.update(logs =>
      logs.map(log => {
        if (log.date === date) {
          return {
            ...log,
            effectiveHours: '9h 0m',
            breakTaken: '1h 0m',
            grossHours: '10h 0m',
            timelineSegments: [
              { type: 'work', widthPct: 40 },
              { type: 'break', widthPct: 10 },
              { type: 'work', widthPct: 50 }
            ]
          };
        }
        return log;
      })
    );

    this.closeDrawers();
  }

  submitLeave(): void {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }

    const val = this.leaveForm.value;
    alert(`Leave request submitted successfully (${val.leaveType} leave from ${val.startDate} to ${val.endDate})`);
    
    // If personal log matches the leave, update it!
    const logDate = this.selectedLogDate();
    this.personalLogs.update(logs =>
      logs.map(log => {
        if (log.date === logDate) {
          return {
            ...log,
            effectiveHours: 'Leave',
            breakTaken: '—',
            grossHours: '—',
            timelineSegments: []
          };
        }
        return log;
      })
    );

    this.closeDrawers();
  }

  private parseDateString(dateStr: string): string {
    // Expects "Tue, 14 Jul" or similar, returns "2026-07-14"
    try {
      const parts = dateStr.split(' ');
      if (parts.length < 3) return '';
      const day = parts[1].padStart(2, '0');
      const monthStr = parts[2].toLowerCase();
      let month = '07';
      if (monthStr.startsWith('jan')) month = '01';
      else if (monthStr.startsWith('feb')) month = '02';
      else if (monthStr.startsWith('mar')) month = '03';
      else if (monthStr.startsWith('apr')) month = '04';
      else if (monthStr.startsWith('may')) month = '05';
      else if (monthStr.startsWith('jun')) month = '06';
      else if (monthStr.startsWith('jul')) month = '07';
      
      return `2026-${month}-${day}`;
    } catch {
      return '';
    }
  }

  private getDayName(day: number, year: number, month: number): string {
    const date = new Date(year, month, day);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  }

  private getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  private getStartDayOfWeek(year: number, month: number): number {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Map to Monday=0... Sunday=6
  }

  private getMonthAbbr(month: number): string {
    const abbrs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return abbrs[month];
  }
}
