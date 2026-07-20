import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { RoleService } from '../../../core/auth/role.service';
import { ProjectStateService } from '../../../core/projects/project-state.service';
import { BoardTabComponent } from './tabs/board-tab.component';
import { BacklogTabComponent } from './tabs/backlog-tab.component';
import { OperationalTabComponent } from './tabs/operational-tab.component';

@Component({
  selector: 'oh-atlas-workspace',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatTooltipModule, BoardTabComponent, BacklogTabComponent, OperationalTabComponent],
  templateUrl: './atlas-workspace.component.html',
  styleUrl: './atlas-workspace.component.scss'
})
export class AtlasWorkspaceComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectState = inject(ProjectStateService);
  readonly roleService = inject(RoleService);

  private readonly projectId = toSignal(this.route.paramMap.pipe(map(params => params.get('id') ?? '')), {
    initialValue: this.route.snapshot.paramMap.get('id') ?? ''
  });

  readonly project = computed(() => {
    const id = this.projectId();
    return this.projectState.activeProjects().find(p => p.id === id) ?? null;
  });

  readonly activeTab = signal<'board' | 'backlog' | 'operational'>('board');

  getAvatarClass(color: string): string {
    return `oh-avatar-circle--${color}`;
  }

  goBackToAtlasProjects(): void {
    this.router.navigate(['/atlas/projects']);
  }

  markCompleted(): void {
    const project = this.project();
    if (!project || !this.roleService.canMarkCompleted()) return;
    this.projectState.markCompleted(project.id);
  }
}
