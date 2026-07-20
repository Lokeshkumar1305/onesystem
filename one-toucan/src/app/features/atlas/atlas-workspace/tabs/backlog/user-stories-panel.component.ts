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
  selector: 'oh-user-stories-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule],
  templateUrl: './user-stories-panel.component.html',
  styleUrl: './user-stories-panel.component.scss'
})
export class UserStoriesPanelComponent {
  private readonly projectState = inject(ProjectStateService);
  readonly roleService = inject(RoleService);

  @Input({ required: true }) project!: ActiveProject;

  showAddForm = false;
  newStoryTitle = '';
  newStoryEst = 5;
  newStoryPriority: 'High' | 'Medium' | 'Low' = 'Medium';

  addUserStory(): void {
    if (!this.newStoryTitle.trim() || !this.roleService.canCreateUserStory()) return;

    this.projectState.addUserStory(this.project.id, {
      title: this.newStoryTitle,
      estimation: this.newStoryEst,
      priority: this.newStoryPriority,
      status: 'Backlog'
    });

    this.newStoryTitle = '';
    this.showAddForm = false;
  }
}
