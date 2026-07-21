import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CurrentUserService } from '../../../../../core/auth/current-user.service';
import { RoleService } from '../../../../../core/auth/role.service';
import { ProjectStateService } from '../../../../../core/projects/project-state.service';
import { ActiveProject, AtlasTestCase, TestCaseFolder } from '../../../../../core/projects/projects.data';

interface FolderRow {
  folder: TestCaseFolder;
  depth: number;
  hasChildren: boolean;
}

@Component({
  selector: 'oh-test-cases-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './test-cases-panel.component.html',
  styleUrl: './test-cases-panel.component.scss'
})
export class TestCasesPanelComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly projectState = inject(ProjectStateService);
  private readonly currentUser = inject(CurrentUserService);
  readonly roleService = inject(RoleService);

  private readonly projectId = toSignal(this.route.parent!.paramMap.pipe(map(p => p.get('id') ?? '')), {
    initialValue: this.route.parent!.snapshot.paramMap.get('id') ?? ''
  });

  readonly project = computed(() => this.projectState.activeProjects().find(p => p.id === this.projectId()));

  // --- Overall execution summary (whole project, all folders) ---
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

  // --- Folder tree: flattened, depth-indented list (unlimited depth, no
  // recursive component — collapsed subtrees are simply skipped) ---
  readonly selectedFolderId = signal<string | null>(null);
  readonly collapsedFolderIds = signal<Set<string>>(new Set());
  searchTerm = '';

  // Folder tree rows are drop-only targets (they never source a drag
  // themselves), so they bind this fixed, correctly-typed empty array
  // instead of inferring `never[]` from an inline `[]` literal.
  readonly emptyDropData: AtlasTestCase[] = [];

  readonly folderRows = computed<FolderRow[]>(() => {
    const project = this.project();
    if (!project) return [];
    const folders = project.testCaseFolders;
    const collapsed = this.collapsedFolderIds();
    const rows: FolderRow[] = [];

    const walk = (parentId: string | null, depth: number) => {
      for (const folder of folders.filter(f => f.parentId === parentId)) {
        const hasChildren = folders.some(f => f.parentId === folder.id);
        rows.push({ folder, depth, hasChildren });
        if (!collapsed.has(folder.id)) {
          walk(folder.id, depth + 1);
        }
      }
    };
    walk(null, 0);
    return rows;
  });

  readonly breadcrumb = computed<TestCaseFolder[]>(() => {
    const project = this.project();
    if (!project) return [];
    const path: TestCaseFolder[] = [];
    let currentId: string | null = this.selectedFolderId();
    while (currentId) {
      const folder: TestCaseFolder | undefined = project.testCaseFolders.find(f => f.id === currentId);
      if (!folder) break;
      path.unshift(folder);
      currentId = folder.parentId;
    }
    return path;
  });

  readonly childFolders = computed<TestCaseFolder[]>(() => {
    const project = this.project();
    if (!project) return [];
    return project.testCaseFolders.filter(f => f.parentId === this.selectedFolderId());
  });

  readonly directTestCases = computed<AtlasTestCase[]>(() => {
    const project = this.project();
    if (!project) return [];
    const term = this.searchTerm.trim().toLowerCase();
    return project.testCases
      .filter(tc => tc.folderId === this.selectedFolderId())
      .filter(tc => !term || tc.title.toLowerCase().includes(term));
  });

  private descendantFolderIds(project: ActiveProject, folderId: string): string[] {
    const ids: string[] = [];
    const walk = (id: string) => {
      for (const f of project.testCaseFolders) {
        if (f.parentId === id) {
          ids.push(f.id);
          walk(f.id);
        }
      }
    };
    walk(folderId);
    return ids;
  }

  private testCasesInFolder(folderId: string): AtlasTestCase[] {
    const project = this.project();
    if (!project) return [];
    const folderIds = [folderId, ...this.descendantFolderIds(project, folderId)];
    return project.testCases.filter(tc => tc.folderId !== null && folderIds.includes(tc.folderId));
  }

  folderCount(folderId: string): number {
    return this.testCasesInFolder(folderId).length;
  }

  folderPassRate(folderId: string): number {
    const cases = this.testCasesInFolder(folderId);
    if (!cases.length) return 0;
    return Math.round((cases.filter(tc => tc.status === 'Passed').length / cases.length) * 100);
  }

  selectFolder(folderId: string | null): void {
    this.selectedFolderId.set(folderId);
  }

  toggleCollapsed(folderId: string, event: Event): void {
    event.stopPropagation();
    this.collapsedFolderIds.update(set => {
      const next = new Set(set);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }

  // --- Folder CRUD ---
  showNewFolderForm = false;
  newFolderName = '';

  @ViewChild('newFolderInput') set newFolderInputRef(el: ElementRef<HTMLInputElement> | undefined) {
    if (el) {
      setTimeout(() => el.nativeElement.focus());
    }
  }

  toggleNewFolderForm(): void {
    if (this.showNewFolderForm) {
      this.cancelNewFolder();
    } else {
      this.showNewFolderForm = true;
    }
  }

  cancelNewFolder(): void {
    this.newFolderName = '';
    this.showNewFolderForm = false;
  }

  addFolder(): void {
    const project = this.project();
    if (!project || !this.newFolderName.trim() || !this.roleService.canCreateTestCase()) return;
    this.projectState.addTestCaseFolder(project.id, this.newFolderName, this.selectedFolderId());
    this.newFolderName = '';
    this.showNewFolderForm = false;
  }

  renamingFolderId: string | null = null;
  renameDraft = '';

  startRename(folder: TestCaseFolder, event: Event): void {
    event.stopPropagation();
    if (!this.roleService.canCreateTestCase()) return;
    this.renamingFolderId = folder.id;
    this.renameDraft = folder.name;
  }

  confirmRename(): void {
    const project = this.project();
    if (!project || !this.renamingFolderId) return;
    this.projectState.renameTestCaseFolder(project.id, this.renamingFolderId, this.renameDraft);
    this.renamingFolderId = null;
  }

  deleteFolder(folder: TestCaseFolder, event: Event): void {
    event.stopPropagation();
    const project = this.project();
    if (!project || !this.roleService.canCreateTestCase()) return;
    if (this.selectedFolderId() === folder.id) {
      this.selectedFolderId.set(folder.parentId);
    }
    this.projectState.deleteTestCaseFolder(project.id, folder.id);
  }

  // --- Test case CRUD ---
  showAddForm = false;
  newTitle = '';
  newDescription = '';
  newLinkedRequirementId = '';
  newPriority: 'High' | 'Medium' | 'Low' = 'Medium';

  @ViewChild('newTitleInput') set newTitleInputRef(el: ElementRef<HTMLInputElement> | undefined) {
    if (el) {
      setTimeout(() => el.nativeElement.focus());
    }
  }

  toggleNewTestCaseForm(): void {
    if (this.showAddForm) {
      this.cancelNewTestCase();
    } else {
      this.showAddForm = true;
    }
  }

  cancelNewTestCase(): void {
    this.newTitle = '';
    this.newDescription = '';
    this.newLinkedRequirementId = '';
    this.newPriority = 'Medium';
    this.showAddForm = false;
  }

  addTestCase(keepFormOpen = false): void {
    const project = this.project();
    if (!project || !this.newTitle.trim() || !this.roleService.canCreateTestCase()) return;

    this.projectState.addTestCase(project.id, {
      title: this.newTitle,
      description: this.newDescription,
      linkedRequirementId: this.newLinkedRequirementId || undefined,
      priority: this.newPriority,
      status: 'Not Run',
      folderId: this.selectedFolderId(),
      createdBy: this.roleService.currentUserDisplayName() ?? this.currentUser.fullName()
    });

    this.newTitle = '';
    this.newDescription = '';
    this.newLinkedRequirementId = '';
    this.newPriority = 'Medium';
    this.showAddForm = keepFormOpen;
  }

  setStatus(testCase: AtlasTestCase, status: AtlasTestCase['status']): void {
    const project = this.project();
    if (!project || !this.roleService.canCreateTestCase() || testCase.status === status) return;
    this.projectState.setTestCaseStatus(project.id, testCase.id, status);
  }

  onDropOnFolder(folderId: string | null, event: CdkDragDrop<AtlasTestCase[]>): void {
    const project = this.project();
    const testCase: AtlasTestCase | undefined = event.item.data;
    if (!project || !testCase || !this.roleService.canCreateTestCase() || testCase.folderId === folderId) return;
    this.projectState.moveTestCase(project.id, testCase.id, folderId);
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
