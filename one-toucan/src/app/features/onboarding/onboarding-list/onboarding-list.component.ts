import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';

import { ONBOARDING_CANDIDATES, OnboardingCandidate, OnboardingStage } from './onboarding-list.data';

@Component({
  selector: 'oh-onboarding-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatTableModule],
  templateUrl: './onboarding-list.component.html',
  styleUrl: './onboarding-list.component.scss'
})
export class OnboardingListComponent {
  private readonly allCandidates = signal(ONBOARDING_CANDIDATES);

  readonly columns = ['select', 'name', 'role', 'department', 'phone', 'startDate', 'stage', 'actions'];
  readonly pageSizeOptions = [10, 25, 50];

  searchQuery = '';
  private readonly searchSignal = signal('');
  readonly pageSize = signal(10);
  readonly pageIndex = signal(0);
  readonly selected = signal<ReadonlySet<string>>(new Set());

  readonly totalHires = computed(() => this.allCandidates().length);
  readonly departmentCount = computed(() => new Set(this.allCandidates().map(c => c.department)).size);

  readonly filtered = computed(() => {
    const q = this.searchSignal().trim().toLowerCase();
    const candidates = this.allCandidates();
    if (!q) {
      return candidates;
    }
    return candidates.filter(
      c => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.department.toLowerCase().includes(q)
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
    const visible = Math.min(this.pageCount(), OnboardingListComponent.MAX_VISIBLE_PAGES);
    return Array.from({ length: visible }, (_, i) => i + 1);
  });

  readonly hasMorePages = computed(() => this.pageCount() > OnboardingListComponent.MAX_VISIBLE_PAGES);

  readonly allSelectedOnPage = computed(() => {
    const rows = this.pageRows();
    return rows.length > 0 && rows.every(c => this.selected().has(c.email));
  });

  constructor(private readonly router: Router) {}

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

  initials(name: string): string {
    const parts = name.split(' ').filter(Boolean);
    if (!parts.length) {
      return '?';
    }
    return (parts[0][0] + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
  }

  stageBadgeClass(stage: OnboardingStage): string {
    switch (stage) {
      case 'Completed':
        return 'oh-badge--success';
      case 'In Progress':
        return 'oh-badge--info';
      default:
        return 'oh-badge--neutral';
    }
  }

  roleBadgeClass(department: string): string {
    switch (department) {
      case 'Engineering':
        return 'oh-badge--info oh-badge--outline';
      case 'Analytics':
        return 'oh-badge--violet oh-badge--outline';
      case 'Design':
        return 'oh-badge--pink oh-badge--outline';
      case 'Sales':
        return 'oh-badge--success oh-badge--outline';
      case 'Human Resources':
        return 'oh-badge--warning oh-badge--outline';
      default:
        return 'oh-badge--neutral oh-badge--outline';
    }
  }

  isSelected(candidate: OnboardingCandidate): boolean {
    return this.selected().has(candidate.email);
  }

  toggleSelect(candidate: OnboardingCandidate): void {
    this.selected.update(set => {
      const next = new Set(set);
      if (next.has(candidate.email)) {
        next.delete(candidate.email);
      } else {
        next.add(candidate.email);
      }
      return next;
    });
  }

  toggleSelectAll(): void {
    const shouldSelect = !this.allSelectedOnPage();
    this.selected.update(set => {
      const next = new Set(set);
      for (const c of this.pageRows()) {
        if (shouldSelect) {
          next.add(c.email);
        } else {
          next.delete(c.email);
        }
      }
      return next;
    });
  }

  addHire(): void {
    this.router.navigateByUrl('/onboarding/new');
  }

  editHire(): void {
    this.router.navigateByUrl('/onboarding/new');
  }

  deleteHire(candidate: OnboardingCandidate): void {
    this.allCandidates.update(list => list.filter(c => c.email !== candidate.email));

    this.selected.update(set => {
      if (!set.has(candidate.email)) {
        return set;
      }
      const next = new Set(set);
      next.delete(candidate.email);
      return next;
    });

    const maxPageIndex = Math.max(0, this.pageCount() - 1);
    if (this.pageIndex() > maxPageIndex) {
      this.pageIndex.set(maxPageIndex);
    }
  }
}
