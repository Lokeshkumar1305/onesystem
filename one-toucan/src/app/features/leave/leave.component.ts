import { CommonModule } from '@angular/common';
import { Component, computed, signal, effect, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

export interface LeaveBalance {
  type: string;
  total: any; // number or string ('No Limit')
  available: any;
  consumed: number;
  accentColor: string;
  bgColor: string;
  percentUsed: number;
  icon: string;
  lightAccent: string;
  accrued?: number;
  carryover?: number;
}

export interface LeaveRequest {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  note: string;
  appliedDate: string;
}

export interface Holiday {
  name: string;
  date: string;
  day: string;
  cardBg: string;
}

@Component({
  selector: 'oh-leave',
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
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.scss'
})
export class LeaveComponent {
  // State management signals
  readonly leaveBalances = signal<LeaveBalance[]>([
    {
      type: 'Annual Leave',
      total: 12,
      available: 11,
      consumed: 8,
      accrued: 9,
      carryover: 10,
      accentColor: '#0d9488', // Teal
      bgColor: '#ccfbf1',
      percentUsed: Math.round((8 / 12) * 100),
      icon: 'bi-calendar3',
      lightAccent: 'rgba(13, 148, 136, 0.04)'
    },
    {
      type: 'Sick Leave',
      total: 12,
      available: 4,
      consumed: 3,
      accrued: 7,
      accentColor: '#2563eb', // Blue
      bgColor: '#dbeafe',
      percentUsed: Math.round((3 / 12) * 100),
      icon: 'bi-heart-pulse',
      lightAccent: 'rgba(37, 99, 235, 0.04)'
    },
    {
      type: 'Unpaid Leave',
      total: 'No Limit',
      available: 'No Limit',
      consumed: 0,
      accentColor: '#7c3aed', // Purple
      bgColor: '#ede9fe',
      percentUsed: 0,
      icon: 'bi-cash-stack',
      lightAccent: 'rgba(124, 58, 237, 0.04)'
    },
    {
      type: 'Bereavement Leave',
      total: 5,
      available: 5,
      consumed: 0,
      accentColor: '#ea580c', // Orange
      bgColor: '#ffedd5',
      percentUsed: 0,
      icon: 'bi-heart-fill',
      lightAccent: 'rgba(234, 88, 12, 0.04)'
    },
    {
      type: 'Paternity Leave',
      total: 10,
      available: 10,
      consumed: 0,
      accentColor: '#db2777', // Pink/Rose
      bgColor: '#fce7f3',
      percentUsed: 0,
      icon: 'bi-people-fill',
      lightAccent: 'rgba(219, 39, 119, 0.04)'
    }
  ]);

  readonly leaveRequests = signal<LeaveRequest[]>([
    {
      id: 'REQ-001',
      leaveType: 'Casual Leave',
      startDate: '2026-06-24',
      endDate: '2026-06-25',
      days: 2,
      status: 'Pending',
      note: 'Family emergency / personal work at home.',
      appliedDate: '2026-06-20'
    },
    {
      id: 'REQ-002',
      leaveType: 'Earned Leave',
      startDate: '2026-07-10',
      endDate: '2026-07-14',
      days: 5,
      status: 'Approved',
      note: 'Planned summer vacation with family.',
      appliedDate: '2026-07-02'
    },
    {
      id: 'REQ-003',
      leaveType: 'Sick Leave',
      startDate: '2026-06-02',
      endDate: '2026-06-02',
      days: 1,
      status: 'Approved',
      note: 'Routine medical appointment.',
      appliedDate: '2026-06-01'
    }
  ]);

  readonly upcomingHolidays = signal<Holiday[]>([
    {
      name: 'Ganesh Chaturthi',
      date: '14 Sep 2026',
      day: 'Monday',
      cardBg: 'linear-gradient(135deg, #f43f5e 0%, #db2777 100%)'
    },
    {
      name: 'Gandhi Jayanti',
      date: '02 Oct 2026',
      day: 'Friday',
      cardBg: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
    },
    {
      name: 'Dussehra',
      date: '20 Oct 2026',
      day: 'Tuesday',
      cardBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
    {
      name: 'Diwali Festival',
      date: '09 Nov 2026',
      day: 'Monday',
      cardBg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
    },
    {
      name: 'Christmas',
      date: '25 Dec 2026',
      day: 'Friday',
      cardBg: 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
    }
  ]);

  readonly onlyUpcomingHolidays = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.upcomingHolidays().filter(hol => {
      const holDate = new Date(hol.date);
      return holDate >= today;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  readonly activeHolidayIndex = signal<number>(0);

  readonly activeHoliday = computed(() => {
    const list = this.onlyUpcomingHolidays();
    if (list.length === 0) return null;
    return list[this.activeHolidayIndex()];
  });

  prevHoliday(): void {
    const current = this.activeHolidayIndex();
    const total = this.onlyUpcomingHolidays().length;
    if (total === 0) return;
    this.activeHolidayIndex.set((current - 1 + total) % total);
  }

  nextHoliday(): void {
    const current = this.activeHolidayIndex();
    const total = this.onlyUpcomingHolidays().length;
    if (total === 0) return;
    this.activeHolidayIndex.set((current + 1) % total);
  }

  // Sidebar drawers controls
  readonly showApplyDrawer = signal(false);

  // Filters State
  readonly searchFilter = signal<string>('');
  readonly typeFilter = signal<string>('All');
  readonly statusFilter = signal<string>('All');

  // Computed Filtered requests
  readonly filteredRequests = computed(() => {
    const list = this.leaveRequests();
    const query = this.searchFilter().toLowerCase().trim();
    const type = this.typeFilter();
    const status = this.statusFilter();

    return list.filter(req => {
      const matchesSearch = req.note.toLowerCase().includes(query) || req.leaveType.toLowerCase().includes(query);
      const matchesType = type === 'All' || req.leaveType === type;
      const matchesStatus = status === 'All' || req.status === status;
      return matchesSearch && matchesType && matchesStatus;
    });
  });

  // Apply Leave form group
  readonly leaveForm: FormGroup;

  // Track calculated duration in drawer
  readonly formDuration = signal<number>(0);

  constructor(
    private readonly fb: FormBuilder,
    private readonly el: ElementRef
  ) {
    this.leaveForm = this.fb.group({
      leaveType: ['Annual Leave', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required]
    });

    // Reactive effect to scroll the active holiday in the bottom list into view
    effect(() => {
      const activeIdx = this.activeHolidayIndex();
      setTimeout(() => {
        const activeElem = this.el.nativeElement.querySelector(`#oh-holiday-item-${activeIdx}`);
        if (activeElem) {
          activeElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 50);
    });

    // Listen to form value changes to calculate requested days duration dynamically
    this.leaveForm.valueChanges.subscribe(val => {
      if (val.startDate && val.endDate) {
        const start = new Date(val.startDate);
        const end = new Date(val.endDate);
        if (end >= start) {
          const diffMs = end.getTime() - start.getTime();
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
          this.formDuration.set(diffDays);
        } else {
          this.formDuration.set(0);
        }
      } else {
        this.formDuration.set(0);
      }
    });
  }

  // Open apply leave drawer
  openApplyDrawer(): void {
    this.leaveForm.reset({
      leaveType: 'Annual Leave',
      startDate: '',
      endDate: '',
      reason: ''
    });
    this.formDuration.set(0);
    this.showApplyDrawer.set(true);
    document.body.classList.add('oh-modal-open');
  }

  closeApplyDrawer(): void {
    this.showApplyDrawer.set(false);
    document.body.classList.remove('oh-modal-open');
  }

  // Submit leave request handler
  submitLeaveRequest(): void {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }

    const val = this.leaveForm.value;
    const requestedDays = this.formDuration();

    if (requestedDays <= 0) {
      alert('End date must be on or after start date.');
      return;
    }

    const toDateString = (dateVal: any): string => {
      if (!dateVal) return '';
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return '';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const startStr = toDateString(val.startDate);
    const endStr = toDateString(val.endDate);

    // Check balance availability
    const selectedType = val.leaveType;
    const balances = this.leaveBalances();
    const balanceItem = balances.find(b => b.type === selectedType);

    if (balanceItem && balanceItem.available < requestedDays) {
      alert(`Insufficient balance! You only have ${balanceItem.available} days of ${selectedType} left, but you requested ${requestedDays} days.`);
      return;
    }

    // Deduct days from local balance signals in real-time
    this.leaveBalances.update(items =>
      items.map(b => {
        if (b.type === selectedType) {
          const nextAvail = b.available - requestedDays;
          const nextCons = b.consumed + requestedDays;
          return {
            ...b,
            available: nextAvail,
            consumed: nextCons,
            percentUsed: Math.round((nextCons / b.total) * 100)
          };
        }
        return b;
      })
    );

    // Append new log entry to history signals
    const todayStr = new Date().toISOString().split('T')[0];
    const newRequest: LeaveRequest = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      leaveType: selectedType,
      startDate: startStr,
      endDate: endStr,
      days: requestedDays,
      status: 'Pending',
      note: val.reason,
      appliedDate: todayStr
    };

    this.leaveRequests.update(list => [newRequest, ...list]);

    // Close drawer
    this.closeApplyDrawer();
  }

  // Cancel pending request helper
  cancelRequest(id: string): void {
    const list = this.leaveRequests();
    const request = list.find(r => r.id === id);
    if (!request) return;

    if (request.status !== 'Pending') {
      alert('Only pending requests can be cancelled.');
      return;
    }

    if (confirm(`Are you sure you want to cancel this pending leave request (${request.leaveType}: ${request.days} days)?`)) {
      // Refund balance
      this.leaveBalances.update(items =>
        items.map(b => {
          if (b.type === request.leaveType) {
            const nextAvail = b.available + request.days;
            const nextCons = b.consumed - request.days;
            return {
              ...b,
              available: nextAvail,
              consumed: nextCons,
              percentUsed: Math.round((nextCons / b.total) * 100)
            };
          }
          return b;
        })
      );

      // Remove from request list or mark as Rejected/Cancelled
      this.leaveRequests.update(list =>
        list.map(r => {
          if (r.id === id) {
            return { ...r, status: 'Rejected', note: `${r.note} (Cancelled by employee)` };
          }
          return r;
        })
      );
    }
  }

  // Formatting date string helper
  formatDateStr(dateStr: string): string {
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }
}
