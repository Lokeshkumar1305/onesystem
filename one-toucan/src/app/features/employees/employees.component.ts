import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { EMPLOYEES_DATA, EmployeeRecord } from './employees.data';

@Component({
  selector: 'oh-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatTableModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {
  readonly tabs = ['All - 428', 'Engineering', 'Delivery', 'Design'];
  readonly columns = ['name', 'role', 'location', 'utilization', 'status'];
  readonly pageSizeOptions = [10, 25, 50];

  readonly activeTab = signal('All - 428');
  searchQuery = '';
  private readonly searchSignal = signal('');
  readonly pageSize = signal(10);
  readonly pageIndex = signal(0);

  readonly filtered = computed(() => {
    const q = this.searchSignal().trim().toLowerCase();
    const tab = this.activeTab();
    let records = EMPLOYEES_DATA;

    // Filter by department tab
    if (tab !== 'All - 428') {
      records = records.filter(e => e.department.toLowerCase() === tab.toLowerCase());
    }

    // Filter by search query
    if (q) {
      records = records.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
      );
    }

    return records;
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
    const visible = Math.min(this.pageCount(), EmployeesComponent.MAX_VISIBLE_PAGES);
    return Array.from({ length: visible }, (_, i) => i + 1);
  });

  readonly hasMorePages = computed(() => this.pageCount() > EmployeesComponent.MAX_VISIBLE_PAGES);

  onSearchChange(value: string): void {
    this.searchQuery = value;
    this.searchSignal.set(value);
    this.pageIndex.set(0);
  }

  selectTab(tab: string): void {
    this.activeTab.set(tab);
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

  initials(name: string): string {
    const parts = name.split(' ').filter(Boolean);
    if (!parts.length) {
      return '?';
    }
    return (parts[0][0] + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
  }

  statusBadgeClass(status: 'Active' | 'On Leave' | 'Notice'): string {
    switch (status) {
      case 'Active':
        return 'oh-badge--success';
      case 'On Leave':
        return 'oh-badge--warning';
      case 'Notice':
        return 'oh-badge--info';
      default:
        return 'oh-badge--neutral';
    }
  }
}
