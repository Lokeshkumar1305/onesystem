import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'oh-announcements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent {
  @Input() announcementsList: any[] = [];
  @Output() backToDashboard = new EventEmitter<void>();
  @Output() announcementPublished = new EventEmitter<any>();

  activeSubView = signal<'announcements' | 'create-announcement'>('announcements');
  announcementTitle = signal<string>('');
  announcementDescription = signal<string>('');
  announcementType = signal<'General' | 'Event'>('General');
  needsAcknowledgement = signal<boolean>(false);

  // Event specific fields
  eventStartDate = signal<Date | null>(null);
  eventEndDate = signal<Date | null>(null);
  eventStartTime = signal<string>('09:00');
  eventEndTime = signal<string>('06:00');
  eventStartTime24 = signal<string>('09:00');
  eventEndTime24 = signal<string>('18:00');
  eventStartPeriod = signal<'AM' | 'PM'>('AM');
  eventEndPeriod = signal<'AM' | 'PM'>('PM');
  isAllDayEvent = signal<boolean>(false);
  eventLocation = signal<string>('');
  eventLink = signal<string>('');
  eventLinkName = signal<string>('');

  timeOptions = [
    { value: '00:00', label: '12:00 AM' },
    { value: '00:30', label: '12:30 AM' },
    { value: '01:00', label: '01:00 AM' },
    { value: '01:30', label: '01:30 AM' },
    { value: '02:00', label: '02:00 AM' },
    { value: '02:30', label: '02:30 AM' },
    { value: '03:00', label: '03:00 AM' },
    { value: '03:30', label: '03:30 AM' },
    { value: '04:00', label: '04:00 AM' },
    { value: '04:30', label: '04:30 AM' },
    { value: '05:00', label: '05:00 AM' },
    { value: '05:30', label: '05:30 AM' },
    { value: '06:00', label: '06:00 AM' },
    { value: '06:30', label: '06:30 AM' },
    { value: '07:00', label: '07:00 AM' },
    { value: '07:30', label: '07:30 AM' },
    { value: '08:00', label: '08:00 AM' },
    { value: '08:30', label: '08:30 AM' },
    { value: '09:00', label: '09:00 AM' },
    { value: '09:30', label: '09:30 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '10:30', label: '10:30 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '11:30', label: '11:30 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '12:30', label: '12:30 PM' },
    { value: '13:00', label: '01:00 PM' },
    { value: '13:30', label: '01:30 PM' },
    { value: '14:00', label: '02:00 PM' },
    { value: '14:30', label: '02:30 PM' },
    { value: '15:00', label: '03:00 PM' },
    { value: '15:30', label: '03:30 PM' },
    { value: '16:00', label: '04:00 PM' },
    { value: '16:30', label: '04:30 PM' },
    { value: '17:00', label: '05:00 PM' },
    { value: '17:30', label: '05:30 PM' },
    { value: '18:00', label: '06:00 PM' },
    { value: '18:30', label: '06:30 PM' },
    { value: '19:00', label: '07:00 PM' },
    { value: '19:30', label: '07:30 PM' },
    { value: '20:00', label: '08:00 PM' },
    { value: '20:30', label: '08:30 PM' },
    { value: '21:00', label: '09:00 PM' },
    { value: '21:30', label: '09:30 PM' },
    { value: '22:00', label: '10:00 PM' },
    { value: '22:30', label: '10:30 PM' },
    { value: '23:00', label: '11:00 PM' },
    { value: '23:30', label: '11:30 PM' }
  ];

  onStartTimeSelectChange(val: string): void {
    this.eventStartTime24.set(val);
    const option = this.timeOptions.find(o => o.value === val);
    if (option) {
      const [time, period] = option.label.split(' ');
      this.eventStartTime.set(time);
      this.eventStartPeriod.set(period as 'AM' | 'PM');
    }
  }

  onEndTimeSelectChange(val: string): void {
    this.eventEndTime24.set(val);
    const option = this.timeOptions.find(o => o.value === val);
    if (option) {
      const [time, period] = option.label.split(' ');
      this.eventEndTime.set(time);
      this.eventEndPeriod.set(period as 'AM' | 'PM');
    }
  }

  onStartTimeChange(value: string): void {
    if (!value) return;
    this.eventStartTime24.set(value);
    const [hoursStr] = value.split(':');
    const hours = parseInt(hoursStr, 10);
    this.eventStartPeriod.set(hours >= 12 ? 'PM' : 'AM');
    // Display in 12-hour format
    const displayHours = hours % 12 || 12;
    const minutes = value.split(':')[1] || '00';
    this.eventStartTime.set(`${displayHours.toString().padStart(2, '0')}:${minutes}`);
  }

  onEndTimeChange(value: string): void {
    if (!value) return;
    this.eventEndTime24.set(value);
    const [hoursStr] = value.split(':');
    const hours = parseInt(hoursStr, 10);
    this.eventEndPeriod.set(hours >= 12 ? 'PM' : 'AM');
    // Display in 12-hour format
    const displayHours = hours % 12 || 12;
    const minutes = value.split(':')[1] || '00';
    this.eventEndTime.set(`${displayHours.toString().padStart(2, '0')}:${minutes}`);
  }

  publishAnnouncement(): void {
    if (!this.announcementTitle().trim()) {
      return;
    }
    const newAnn = {
      title: this.announcementTitle(),
      description: this.announcementDescription() || 'No description provided.',
      type: this.announcementType(),
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
      status: 'Active'
    };

    this.announcementPublished.emit(newAnn);

    // Reset fields
    this.announcementTitle.set('');
    this.announcementDescription.set('');
    this.announcementType.set('General');
    this.needsAcknowledgement.set(false);
    this.eventStartDate.set(null);
    this.eventEndDate.set(null);
    this.eventStartTime.set('09:00');
    this.eventEndTime.set('18:00');
    this.eventStartPeriod.set('AM');
    this.eventEndPeriod.set('PM');
    this.isAllDayEvent.set(false);
    this.eventLocation.set('');
    this.eventLink.set('');
    this.eventLinkName.set('');
    this.activeSubView.set('announcements');
  }

  cancelCreate(): void {
    this.activeSubView.set('announcements');
  }
}
