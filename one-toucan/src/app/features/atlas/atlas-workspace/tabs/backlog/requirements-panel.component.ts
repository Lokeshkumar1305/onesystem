import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RoleService } from '../../../../../core/auth/role.service';
import { ProjectStateService } from '../../../../../core/projects/project-state.service';

@Component({
  selector: 'oh-requirements-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule],
  templateUrl: './requirements-panel.component.html',
  styleUrl: './requirements-panel.component.scss'
})
export class RequirementsPanelComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly projectState = inject(ProjectStateService);
  readonly roleService = inject(RoleService);

  private readonly projectId = toSignal(this.route.parent!.paramMap.pipe(map(p => p.get('id') ?? '')), {
    initialValue: this.route.parent!.snapshot.paramMap.get('id') ?? ''
  });

  readonly project = computed(() => this.projectState.activeProjects().find(p => p.id === this.projectId()));

  showAddForm = false;
  newReqTitle = '';
  newReqPriority: 'High' | 'Medium' | 'Low' = 'Medium';
  newReqPts = 3;

  addRequirement(): void {
    const project = this.project();
    if (!project || !this.newReqTitle.trim() || !this.roleService.canCreateRequirement()) return;

    this.projectState.addRequirement(project.id, {
      title: this.newReqTitle,
      priority: this.newReqPriority,
      pts: this.newReqPts,
      status: 'To Do'
    });

    this.newReqTitle = '';
    this.showAddForm = false;
  }
}
