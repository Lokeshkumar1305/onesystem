import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CurrentUserService } from '../../../../../core/auth/current-user.service';
import { RoleService } from '../../../../../core/auth/role.service';
import { ProjectStateService } from '../../../../../core/projects/project-state.service';
import { ActiveProject } from '../../../../../core/projects/projects.data';

@Component({
  selector: 'oh-bugs-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule],
  templateUrl: './bugs-panel.component.html',
  styleUrl: './bugs-panel.component.scss'
})
export class BugsPanelComponent {
  private readonly projectState = inject(ProjectStateService);
  private readonly currentUser = inject(CurrentUserService);
  readonly roleService = inject(RoleService);

  @Input({ required: true }) project!: ActiveProject;

  showAddForm = false;
  newTitle = '';
  newSeverity: 'Critical' | 'Major' | 'Minor' | 'Trivial' = 'Major';
  newPriority: 'High' | 'Medium' | 'Low' = 'Medium';

  addBug(): void {
    if (!this.newTitle.trim() || !this.roleService.canRaiseIncident()) return;

    this.projectState.addBug(this.project.id, {
      title: this.newTitle,
      severity: this.newSeverity,
      priority: this.newPriority,
      status: 'Open',
      reportedBy: this.roleService.currentUserDisplayName() ?? this.currentUser.fullName()
    });

    this.newTitle = '';
    this.showAddForm = false;
  }

  severityBadgeClass(severity: string): string {
    switch (severity) {
      case 'Critical': return 'oh-badge--danger';
      case 'Major': return 'oh-badge--warning';
      default: return 'oh-badge--outline';
    }
  }

  statusBadgeClass(status: string): string {
    switch (status) {
      case 'Open': return 'oh-badge--danger';
      case 'In Progress': return 'oh-badge--warning';
      case 'Reopened': return 'oh-badge--warning';
      case 'Fixed': return 'oh-badge--success';
      case 'Closed': return 'oh-badge--neutral';
      default: return 'oh-badge--outline';
    }
  }
}
