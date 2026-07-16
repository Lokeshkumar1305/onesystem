import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal, computed, effect, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { CurrentUserService } from '../../core/auth/current-user.service';
import { AnnouncementsComponent } from '../announcements/announcements.component';

export interface Holiday {
  name: string;
  date: string;
  day: string;
  cardBg: string;
}

export interface FeedPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  timeAgo: string;
  content: string;
  likes: number;
  commentsCount: number;
  comments: { author: string; content: string }[];
  hasLiked?: boolean;
  type?: 'Post' | 'Badge' | 'Reward' | 'Endorse';
  badgeName?: string;
  badgeIcon?: string;
}

export interface UpcomingBirthday {
  name: string;
  avatar: string;
  date: string;
  isToday?: boolean;
}

@Component({
  selector: 'oh-onehr-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatSlideToggleModule,
    AnnouncementsComponent
  ],
  templateUrl: './onehr-dashboard.component.html',
  styleUrl: './onehr-dashboard.component.scss'
})
export class OnehrDashboardComponent implements OnInit, OnDestroy {
  currentTime = new Date();
  private timerId: any;

  attendanceMarked = signal<boolean>(false);
  lastPunchTime = signal<string>('Thursday, December 14');

  activeComposeTab: 'Post' | 'Badge' | 'Reward' | 'Endorse skill' = 'Post';
  activeScope: 'Organization' | 'Development' = 'Organization';
  activeCelebrateTab: 'Birthdays' | 'Anniversaries' | 'Joinees' = 'Birthdays';
  isCelebrateCardExpanded = signal<boolean>(true);

  activeSubView = signal<'dashboard' | 'announcements'>('dashboard');
  announcementsList = signal<any[]>([]);

  onAnnouncementPublished(ann: any): void {
    this.announcementsList.update(list => [ann, ...list]);
    this.activeSubView.set('dashboard');
  }

  newPostText = '';

  // ---- Comments & emoji picker -------------------------------------------------------
  private readonly openCommentsFor = signal<ReadonlySet<string>>(new Set());
  private readonly emojiPickerOpenFor = signal<string | null>(null);
  readonly activeEmojiCategory = signal<string>('smileys');
  readonly commentDrafts: Record<string, string> = {};

