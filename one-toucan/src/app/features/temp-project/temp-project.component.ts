import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';

import { RoleService } from '../../core/auth/role.service';
import { ProjectStateService } from '../../core/projects/project-state.service';
import { ActiveProject } from '../../core/projects/projects.data';

@Component({
  selector: 'oh-temp-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './temp-project.component.html',
  styleUrl: './temp-project.component.scss'
})
export class TempProjectComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly projectState = inject(ProjectStateService);
  readonly roleService = inject(RoleService);

  readonly activeProjects = this.projectState.activeProjects;

  readonly selectedTypeFilter = signal<'all' | 'project' | 'module'>('all');
  readonly searchQuery = signal('');

  // Detailed view modal state
  readonly selectedProjectForView = signal<ActiveProject | null>(null);

  // Toast notification feedback
  readonly toastMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['created']) {
        const type = params['type'] || 'Project';
        this.showToast(`Successfully created ${type} "${params['created']}"`);
      }
    });
  }

  readonly filteredActiveProjects = computed(() => {
    const filter = this.selectedTypeFilter();
    let list = this.activeProjects();
    if (filter === 'project') list = list.filter(p => !p.isModule);
    if (filter === 'module') list = list.filter(p => p.isModule);

    const term = this.searchQuery().trim().toLowerCase();
    if (term) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.key.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        (p.repoName && p.repoName.toLowerCase().includes(term)) ||
        (p.projectManager && p.projectManager.toLowerCase().includes(term)) ||
        (p.projectTechLead && p.projectTechLead.toLowerCase().includes(term)) ||
        (p.projectBa && p.projectBa.toLowerCase().includes(term)) ||
        (p.primaryOwners && p.primaryOwners.some(o => o.toLowerCase().includes(term))) ||
        (p.secondaryOwners && p.secondaryOwners.some(o => o.toLowerCase().includes(term)))
      );
    }
    return list;
  });

  get parentProjects(): ActiveProject[] {
    return this.activeProjects().filter(p => !p.isModule);
  }

  readonly techDocsCount = computed(() => this.activeProjects().reduce((sum, p) => sum + p.documents.length, 0));
  readonly functionalDocsCount = computed(() => this.activeProjects().reduce((sum, p) => sum + p.requirements.length, 0));

  openProject(project: ActiveProject): void {
    this.router.navigate(['/atlas/projects', project.id]);
  }

  openProjectDetails(project: ActiveProject, event?: Event): void {
    if (event) event.stopPropagation();
    this.selectedProjectForView.set(project);
    document.body.classList.add('oh-modal-open');
  }

  closeProjectDetails(): void {
    this.selectedProjectForView.set(null);
    document.body.classList.remove('oh-modal-open');
  }

  // Navigates to separate creation screen route
  openCreatePage(): void {
    if (!this.roleService.canManageProjects()) return;
    this.router.navigate(['/temp-project/create']);
  }

  private showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4000);
  }
}
