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
  selector: 'oh-user-stories-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule],
  templateUrl: './user-stories-panel.component.html',
  styleUrl: './user-stories-panel.component.scss'
})
export class UserStoriesPanelComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly projectState = inject(ProjectStateService);
  readonly roleService = inject(RoleService);

  private readonly projectId = toSignal(this.route.parent!.paramMap.pipe(map(p => p.get('id') ?? '')), {
    initialValue: this.route.parent!.snapshot.paramMap.get('id') ?? ''
  });

  readonly project = computed(() => this.projectState.activeProjects().find(p => p.id === this.projectId()));

  showAddForm = false;
  newStoryTitle = '';
  newStoryEst = 5;
  newStoryPriority: 'High' | 'Medium' | 'Low' = 'Medium';

  addUserStory(): void {
    const project = this.project();
    if (!project || !this.newStoryTitle.trim() || !this.roleService.canCreateUserStory()) return;

    this.projectState.addUserStory(project.id, {
      title: this.newStoryTitle,
      estimation: this.newStoryEst,
      priority: this.newStoryPriority,
      status: 'Backlog'
    });

    this.newStoryTitle = '';
    this.showAddForm = false;
  }
}
