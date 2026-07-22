import { CommonModule } from '@angular/common';
import { Component, computed, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

import { UsersRolesStateService, RoleRecord } from '../../core/users-roles-state.service';

@Component({
  selector: 'oh-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatTooltipModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent {
  private readonly router = inject(Router);
  private readonly stateService = inject(UsersRolesStateService);

  readonly rolesList = this.stateService.rolesList;

  readonly pageSizeOptions = [5, 10, 25];
  readonly pageSize = signal(5);
  readonly pageIndex = signal(0);
  readonly searchQuery = signal('');

  // Selected role for detailed view drawer
  readonly selectedRole = signal<RoleRecord | null>(null);

  // Toast message state
  readonly toastMessage = signal<string | null>(null);

  readonly filteredRoles = computed(() => {
    const term = this.searchQuery().trim().toLowerCase();
    const list = this.rolesList();
    if (!term) return list;
    return list.filter(r =>
      r.name.toLowerCase().includes(term) ||
      r.description.toLowerCase().includes(term)
    );
  });

  readonly totalCount = computed(() => this.filteredRoles().length);
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.totalCount() / this.pageSize())));

  readonly pageRows = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredRoles().slice(start, start + this.pageSize());
  });

  readonly rangeStart = computed(() => (this.totalCount() ? this.pageIndex() * this.pageSize() + 1 : 0));
  readonly rangeEnd = computed(() => Math.min(this.rangeStart() + this.pageSize() - 1, this.totalCount()));

  readonly pageNumbers = computed(() => {
    const count = this.pageCount();
    return Array.from({ length: count }, (_, i) => i + 1);
  });

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
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

  deleteRole(role: RoleRecord, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete role "${role.name}"?`)) {
      this.stateService.rolesList.update(list => list.filter(r => r.id !== role.id));
      this.showToast(`Role "${role.name}" deleted successfully.`);
      if (this.pageIndex() >= this.pageCount()) {
        this.pageIndex.set(Math.max(0, this.pageCount() - 1));
      }
    }
  }

  openDetails(role: RoleRecord, event: Event): void {
    event.stopPropagation();
    this.selectedRole.set(role);
    document.body.classList.add('oh-modal-open');
  }

  closeDetails(): void {
    this.selectedRole.set(null);
    document.body.classList.remove('oh-modal-open');
  }

  createRole(): void {
    this.router.navigate(['/roles/create']);
  }

  private showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4000);
  }
}
