import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RoleService } from '../../../../../core/auth/role.service';
import { ProjectStateService } from '../../../../../core/projects/project-state.service';
import { ActiveProject } from '../../../../../core/projects/projects.data';

@Component({
  selector: 'oh-test-cases-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule],
  templateUrl: './test-cases-panel.component.html',
  styleUrl: './test-cases-panel.component.scss'
})
export class TestCasesPanelComponent {
  private readonly projectState = inject(ProjectStateService);
  readonly roleService = inject(RoleService);

  @Input({ required: true }) project!: ActiveProject;

  showAddForm = false;
  newTitle = '';
  newDescription = '';
  newLinkedRequirementId = '';
  newPriority: 'High' | 'Medium' | 'Low' = 'Medium';

  addTestCase(): void {
    if (!this.newTitle.trim() || !this.roleService.canCreateTestCase()) return;

    this.projectState.addTestCase(this.project.id, {
      title: this.newTitle,
      description: this.newDescription,
      linkedRequirementId: this.newLinkedRequirementId || undefined,
      priority: this.newPriority,
      status: 'Not Run'
    });

    this.newTitle = '';
    this.newDescription = '';
    this.newLinkedRequirementId = '';
    this.showAddForm = false;
  }

  linkedRequirementTitle(linkedRequirementId?: string): string {
    if (!linkedRequirementId) return '—';
    const req = this.project.requirements.find(r => r.id === linkedRequirementId);
    return req ? req.id : '—';
  }

  statusBadgeClass(status: string): string {
    switch (status) {
      case 'Passed': return 'oh-badge--success';
      case 'Failed': return 'oh-badge--danger';
      case 'Blocked': return 'oh-badge--warning';
      default: return 'oh-badge--outline';
    }
  }
}
