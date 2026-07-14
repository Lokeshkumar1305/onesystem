import { CommonModule } from '@angular/common';
import { Component, computed, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';

import {
  DEFAULT_BRANCHES,
  DEFAULT_COST_CENTERS,
  DEFAULT_DEPARTMENTS,
  DepartmentNode,
  DepartmentTreeRow
} from './organization.data';
import { DepartmentTreeNodeComponent } from './organization-tree-node.component';

@Component({
  selector: 'oh-organization',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    DepartmentTreeNodeComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.scss'
})
export class OrganizationComponent implements OnDestroy {
  // Signals for state
  readonly departments = signal<DepartmentNode[]>(DEFAULT_DEPARTMENTS);
  readonly branches = signal(DEFAULT_BRANCHES);
  readonly costCenters = signal(DEFAULT_COST_CENTERS);

  // Organizations list & active selection
  readonly organizations = signal<string[]>(['Toucan Payments India', 'Toucan UK', 'Toucan US']);
  readonly activeOrganization = signal<string>('Toucan Payments India');

  // Form states
  readonly showAddForm = signal(false);
  readonly showOrgModal = signal(false);
  readonly editingDeptId = signal<string | null>(null);

  newDeptName = '';
  newDeptHead = '';
  newDeptHeadcount: number | null = null;
  newDeptParentId = ''; // Empty means it is a parent department

  // Organization modal form fields
  newOrgName = '';
  newOrgBranch = '';
  newOrgDept = '';

  // KPI Computations
  readonly branchesCount = computed(() => this.branches().length);
  readonly departmentsCount = computed(() => this.departments().length);
  readonly designationsCount = signal(58); // Matches mockup screenshot
  readonly costCentersCount = computed(() => this.costCenters().length);

  // Flattened tree (DFS order) with each department's computed depth — any
  // department can parent any other, to unlimited depth, so level isn't
  // stored on the data itself; it's derived fresh from parentId links.
  readonly departmentRows = computed(() => this.buildTree(this.departments()));

  // Parent-picker options: every department except the one being edited and
  // its own descendants (picking a descendant as parent would create a cycle).
  readonly availableParentDepts = computed(() => {
    const editingId = this.editingDeptId();
    const rows = this.departmentRows();
    if (!editingId) {
      return rows;
    }
    const excluded = this.descendantIds(editingId, this.departments());
    excluded.add(editingId);
    return rows.filter(d => !excluded.has(d.id));
  });

  // Angular templates can't reference `this` directly — needed to pass the
  // component instance itself as the recursive tree node's [host] input.
  get self(): OrganizationComponent {
    return this;
  }

  parentOptionLabel(dept: DepartmentTreeRow): string {
    return (dept.level > 0 ? '—'.repeat(dept.level) + ' ' : '') + dept.name;
  }

  // Grouped by parentId, memoized via computed() so the same array instance
  // is returned across repeated calls until departments() actually changes.
  // [cdkDropListData] needs a STABLE reference — childrenOf() used to call
  // .filter() fresh every change-detection cycle (i.e. on every mousemove
  // during a drag), which silently broke CDK's drop handling mid-drag.
  private readonly childrenByParent = computed(() => {
    const map = new Map<string, DepartmentTreeRow[]>();
    for (const row of this.departmentRows()) {
      const key = row.parentId ?? '';
      const siblings = map.get(key) ?? [];
      siblings.push(row);
      map.set(key, siblings);
    }
    return map;
  });

  // Direct children of a department (or root departments, for undefined),
  // in current sibling order — used to render one cdkDropList per sibling
  // group so drag-reordering stays scoped to that group.
  childrenOf(parentId: string | undefined): DepartmentTreeRow[] {
    return this.childrenByParent().get(parentId ?? '') ?? [];
  }

  // Reorders siblings under parentId only — the flat departments() array
  // isn't grouped, so this moves just the entries that belong to this
  // parent, leaving every other row (including nested descendants) exactly
  // where it was.
  onSiblingDrop(event: CdkDragDrop<DepartmentTreeRow[]>, parentId: string | undefined): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const list = [...this.departments()];
    const siblingIndices: number[] = [];
    list.forEach((dept, index) => {
      if (dept.parentId === parentId) {
        siblingIndices.push(index);
      }
    });

    const siblingItems = siblingIndices.map(index => list[index]);
    moveItemInArray(siblingItems, event.previousIndex, event.currentIndex);
    siblingIndices.forEach((flatIndex, position) => {
      list[flatIndex] = siblingItems[position];
    });

    this.departments.set(list);
  }

  toggleAddForm(): void {
    if (this.showAddForm()) {
      this.closeDeptForm();
      return;
    }
    this.resetForm();
    this.editingDeptId.set(null);
    this.showAddForm.set(true);
  }

  editDepartment(dept: DepartmentNode): void {
    this.newDeptName = dept.name;
    this.newDeptHead = dept.head === '— vacant' ? '' : dept.head;
    this.newDeptHeadcount = dept.headcount;
    this.newDeptParentId = dept.parentId ?? '';
    this.editingDeptId.set(dept.id);
    this.showAddForm.set(true);
  }

  // Opens the Add form with this department pre-selected as parent — the
  // direct route to nesting a new department, instead of hunting for the
  // right entry in the Parent Department dropdown.
  addSubDepartment(dept: DepartmentNode): void {
    this.resetForm();
    this.editingDeptId.set(null);
    this.newDeptParentId = dept.id;
    this.showAddForm.set(true);
  }

  parentNameById(id: string): string {
    return this.departments().find(d => d.id === id)?.name ?? '';
  }

  closeDeptForm(): void {
    this.showAddForm.set(false);
    this.editingDeptId.set(null);
    this.resetForm();
  }

  toggleOrgModal(): void {
    this.showOrgModal.update(val => !val);
    if (this.showOrgModal()) {
      document.body.classList.add('oh-modal-open');
    } else {
      document.body.classList.remove('oh-modal-open');
    }
    this.resetOrgForm();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('oh-modal-open');
  }

  // Depth-first flatten: each department followed immediately by all of its
  // descendants, in insertion order, so any depth of nesting renders correctly
  // as a flat list without needing to keep the raw array itself ordered.
  private buildTree(list: DepartmentNode[]): DepartmentTreeRow[] {
    const childrenByParent = new Map<string | undefined, DepartmentNode[]>();
    for (const dept of list) {
      const key = dept.parentId;
      const siblings = childrenByParent.get(key) ?? [];
      siblings.push(dept);
      childrenByParent.set(key, siblings);
    }

    const rows: DepartmentTreeRow[] = [];
    const visit = (parentId: string | undefined, level: number): void => {
      for (const dept of childrenByParent.get(parentId) ?? []) {
        rows.push({ ...dept, level });
        visit(dept.id, level + 1);
      }
    };
    visit(undefined, 0);
    return rows;
  }

  // All ids nested (at any depth) under the given department id.
  private descendantIds(id: string, list: DepartmentNode[]): Set<string> {
    const result = new Set<string>();
    const stack = [id];
    while (stack.length) {
      const current = stack.pop()!;
      for (const dept of list) {
        if (dept.parentId === current && !result.has(dept.id)) {
          result.add(dept.id);
          stack.push(dept.id);
        }
      }
    }
    return result;
  }

  private rootColor(list: DepartmentNode[]): 'green' | 'blue' | 'purple' {
    const roots = list.filter(d => !d.parentId);
    const colors: Array<'green' | 'blue' | 'purple'> = ['green', 'blue', 'purple'];
    return colors[roots.length % colors.length];
  }

  saveDepartment(): void {
    if (!this.newDeptName.trim()) {
      return;
    }

    const editingId = this.editingDeptId();
    if (editingId) {
      this.updateDepartment(editingId);
    } else {
      this.addDepartment();
    }
  }

  private updateDepartment(id: string): void {
    const name = this.newDeptName.trim();
    const head = this.newDeptHead.trim() || '— vacant';
    const headcount = this.newDeptHeadcount || 0;
    const parentId = this.newDeptParentId || undefined;

    const list = [...this.departments()];
    const index = list.findIndex(d => d.id === id);
    if (index === -1) {
      return;
    }

    const existing = list[index];
    let color = existing.color;

    if (parentId !== existing.parentId) {
      color = parentId
        ? list.find(d => d.id === parentId)?.color ?? existing.color
        : this.rootColor(list.filter(d => d.id !== id));
    }

    // Nesting is derived from parentId alone (buildTree), so no repositioning
    // within the raw array is needed even when the parent changes.
    list[index] = { ...existing, name, head, headcount, parentId, color };
    this.departments.set(list);
    this.closeDeptForm();
  }

  private addDepartment(): void {
    const name = this.newDeptName.trim();
    const head = this.newDeptHead.trim() || '— vacant';
    const headcount = this.newDeptHeadcount || 0;
    const parentId = this.newDeptParentId || undefined;

    const list = [...this.departments()];
    let id = name.replace(/\s+/g, '');
    if (list.some(d => d.id === id)) {
      id = `${id}-${list.length}`;
    }

    const color = parentId
      ? list.find(d => d.id === parentId)?.color ?? this.rootColor(list)
      : this.rootColor(list);

    const newDept: DepartmentNode = { id, name, head, headcount, color, parentId };
    list.push(newDept);

    this.departments.set(list);
    this.closeDeptForm();
  }

  removeDepartment(dept: DepartmentNode): void {
    const toRemove = this.descendantIds(dept.id, this.departments());
    toRemove.add(dept.id);
    this.departments.set(this.departments().filter(d => !toRemove.has(d.id)));
  }

  addOrganization(): void {
    if (!this.newOrgName.trim()) {
      return;
    }

    const orgName = this.newOrgName.trim();
    const branchName = this.newOrgBranch.trim() || 'Headquarters';
    const deptName = this.newOrgDept.trim() || 'General';

    // Add new organization to organizations list
    this.organizations.update(list => [...list, orgName]);
    this.activeOrganization.set(orgName);

    // Populate initial default data for the new organization
    this.departments.set([
      { id: deptName.replace(/\s+/g, ''), name: deptName, head: '— vacant', headcount: 0, color: 'green' }
    ]);
    this.branches.set([
      { code: 'HQ-01', name: branchName, type: 'Flexible', headcount: 0 }
    ]);
    this.costCenters.set([
      { code: 'CC-GEN', name: 'General & Admin', amount: '₹0', progress: 0, color: 'green' }
    ]);

    this.toggleOrgModal();
  }

  switchOrganization(org: string): void {
    this.activeOrganization.set(org);
    if (org === 'Toucan Payments India') {
      this.departments.set(DEFAULT_DEPARTMENTS);
      this.branches.set(DEFAULT_BRANCHES);
      this.costCenters.set(DEFAULT_COST_CENTERS);
    } else {
      const suffix = org.split(' ').pop() || 'HQ';
      this.departments.set([
        { id: 'Engineering', name: 'Engineering', head: 'John Doe', headcount: 45, color: 'green' },
        { id: 'QA', name: 'Quality Assurance', head: 'Jane Smith', headcount: 12, color: 'green', parentId: 'Engineering' }
      ]);
      this.branches.set([
        { code: `${suffix}-01`, name: `${org} Office`, type: 'Flexible', headcount: 57 }
      ]);
      this.costCenters.set([
        { code: `CC-${suffix}`, name: 'Operations', amount: '£450K', progress: 50, color: 'blue' }
      ]);
    }
  }

  private resetForm(): void {
    this.newDeptName = '';
    this.newDeptHead = '';
    this.newDeptHeadcount = null;
    this.newDeptParentId = '';
  }

  private resetOrgForm(): void {
    this.newOrgName = '';
    this.newOrgBranch = '';
    this.newOrgDept = '';
  }
}
