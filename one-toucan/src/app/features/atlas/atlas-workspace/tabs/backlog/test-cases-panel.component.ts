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
import { AtlasTestCase } from '../../../../../core/projects/projects.data';

@Component({
  selector: 'oh-test-cases-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule],
  templateUrl: './test-cases-panel.component.html',
  styleUrl: './test-cases-panel.component.scss'
})
export class TestCasesPanelComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly projectState = inject(ProjectStateService);
  readonly roleService = inject(RoleService);

  private readonly projectId = toSignal(this.route.parent!.paramMap.pipe(map(p => p.get('id') ?? '')), {
    initialValue: this.route.parent!.snapshot.paramMap.get('id') ?? ''
  });

  readonly project = computed(() => this.projectState.activeProjects().find(p => p.id === this.projectId()));

  readonly stats = computed(() => {
    const testCases = this.project()?.testCases ?? [];
    return {
      total: testCases.length,
      passed: testCases.filter(tc => tc.status === 'Passed').length,
      failed: testCases.filter(tc => tc.status === 'Failed').length,
      blocked: testCases.filter(tc => tc.status === 'Blocked').length,
      notRun: testCases.filter(tc => tc.status === 'Not Run').length
    };
  });

  showAddForm = false;
  newTitle = '';
  newDescription = '';
  newLinkedRequirementId = '';
  newPriority: 'High' | 'Medium' | 'Low' = 'Medium';

  addTestCase(): void {
    const project = this.project();
    if (!project || !this.newTitle.trim() || !this.roleService.canCreateTestCase()) return;

    this.projectState.addTestCase(project.id, {
      title: this.newTitle,
      description: this.newDescription,
      linkedRequirementId: this.newLinkedRequirementId || undefined,
      priority: this.newPriority,
      status: 'Not Run'
    });

    this.newTitle = '';
    this.newDescription = '';
    this.newLinkedRequirementId = '';
    this.showAddForm = false;
  }

  setStatus(testCase: AtlasTestCase, status: AtlasTestCase['status']): void {
    const project = this.project();
    if (!project || !this.roleService.canCreateTestCase() || testCase.status === status) return;
    this.projectState.setTestCaseStatus(project.id, testCase.id, status);
  }

  linkedRequirementTitle(linkedRequirementId?: string): string {
    if (!linkedRequirementId) return '—';
    const req = this.project()?.requirements.find(r => r.id === linkedRequirementId);
    return req ? req.id : '—';
  }

  statusBadgeClass(status: string): string {
    switch (status) {
      case 'Passed': return 'oh-badge--success';
      case 'Failed': return 'oh-badge--danger';
      case 'Blocked': return 'oh-badge--warning';
      default: return 'oh-badge--outline';
    }
  }

  statusIcon(status: string): string {
    switch (status) {
      case 'Passed': return 'bi-check-circle-fill';
      case 'Failed': return 'bi-x-circle-fill';
      case 'Blocked': return 'bi-slash-circle-fill';
      default: return 'bi-dash-circle';
    }
  }

  priorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'High': return 'oh-badge--danger';
      case 'Medium': return 'oh-badge--warning';
      default: return 'oh-badge--success';
    }
  }
}
