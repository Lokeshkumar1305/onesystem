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
  selector: 'oh-requirements-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule],
  templateUrl: './requirements-panel.component.html',
  styleUrl: './requirements-panel.component.scss'
})
export class RequirementsPanelComponent {
  private readonly projectState = inject(ProjectStateService);
  readonly roleService = inject(RoleService);

  @Input({ required: true }) project!: ActiveProject;

  showAddForm = false;
  newReqTitle = '';
  newReqPriority: 'High' | 'Medium' | 'Low' = 'Medium';
  newReqPts = 3;

  addRequirement(): void {
    if (!this.newReqTitle.trim() || !this.roleService.canCreateRequirement()) return;

    this.projectState.addRequirement(this.project.id, {
      title: this.newReqTitle,
      priority: this.newReqPriority,
      pts: this.newReqPts,
      status: 'To Do'
    });

    this.newReqTitle = '';
    this.showAddForm = false;
  }
}
