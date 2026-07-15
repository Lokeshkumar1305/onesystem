import { CommonModule } from '@angular/common';
import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subscription } from 'rxjs';

import { INITIAL_REQUIREMENTS, Requirement, RequirementPriority, RequirementStatus, RequirementType } from './requirements.data';

@Component({
  selector: 'oh-requirements',
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
  templateUrl: './requirements.component.html',
  styleUrl: './requirements.component.scss'
})
export class RequirementsComponent implements OnInit, OnDestroy {
  readonly allRequirements = signal<Requirement[]>(INITIAL_REQUIREMENTS);

  readonly columns = ['select', 'requirement', 'priority', 'pts', 'status', 'actions'];
  readonly pageSizeOptions = [10, 25, 50];

  searchQuery = '';
  private readonly searchSignal = signal('');
  readonly pageSize = signal(10);
  readonly pageIndex = signal(0);
  readonly selected = signal<ReadonlySet<string>>(new Set());

  // Form overlay drawer state
  readonly showForm = signal(false);
  readonly isEditMode = signal(false);
  readonly editingRequirementId = signal<string | null>(null);

  readonly requirementForm: FormGroup;
  private typeChangeSub?: Subscription;

  readonly typeOptions: RequirementType[] = ['EPIC', 'STORY', 'TASK', 'BUG'];
  readonly priorityOptions: RequirementPriority[] = ['High', 'Med', 'Low'];
  readonly statusOptions: RequirementStatus[] = ['In Sprint', 'In Progress', 'To Do', 'Ready'];

  // Calculations
  readonly totalRequirements = computed(() => this.allRequirements().length);
  readonly totalPoints = computed(() => this.allRequirements().reduce((sum, r) => sum + r.pts, 0));

  readonly filtered = computed(() => {
    const q = this.searchSignal().trim().toLowerCase();
    const list = this.allRequirements();
    if (!q) {
      return list;
    }
    return list.filter(
      r =>
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q) ||
        r.priority.toLowerCase().includes(q)
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
    const visible = Math.min(this.pageCount(), RequirementsComponent.MAX_VISIBLE_PAGES);
    return Array.from({ length: visible }, (_, i) => i + 1);
  });

  readonly hasMorePages = computed(() => this.pageCount() > RequirementsComponent.MAX_VISIBLE_PAGES);

  readonly allSelectedOnPage = computed(() => {
    const rows = this.pageRows();
    return rows.length > 0 && rows.every(r => this.selected().has(r.id));
  });

