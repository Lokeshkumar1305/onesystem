import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { Bug, BugPriority, BugSeverity, BugStatus, INITIAL_BUGS } from './bugs.data';

@Component({
  selector: 'oh-bugs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './bugs.component.html',
  styleUrl: './bugs.component.scss'
})
export class BugsComponent {
  readonly allBugs = signal<Bug[]>(INITIAL_BUGS);

  readonly columns = ['select', 'bug', 'priority', 'status', 'reportedBy', 'actions'];
  readonly pageSizeOptions = [10, 25, 50];

  searchQuery = '';
  private readonly searchSignal = signal('');
  readonly pageSize = signal(10);
  readonly pageIndex = signal(0);
  readonly selected = signal<ReadonlySet<string>>(new Set());

  readonly showForm = signal(false);
  readonly isEditMode = signal(false);
  readonly editingBugId = signal<string | null>(null);

  readonly bugForm: FormGroup;

  readonly severityOptions: BugSeverity[] = ['Critical', 'Major', 'Minor', 'Trivial'];
  readonly priorityOptions: BugPriority[] = ['High', 'Med', 'Low'];
  readonly statusOptions: BugStatus[] = ['Open', 'In Progress', 'Fixed', 'Reopened', 'Closed'];

  readonly totalBugs = computed(() => this.allBugs().length);
  readonly openCount = computed(() => this.allBugs().filter(b => b.status === 'Open' || b.status === 'Reopened').length);
  readonly criticalCount = computed(() => this.allBugs().filter(b => b.severity === 'Critical').length);

  readonly filtered = computed(() => {
    const q = this.searchSignal().trim().toLowerCase();
    const list = this.allBugs();
    if (!q) {
      return list;
    }
    return list.filter(
      b =>
        b.title.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.severity.toLowerCase().includes(q) ||
        b.status.toLowerCase().includes(q) ||
        b.priority.toLowerCase().includes(q) ||
        b.reportedBy.toLowerCase().includes(q)
    );
  });

