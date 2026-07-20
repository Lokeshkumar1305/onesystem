import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RoleService } from '../../../../../core/auth/role.service';
import { ProjectStateService } from '../../../../../core/projects/project-state.service';
import { ActiveProject } from '../../../../../core/projects/projects.data';

@Component({
  selector: 'oh-tasks-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatTooltipModule],
  templateUrl: './tasks-panel.component.html',
  styleUrl: './tasks-panel.component.scss'
})
export class TasksPanelComponent {
  private readonly projectState = inject(ProjectStateService);
  readonly roleService = inject(RoleService);

  @Input({ required: true }) project!: ActiveProject;

  showAddForm = false;
  newTaskTitle = '';
  newTaskAssignee = 'Rahul Menon';

  addAtlasTask(): void {
    if (!this.newTaskTitle.trim() || !this.roleService.canCreateTask()) return;

    this.projectState.addTask(this.project.id, {
      title: this.newTaskTitle,
      assignee: this.newTaskAssignee,
      status: 'To Do'
    });

    this.newTaskTitle = '';
    this.showAddForm = false;
  }
}
