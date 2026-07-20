import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RoleService } from '../../../core/auth/role.service';
import { ProjectStateService } from '../../../core/projects/project-state.service';

@Component({
  selector: 'oh-atlas-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatTooltipModule],
  templateUrl: './atlas-projects.component.html',
  styleUrl: './atlas-projects.component.scss'
})
export class AtlasProjectsComponent {
  private readonly projectState = inject(ProjectStateService);
  readonly roleService = inject(RoleService);

  readonly projects = this.projectState.visibleProjects;

  getAvatarClass(color: string): string {
    return `oh-avatar-circle--${color}`;
  }
}