  readonly totalCount = computed(() => this.filtered().length);
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.totalCount() / this.pageSize())));

  readonly pageRows = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  readonly rangeStart = computed(() => (this.totalCount() ? this.pageIndex() * this.pageSize() + 1 : 0));
  readonly rangeEnd = computed(() => Math.min(this.rangeStart() + this.pageSize() - 1, this.totalCount()));

  private static readonly MAX_VISIBLE_PAGES = 4;

  readonly pageNumbers = computed(() => {
    const visible = Math.min(this.pageCount(), BugsComponent.MAX_VISIBLE_PAGES);
    return Array.from({ length: visible }, (_, i) => i + 1);
  });

  readonly hasMorePages = computed(() => this.pageCount() > BugsComponent.MAX_VISIBLE_PAGES);

  readonly allSelectedOnPage = computed(() => {
    const rows = this.pageRows();
    return rows.length > 0 && rows.every(r => this.selected().has(r.id));
  });

  constructor(private readonly fb: FormBuilder) {
    this.bugForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern(/^BUG-\d+$/)]],
      title: ['', Validators.required],
      severity: ['Major', Validators.required],
      priority: ['Med', Validators.required],
      status: ['Open', Validators.required],
      reportedBy: ['', Validators.required]
    });
  }

  onSearchChange(value: string): void {
    this.searchQuery = value;
    this.searchSignal.set(value);
    this.pageIndex.set(0);
  }

  setPageSize(size: string): void {
    this.pageSize.set(Number(size));
    this.pageIndex.set(0);
  }

  goToPage(page: number): void {
    this.pageIndex.set(page - 1);
  }

  prevPage(): void {
    this.pageIndex.update(i => Math.max(0, i - 1));
  }

  nextPage(): void {
    this.pageIndex.update(i => Math.min(this.pageCount() - 1, i + 1));
  }

  severityBadgeClass(severity: BugSeverity): string {
    switch (severity) {
      case 'Critical':
        return 'oh-badge--error';
      case 'Major':
        return 'oh-badge--warning';
      case 'Minor':
        return 'oh-badge--info';
      case 'Trivial':
        return 'oh-badge--neutral';
      default:
        return 'oh-badge--neutral';
    }
  }

  priorityBadgeClass(priority: BugPriority): string {
    switch (priority) {
      case 'High':
        return 'oh-badge--error';
      case 'Med':
        return 'oh-badge--warning';
      case 'Low':
        return 'oh-badge--success';
      default:
        return 'oh-badge--neutral';
    }
  }

  statusBadgeClass(status: BugStatus): string {
    switch (status) {
      case 'Open':
        return 'oh-badge--info';
      case 'In Progress':
        return 'oh-badge--warning';
      case 'Fixed':
        return 'oh-badge--success';
      case 'Reopened':
        return 'oh-badge--error oh-badge--outline';
      case 'Closed':
        return 'oh-badge--neutral';
      default:
        return 'oh-badge--neutral';
    }
  }

  isSelected(bug: Bug): boolean {
    return this.selected().has(bug.id);
  }

  toggleSelect(bug: Bug): void {
    this.selected.update(set => {
      const next = new Set(set);
      if (next.has(bug.id)) {
        next.delete(bug.id);
      } else {
        next.add(bug.id);
      }
      return next;
    });
  }

  toggleSelectAll(): void {
    const shouldSelect = !this.allSelectedOnPage();
    this.selected.update(set => {
      const next = new Set(set);
      for (const r of this.pageRows()) {
        if (shouldSelect) {
          next.add(r.id);
        } else {
          next.delete(r.id);
        }
      }
      return next;
    });
  }

  // --- CRUD Operations ---

  openRaiseForm(): void {
    this.isEditMode.set(false);
    this.editingBugId.set(null);

    this.bugForm.reset({
      id: this.generateNextKey(),
      title: '',
      severity: 'Major',
      priority: 'Med',
      status: 'Open',
      reportedBy: ''
    });

    this.showForm.set(true);
    document.body.classList.add('oh-modal-open');
  }

  openEditForm(bug: Bug): void {
    this.isEditMode.set(true);
    this.editingBugId.set(bug.id);

    this.bugForm.reset({
      id: bug.id,
      title: bug.title,
      severity: bug.severity,
      priority: bug.priority,
      status: bug.status,
      reportedBy: bug.reportedBy
    });

    this.showForm.set(true);
    document.body.classList.add('oh-modal-open');
  }

  closeForm(): void {
    this.showForm.set(false);
    document.body.classList.remove('oh-modal-open');
  }

  saveBug(): void {
    if (this.bugForm.invalid) {
      this.bugForm.markAllAsTouched();
      return;
    }

    const value = this.bugForm.getRawValue() as Bug;

    if (this.isEditMode()) {
      const oldId = this.editingBugId();
      this.allBugs.update(list => list.map(b => (b.id === oldId ? { ...b, ...value } : b)));
    } else {
      if (this.allBugs().some(b => b.id === value.id)) {
        this.bugForm.get('id')?.setErrors({ duplicate: true });
        return;
      }
      this.allBugs.update(list => [value, ...list]);
    }

    this.closeForm();
  }

  deleteBug(bug: Bug): void {
    if (confirm(`Are you sure you want to delete bug "${bug.id}: ${bug.title}"?`)) {
      this.allBugs.update(list => list.filter(b => b.id !== bug.id));

      this.selected.update(set => {
        if (!set.has(bug.id)) {
          return set;
        }
        const next = new Set(set);
        next.delete(bug.id);
        return next;
      });

      const maxPageIndex = Math.max(0, this.pageCount() - 1);
      if (this.pageIndex() > maxPageIndex) {
        this.pageIndex.set(maxPageIndex);
      }
    }
  }

  generateNextKey(): string {
    const nums = this.allBugs()
      .map(b => parseInt(b.id.replace('BUG-', ''), 10))
      .filter(n => !isNaN(n));
    const nextNum = nums.length > 0 ? Math.max(...nums) + 1 : 201;
    return `BUG-${nextNum}`;
  }
}