  constructor(private readonly fb: FormBuilder) {
    this.requirementForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern(/^PSE-[A-Z]*\d+$/)]],
      type: ['STORY', Validators.required],
      title: ['', Validators.required],
      priority: ['Med', Validators.required],
      pts: [1, [Validators.required, Validators.min(0)]],
      status: ['To Do', Validators.required]
    });
  }

  ngOnInit(): void {
    // Automatically pre-populate ID field when Requirement Type changes in Add mode
    this.typeChangeSub = this.requirementForm.get('type')?.valueChanges.subscribe(type => {
      if (!this.isEditMode() && type) {
        this.requirementForm.patchValue({ id: this.generateNextKey(type) });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.typeChangeSub) {
      this.typeChangeSub.unsubscribe();
    }
    document.body.classList.remove('oh-modal-open');
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

  typeBadgeClass(type: RequirementType): string {
    switch (type) {
      case 'EPIC':
        return 'oh-badge--violet';
      case 'STORY':
        return 'oh-badge--info';
      case 'TASK':
        return 'oh-badge--success';
      case 'BUG':
        return 'oh-badge--error';
      default:
        return 'oh-badge--neutral';
    }
  }

  priorityBadgeClass(priority: RequirementPriority): string {
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

  statusBadgeClass(status: RequirementStatus): string {
    switch (status) {
      case 'In Sprint':
        return 'oh-badge--success';
      case 'In Progress':
        return 'oh-badge--info';
      case 'To Do':
        return 'oh-badge--neutral';
      case 'Ready':
        return 'oh-badge--success oh-badge--outline';
      default:
        return 'oh-badge--neutral';
    }
  }

  isSelected(req: Requirement): boolean {
    return this.selected().has(req.id);
  }

  toggleSelect(req: Requirement): void {
    this.selected.update(set => {
      const next = new Set(set);
      if (next.has(req.id)) {
        next.delete(req.id);
      } else {
        next.add(req.id);
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

  openAddForm(): void {
    this.isEditMode.set(false);
    this.editingRequirementId.set(null);
    
    const nextKey = this.generateNextKey('STORY');
    this.requirementForm.reset({
      id: nextKey,
      type: 'STORY',
      title: '',
      priority: 'Med',
      pts: 5,
      status: 'To Do'
    });

    this.showForm.set(true);
    document.body.classList.add('oh-modal-open');
  }

  openEditForm(req: Requirement): void {
    this.isEditMode.set(true);
    this.editingRequirementId.set(req.id);

    this.requirementForm.reset({
      id: req.id,
      type: req.type,
      title: req.title,
      priority: req.priority,
      pts: req.pts,
      status: req.status
    });

    this.showForm.set(true);
    document.body.classList.add('oh-modal-open');
  }

  closeForm(): void {
    this.showForm.set(false);
    document.body.classList.remove('oh-modal-open');
  }

  saveRequirement(): void {
    if (this.requirementForm.invalid) {
      this.requirementForm.markAllAsTouched();
      return;
    }

    const value = this.requirementForm.getRawValue() as Requirement;

    if (this.isEditMode()) {
      const oldId = this.editingRequirementId();
      this.allRequirements.update(list =>
        list.map(r => (r.id === oldId ? { ...r, ...value } : r))
      );
      
      // Update selected set if the id changed
      if (oldId && oldId !== value.id) {
        this.selected.update(set => {
          if (!set.has(oldId)) return set;
          const next = new Set(set);
          next.delete(oldId);
          next.add(value.id);
          return next;
        });
      }
    } else {
      // Check if ID is unique
      if (this.allRequirements().some(r => r.id === value.id)) {
        this.requirementForm.get('id')?.setErrors({ duplicate: true });
        return;
      }
      this.allRequirements.update(list => [...list, value]);
    }

    this.closeForm();
  }

  deleteRequirement(req: Requirement): void {
    if (confirm(`Are you sure you want to delete requirement "${req.id}: ${req.title}"?`)) {
      this.allRequirements.update(list => list.filter(r => r.id !== req.id));

      this.selected.update(set => {
        if (!set.has(req.id)) {
          return set;
        }
        const next = new Set(set);
        next.delete(req.id);
        return next;
      });

      const maxPageIndex = Math.max(0, this.pageCount() - 1);
      if (this.pageIndex() > maxPageIndex) {
        this.pageIndex.set(maxPageIndex);
      }
    }
  }

  generateNextKey(type: RequirementType): string {
    const list = this.allRequirements();
    if (type === 'EPIC') {
      const epicNums = list
        .filter(r => r.type === 'EPIC' && /^PSE-E\d+$/.test(r.id))
        .map(r => parseInt(r.id.replace('PSE-E', ''), 10))
        .filter(n => !isNaN(n));
      const nextNum = epicNums.length > 0 ? Math.max(...epicNums) + 1 : 1;
      return `PSE-E${nextNum}`;
    } else {
      const nonEpicNums = list
        .filter(r => r.type !== 'EPIC' && /^PSE-\d+$/.test(r.id))
        .map(r => parseInt(r.id.replace('PSE-', ''), 10))
        .filter(n => !isNaN(n));
      const nextNum = nonEpicNums.length > 0 ? Math.max(...nonEpicNums) + 1 : 163;
      return `PSE-${nextNum}`;
    }
  }
}
