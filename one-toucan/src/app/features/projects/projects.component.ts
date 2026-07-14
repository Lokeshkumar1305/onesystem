import { CommonModule } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { INITIAL_BOARD, ProjectColumn, ProjectCard } from './projects.data';

interface TeamMember {
  initials: string;
  name: string;
  avatarColor: string; // e.g. 'blue', 'purple', 'pink', 'teal'
}

const STEP_LABELS = ['Project basics', 'Methodology', 'Timeline & budget', 'Team', 'Review & launch'];

@Component({
  selector: 'oh-projects',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatCardModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    FormsModule
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnDestroy {
  readonly activeView = signal<'board' | 'create'>('board');
  readonly activeStep = signal<number>(1);
  readonly lastSavedLabel = signal('12 seconds ago');

  get currentStepLabel(): string {
    return STEP_LABELS[this.activeStep() - 1];
  }

  // Kanban Board columns
  readonly board = signal<ProjectColumn[]>(INITIAL_BOARD);

  // New Project Form parameters
  newProjName = '';
  newProjDesc = '';
  newProjKey = '';
  newProjClient = 'Razorpay';
  newProjMethodology: 'scrum' | 'kanban' | 'waterfall' = 'scrum';
  newProjStartDate: Date | null = new Date(2026, 6, 7);
  newProjEndDate: Date | null = new Date(2026, 11, 31);
  newProjBudget = '84,000';
  newProjSlack = true;

  // Team list state
  readonly teamMembers = signal<TeamMember[]>([
    { initials: 'RM', name: 'Rahul Menon', avatarColor: 'blue' },
    { initials: 'SI', name: 'Sneha Iyer', avatarColor: 'teal' },
    { initials: 'AK', name: 'Arman Khan', avatarColor: 'pink' }
  ]);
  newMemberInput = '';

  // Quick Story Creation Form (Inline on Backlog header or simple dialog input)
  showAddStoryInput = false;
  storyTitleInput = '';
  storyTypeInput: 'FEATURE' | 'BUG' | 'CHORE' | 'SECURITY' = 'FEATURE';

  getAvatarClass(color: string): string {
    return `oh-avatar--${color}`;
  }

  getBadgeClass(type: string): string {
    switch (type) {
      case 'FEATURE':
        return 'oh-badge--info';
      case 'BUG':
        return 'oh-badge--danger';
      case 'SECURITY':
        return 'oh-badge--warning';
      case 'CHORE':
        return 'oh-badge--violet';
      default:
        return 'oh-badge--neutral';
    }
  }

  getDotClass(color: string): string {
    return `oh-priority-dot--${color}`;
  }

  // Kanban Drag and Drop handler
  onCardDrop(event: CdkDragDrop<ProjectCard[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const prevCol = this.board().find(c => c.cards === event.previousContainer.data);
      const currCol = this.board().find(c => c.cards === event.container.data);

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (prevCol && currCol) {
        // Force refresh board signals
        this.board.set([...this.board()]);
      }
    }
  }

  showCreateScreen(): void {
    this.activeView.set('create');
    this.activeStep.set(1);
  }

  goToStep(step: number): void {
    this.activeStep.set(step);
  }

  nextStep(): void {
    if (this.activeStep() < 5) {
      this.activeStep.update(s => s + 1);
    }
  }

  prevStep(): void {
    if (this.activeStep() > 1) {
      this.activeStep.update(s => s - 1);
    }
  }

  cancelCreation(): void {
    this.activeView.set('board');
    this.resetCreateForm();
  }

  saveDraft(): void {
    this.lastSavedLabel.set('just now');
  }

  saveProject(): void {
    if (!this.newProjName.trim() || !this.newProjKey.trim()) {
      return;
    }
    // Simple alert / redirect back
    alert(`Project "${this.newProjName}" successfully created!`);
    this.activeView.set('board');
    this.resetCreateForm();
  }

  // Team members chips logic
  addTeamMember(): void {
    const val = this.newMemberInput.trim();
    if (!val) return;

    const parts = val.split(' ').filter(Boolean);
    const initials = parts.length > 0
      ? (parts[0][0] + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase()
      : '?';

    const colors = ['blue', 'purple', 'pink', 'teal'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    this.teamMembers.update(list => [...list, {
      initials,
      name: val,
      avatarColor: randomColor
    }]);

    this.newMemberInput = '';
  }

  removeTeamMember(member: TeamMember): void {
    this.teamMembers.update(list => list.filter(m => m.name !== member.name));
  }

  // Inline Quick Story logic
  toggleStoryInput(): void {
    this.showAddStoryInput = !this.showAddStoryInput;
    this.storyTitleInput = '';
    this.storyTypeInput = 'FEATURE';
  }

  addStory(): void {
    const title = this.storyTitleInput.trim();
    if (!title) return;

    const keyNum = Math.floor(Math.random() * 90) + 200; // e.g. ATL-200+
    const typesColors: Record<string, string> = {
      FEATURE: 'oh-avatar-blue',
      BUG: 'oh-avatar-pink',
      SECURITY: 'oh-avatar-teal',
      CHORE: 'oh-avatar-purple'
    };

    const newCard: ProjectCard = {
      id: `ATL-${keyNum}`,
      type: this.storyTypeInput,
      title: title,
      points: [1, 2, 3, 5, 8][Math.floor(Math.random() * 5)],
      assigneeInitials: 'RM',
      assigneeColorClass: typesColors[this.storyTypeInput] || 'oh-avatar-blue',
      priorityDotColor: ['green', 'yellow', 'red'][Math.floor(Math.random() * 3)] as any
    };

    this.board.update(cols => cols.map(c => {
      if (c.id === 'backlog') {
        return {
          ...c,
          cards: [newCard, ...c.cards]
        };
      }
      return c;
    }));

    this.toggleStoryInput();
  }

  private resetCreateForm(): void {
    this.activeStep.set(1);
    this.newProjName = '';
    this.newProjDesc = '';
    this.newProjKey = '';
    this.newProjClient = 'Razorpay';
    this.newProjMethodology = 'scrum';
    this.newProjStartDate = new Date(2026, 6, 7);
    this.newProjEndDate = new Date(2026, 11, 31);
    this.newProjBudget = '84,000';
    this.newProjSlack = true;
    this.teamMembers.set([
      { initials: 'RM', name: 'Rahul Menon', avatarColor: 'blue' },
      { initials: 'SI', name: 'Sneha Iyer', avatarColor: 'teal' },
      { initials: 'AK', name: 'Arman Khan', avatarColor: 'pink' }
    ]);
    this.newMemberInput = '';
  }

  ngOnDestroy(): void {
    document.body.classList.remove('oh-modal-open');
  }
}
