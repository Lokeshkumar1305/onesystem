import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

import { RoleService } from '../../core/auth/role.service';
import { ProjectStateService } from '../../core/projects/project-state.service';
import { ActiveProject } from '../../core/projects/projects.data';

// TEMP: login lands here directly (skipping the OneHR/Atlas/Project-Management
// picker at /home). This mirrors the "Project Management Workspace" dashboard
// view from ProjectsComponent (features/projects) — same header, stat cards
// and Active Projects & Modules panel — but drops the Initialization Pipeline
// panel and reads the same live ProjectStateService data, rather than
// duplicating the full proposal-wizard screen.
@Component({
  selector: 'oh-temp-project',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatTooltipModule],
  templateUrl: './temp-project.component.html',
  styleUrl: './temp-project.component.scss'
})
export class TempProjectComponent {
  private readonly router = inject(Router);
  private readonly projectState = inject(ProjectStateService);
  readonly roleService = inject(RoleService);

  readonly activeProjects = this.projectState.activeProjects;

  readonly selectedTypeFilter = signal<'all' | 'project' | 'module'>('all');
  readonly filteredActiveProjects = computed(() => {
    const filter = this.selectedTypeFilter();
    const list = this.activeProjects();
    if (filter === 'all') return list;
    if (filter === 'project') return list.filter(p => !p.isModule);
    return list.filter(p => p.isModule);
  });

  get parentProjects(): ActiveProject[] {
    return this.activeProjects().filter(p => !p.isModule);
  }

  // TEMP: replaces the In Proposals Pipeline / Simulated Approver stat cards.
  // Tech Docs = documents attached to each project; Functional Docs = requirements/specs.
  readonly techDocsCount = computed(() => this.activeProjects().reduce((sum, p) => sum + p.documents.length, 0));
  readonly functionalDocsCount = computed(() => this.activeProjects().reduce((sum, p) => sum + p.requirements.length, 0));

  openProject(project: ActiveProject): void {
    this.router.navigate(['/atlas/projects', project.id]);
  }

  // The proposal wizard itself only lives on the full Projects screen; jump there to start one.
  startNewProposal(): void {
    if (!this.roleService.canManageProjects()) return;
    this.router.navigateByUrl('/projects');
  }

  getAvatarClass(color: string): string {
    return `oh-avatar-circle--${color}`;
  }
}
