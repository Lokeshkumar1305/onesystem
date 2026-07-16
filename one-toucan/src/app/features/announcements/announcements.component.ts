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
    this.activeSubView.set('announcements');
  }

  cancelCreate(): void {
    this.activeSubView.set('announcements');
  }
}
