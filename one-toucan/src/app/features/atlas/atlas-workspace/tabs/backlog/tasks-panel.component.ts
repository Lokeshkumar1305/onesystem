import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RoleService } from '../../../../../core/auth/role.service';
import { ProjectStateService } from '../../../../../core/projects/project-state.service';

@Component({
  selector: 'oh-tasks-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatTooltipModule],
  templateUrl: './tasks-panel.component.html',
  styleUrl: './tasks-panel.component.scss'
})
export class TasksPanelComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly projectState = inject(ProjectStateService);
  readonly roleService = inject(RoleService);

  private readonly projectId = toSignal(this.route.parent!.paramMap.pipe(map(p => p.get('id') ?? '')), {
    initialValue: this.route.parent!.snapshot.paramMap.get('id') ?? ''
  });

  readonly project = computed(() => this.projectState.activeProjects().find(p => p.id === this.projectId()));

  showAddForm = false;
  newTaskTitle = '';
  newTaskAssignee = 'Rahul Menon';

  addAtlasTask(): void {
    const project = this.project();
    if (!project || !this.newTaskTitle.trim() || !this.roleService.canCreateTask()) return;

    this.projectState.addTask(project.id, {
      title: this.newTaskTitle,
      assignee: this.newTaskAssignee,
      status: 'To Do'
    });

    this.newTaskTitle = '';
    this.showAddForm = false;
  }
}
