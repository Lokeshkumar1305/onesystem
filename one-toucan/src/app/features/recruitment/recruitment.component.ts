import { CommonModule } from '@angular/common';
import { Component, OnDestroy, signal, ViewChild, ElementRef } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

import {
  CandidateCard,
  INITIAL_COLUMNS,
  RECRUITMENT_KPIS,
  RecruitmentColumn
} from './recruitment.data';

@Component({
  selector: 'oh-recruitment',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    FormsModule
  ],
  templateUrl: './recruitment.component.html',
  styleUrl: './recruitment.component.scss'
})
export class RecruitmentComponent implements OnDestroy {
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;
  readonly kpis = RECRUITMENT_KPIS;
  readonly columns = signal<RecruitmentColumn[]>(INITIAL_COLUMNS);

  // Add Candidate Drawer Controls
  readonly showAddDrawer = signal(false);
  readonly isAnalyzing = signal(false);
  readonly resumeFileName = signal<string | null>(null);

  // Form Fields
  candName = '';
  candRole = 'Backend Engineer';
  candEducation = '';
  candHasExp = false;
  candExperience = '';
  candSkills = '';
  candSource = 'Portal';
  candReferrerName = '';
  candAgencyName = '';

  onCardDrop(event: CdkDragDrop<CandidateCard[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const prevCol = this.columns().find(c => c.candidates === event.previousContainer.data);
      const currCol = this.columns().find(c => c.candidates === event.container.data);

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (prevCol && currCol) {
        prevCol.totalCount = Math.max(0, prevCol.totalCount - 1);
        currCol.totalCount = currCol.totalCount + 1;
      }

      this.columns.set([...this.columns()]);
    }
  }

  getAvatarClass(color: string): string {
    return `oh-avatar--${color}`;
  }

  ngOnDestroy(): void {
    document.body.classList.remove('oh-modal-open');
  }

  toggleAddDrawer(): void {
    this.showAddDrawer.update(v => !v);
    if (this.showAddDrawer()) {
      document.body.classList.add('oh-modal-open');
    } else {
      document.body.classList.remove('oh-modal-open');
      this.resetForm();
    }
  }

  clearUploadedFile(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.resumeFileName.set(null);
    this.isAnalyzing.set(false);
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.resumeFileName.set(file.name);
      this.isAnalyzing.set(true);

      // Simulate AI Parsing
      setTimeout(() => {
        this.candName = 'Siddharth Malhotra';
        this.candRole = 'Frontend Engineer';
        this.candEducation = 'B.Tech in Computer Science, IIT Bombay';
        this.candHasExp = true;
        this.candExperience = '2 years as Frontend Developer at TCS';
        this.candSkills = 'Angular, TypeScript, TailwindCSS, HTML5';
        this.candSource = 'Referral';
        this.isAnalyzing.set(false);
      }, 1500);
    }
  }

  submitCandidate(): void {
    if (!this.candName.trim()) {
      return;
    }

    let color: 'blue' | 'purple' | 'pink' | 'teal' = 'blue';
    if (this.candRole.includes('Frontend') || this.candRole.includes('Designer')) {
      color = 'pink';
    } else if (this.candRole.includes('QA') || this.candRole.includes('DevOps')) {
      color = 'purple';
    } else if (this.candRole.includes('Sr') || this.candRole.includes('Data')) {
      color = 'teal';
    }

    const newCandidate: CandidateCard = {
      id: 'c_' + Date.now(),
      name: this.candName.trim(),
      role: this.candRole,
      source: this.candSource,
      referredBy: this.candSource === 'Referral' && this.candReferrerName.trim() ? this.candReferrerName.trim() : undefined,
      agencyName: this.candSource === 'Agency' && this.candAgencyName.trim() ? this.candAgencyName.trim() : undefined,
      match: Math.floor(Math.random() * 25) + 75,
      initials: this.candName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      avatarColor: color
    };

    const updated = this.columns().map(col => {
      if (col.id === 'applied') {
        return {
          ...col,
          totalCount: col.totalCount + 1,
          candidates: [newCandidate, ...col.candidates]
        };
      }
      return col;
    });

    this.columns.set(updated);
    this.toggleAddDrawer();
  }

  private resetForm(): void {
    this.resumeFileName.set(null);
    this.isAnalyzing.set(false);
    this.candName = '';
    this.candRole = 'Backend Engineer';
    this.candEducation = '';
    this.candHasExp = false;
    this.candExperience = '';
    this.candSkills = '';
    this.candSource = 'Portal';
    this.candReferrerName = '';
    this.candAgencyName = '';
  }
}