  readonly emojiCategories: { key: string; icon: string; emojis: string[] }[] = [
    {
      key: 'smileys',
      icon: 'emoji-smile',
      emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥']
    },
    {
      key: 'animals',
      icon: 'bug',
      emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐔', '🐧', '🐦', '🐤', '🦆', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝']
    },
    {
      key: 'food',
      icon: 'cup-hot',
      emojis: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍞']
    },
    {
      key: 'travel',
      icon: 'airplane',
      emojis: ['🚗', '🚕', '🚙', '🚌', '🚓', '🚑', '🚒', '🚚', '🚲', '🛵', '✈️', '🚀', '🚁', '🚢', '⛵', '🚂', '🚉', '🗺️', '🏔️', '🏖️', '🏝️', '🌋', '🏕️', '🗽', '🗼', '🏰', '🎡', '🎢', '🌍', '🌎']
    },
    {
      key: 'activities',
      icon: 'controller',
      emojis: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥅', '⛳', '🎯', '🎳', '🎮', '🎲', '🎸', '🎧', '🎤', '🎨', '🎭', '🎬', '🎼', '🎹', '🥇', '🏆', '🎖️', '🎗️', '🎫', '🎟️']
    },
    {
      key: 'symbols',
      icon: 'heart',
      emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '✅', '❌']
    }
  ];

  readonly activeEmojiList = computed(
    () => this.emojiCategories.find(c => c.key === this.activeEmojiCategory())?.emojis ?? []
  );

  isCommentsOpen(postId: string): boolean {
    return this.openCommentsFor().has(postId);
  }

  toggleComments(post: FeedPost): void {
    this.openCommentsFor.update(set => {
      const next = new Set(set);
      if (next.has(post.id)) {
        next.delete(post.id);
      } else {
        next.add(post.id);
      }
      return next;
    });
  }

  isEmojiPickerOpen(postId: string): boolean {
    return this.emojiPickerOpenFor() === postId;
  }

  toggleEmojiPicker(postId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.emojiPickerOpenFor.update(cur => (cur === postId ? null : postId));
  }

  @HostListener('document:click')
  private closeEmojiPickerOnOutsideClick(): void {
    if (this.emojiPickerOpenFor() !== null) {
      this.emojiPickerOpenFor.set(null);
    }
  }

  setCommentDraft(postId: string, value: string): void {
    this.commentDrafts[postId] = value;
  }

  insertEmoji(postId: string, emoji: string): void {
    this.commentDrafts[postId] = (this.commentDrafts[postId] || '') + emoji;
  }

  submitComment(post: FeedPost): void {
    const text = (this.commentDrafts[post.id] || '').trim();
    if (!text) {
      return;
    }
    this.feedPosts.update(posts =>
      posts.map(p =>
        p.id === post.id
          ? { ...p, commentsCount: p.commentsCount + 1, comments: [...p.comments, { author: this.userFullName, content: text }] }
          : p
      )
    );
    this.commentDrafts[post.id] = '';
    this.emojiPickerOpenFor.set(null);
  }

  initialsOf(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) {
      return '?';
    }
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  upcomingBirthdays: UpcomingBirthday[] = [
    { name: 'Siva Venkata', avatar: 'SV', date: 'Tomorrow' },
    { name: 'Akshitha', avatar: 'AK', date: '18 July' },
    { name: 'Alekhya', avatar: 'AL', date: '18 July' },
    { name: 'Sarthak', avatar: 'SA', date: '18 July' },
    { name: 'Deva Siva', avatar: 'DS', date: '20 July' },
    { name: 'Srinivasa Raj', avatar: 'SR', date: '22 July' }
  ];

  upcomingAnniversaries: UpcomingBirthday[] = [
    { name: 'Siva', avatar: 'SY', date: '18 July' },
    { name: 'Alekhya', avatar: 'AP', date: '18 July' },
    { name: 'Sai Krishna', avatar: 'SB', date: '18 July' },
    { name: 'Pavan', avatar: 'P', date: '22 July' }
  ];

  recentJoinees: UpcomingBirthday[] = [
    { name: 'Hari Sankar', avatar: 'HS', date: '09 July' },
    { name: 'Sreenivasa', avatar: 'SS', date: '13 July' },
    { name: 'Vinod Kumar', avatar: 'VK', date: '14 July' }
  ];

  feedPosts = signal<FeedPost[]>([
    {
      id: '1',
      authorName: 'Subrahmanyeswararao Karri',
      authorAvatar: 'SK',
      authorRole: 'Delivery Manager',
      timeAgo: '13 days ago',
      content: 'Happy work anniversary! Naveen Vallarapu',
      likes: 5,
      commentsCount: 1,
      comments: [
        { author: 'Lokesh Kanuboina', content: 'Happy anniversary Naveen!' }
      ],
      hasLiked: false
    },
    {
      id: '2',
      authorName: 'Neha Verma',
      authorAvatar: 'NV',
      authorRole: 'Support Specialist',
      timeAgo: '4 days ago',
      content: 'Thank you for making the team more productive by making the employees happy. Highly appreciate the support!',
      likes: 12,
      commentsCount: 0,
      comments: [],
      hasLiked: true,
      type: 'Badge',
      badgeName: 'MAKING WORK FUN'
    },
    {
      id: '3',
      authorName: 'Vijay Kumar',
      authorAvatar: 'VK',
      authorRole: 'Senior Engineer',
      timeAgo: '5 days ago',
      content: 'Thank you for assisting on the recent project. It only goes to show how dedicatedly you want to achieve the best for the company.',
      likes: 8,
      commentsCount: 0,
      comments: [],
      hasLiked: false,
      type: 'Badge',
      badgeName: 'TEAM PLAYER'
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

  constructor(
    private readonly currentUser: CurrentUserService,
    private readonly router: Router,
    private readonly el: ElementRef
  ) {
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
  }

  goToAttendance(): void {
    this.router.navigateByUrl('/attendance');
  }

  goToLeave(): void {
    this.router.navigateByUrl('/leave');
  }

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

  ngOnInit(): void {
    this.timerId = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  get userFullName(): string {
    return this.currentUser.fullName();
  }

  get userFirstName(): string {
    return this.currentUser.fullName().split(' ')[0];
  }

  get userInitials(): string {
    return this.currentUser.initials();
  }

  get formattedDate(): string {
    return this.currentTime.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  get formattedTime(): string {
    return this.currentTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  markAttendance(): void {
    this.attendanceMarked.set(true);
    const now = new Date();
    this.lastPunchTime.set(
      now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) +
      ' at ' +
      now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    );
  }

  submitPost(): void {
    if (!this.newPostText.trim()) return;
    const newPost: FeedPost = {
      id: Math.random().toString(),
      authorName: this.userFullName,
      authorAvatar: this.userInitials,
      authorRole: 'CTO · Admin',
      timeAgo: 'Just now',
      content: this.newPostText,
      likes: 0,
      commentsCount: 0,
      comments: [],
      hasLiked: false,
      type: this.activeComposeTab === 'Badge' ? 'Badge' : 
            this.activeComposeTab === 'Reward' ? 'Reward' : 'Post',
      badgeName: this.activeComposeTab === 'Badge' ? 'KUDOS BADGE' : undefined
    };
    this.feedPosts.update(posts => [newPost, ...posts]);
    this.newPostText = '';
  }

  toggleLike(post: FeedPost): void {
    this.feedPosts.update(posts =>
      posts.map(p => {
        if (p.id === post.id) {
          const hasLiked = !p.hasLiked;
          return {
            ...p,
            hasLiked,
            likes: hasLiked ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      })
    );
  }

  readonly calendarViewDate = signal<Date>(this.startOfMonth(new Date()));

  private startOfMonth(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  get calendarMonthLabel(): string {
    return this.calendarViewDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  prevMonth(): void {
    const d = this.calendarViewDate();
    this.calendarViewDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const d = this.calendarViewDate();
    this.calendarViewDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  goToCurrentMonth(): void {
    this.calendarViewDate.set(this.startOfMonth(new Date()));
  }

  get calendarDays(): { date: number; isPadding: boolean; status: 'today' | 'present' | 'holiday' | 'none' }[] {
    const viewDate = this.calendarViewDate();
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const startWeekday = new Date(year, month, 1).getDay();

    // Cross-reference this component's own holiday list so the grid highlights
    // real upcoming holidays that happen to fall in the displayed month.
    const holidayDatesInMonth = new Set(
      this.upcomingHolidays()
        .map(h => new Date(h.date))
        .filter(d => d.getFullYear() === year && d.getMonth() === month)
        .map(d => d.getDate())
    );

    const days: { date: number; isPadding: boolean; status: 'today' | 'present' | 'holiday' | 'none' }[] = [];

    for (let i = startWeekday - 1; i >= 0; i--) {
      days.push({ date: daysInPrevMonth - i, isPadding: true, status: 'none' });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dow = new Date(year, month, d).getDay();
      const isWeekend = dow === 0 || dow === 6;

      let status: 'today' | 'present' | 'holiday' | 'none' = 'none';
      if (holidayDatesInMonth.has(d)) {
        status = 'holiday';
      } else if (!isWeekend && isCurrentMonth && d < today.getDate()) {
        status = 'present';
      }
      if (isCurrentMonth && d === today.getDate()) {
        status = 'today';
      }

      days.push({ date: d, isPadding: false, status });
    }

    const remainder = days.length % 7;
    if (remainder !== 0) {
      for (let i = 1; i <= 7 - remainder; i++) {
        days.push({ date: i, isPadding: true, status: 'none' });
      }
    }

    return days;
  }
}
