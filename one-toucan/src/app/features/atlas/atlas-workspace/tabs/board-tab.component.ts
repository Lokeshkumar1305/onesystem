import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ProjectStateService } from '../../../../core/projects/project-state.service';
import { ProjectCard } from '../../../../core/projects/projects.data';

@Component({
  selector: 'oh-atlas-board-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './board-tab.component.html',
  styleUrl: './board-tab.component.scss'
})
export class BoardTabComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly projectState = inject(ProjectStateService);

  private readonly projectId = toSignal(this.route.parent!.paramMap.pipe(map(p => p.get('id') ?? '')), {
    initialValue: this.route.parent!.snapshot.paramMap.get('id') ?? ''
  });

  readonly project = computed(() => this.projectState.activeProjects().find(p => p.id === this.projectId()));

  showAddFeatureForm = false;
  newFeatureTitle = '';
  newFeatureType: 'FEATURE' | 'BUG' | 'CHORE' | 'SECURITY' = 'FEATURE';
  newFeaturePoints = 3;
  newFeaturePriority: 'green' | 'yellow' | 'red' = 'green';
  newFeatureAssignee = 'RM';

  onCardDrop(event: CdkDragDrop<ProjectCard[]>): void {
    const project = this.project();
    if (!project) return;
    this.projectState.onCardDrop(project.id, event);
  }

  addFeatureCard(): void {
    const project = this.project();
    if (!project || !this.newFeatureTitle.trim()) return;

    this.projectState.addFeatureCard(project.id, {
      type: this.newFeatureType,
      title: this.newFeatureTitle,
      points: this.newFeaturePoints,
      assigneeInitials: this.newFeatureAssignee,
      assigneeColorClass: this.newFeatureAssignee === 'RM' ? 'oh-avatar-circle--blue' : 'oh-avatar-circle--purple',
      priorityDotColor: this.newFeaturePriority
    });

    this.newFeatureTitle = '';
    this.showAddFeatureForm = false;
  }

  getBadgeClass(type: string): string {
    switch (type) {
      case 'FEATURE': return 'oh-badge--info';
      case 'BUG': return 'oh-badge--danger';
      case 'SECURITY': return 'oh-badge--warning';
      case 'CHORE': return 'oh-badge--violet';
      default: return 'oh-badge--neutral';
    }
  }

  getDotClass(color: string): string {
    return `oh-priority-dot--${color}`;
  }
}
