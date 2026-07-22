import { CommonModule } from '@angular/common';
import { Component, computed, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

import { UsersRolesStateService, UserRecord } from '../../core/users-roles-state.service';

@Component({
  selector: 'oh-users',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatTooltipModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  private readonly router = inject(Router);
  private readonly stateService = inject(UsersRolesStateService);

  readonly usersList = this.stateService.usersList;

  readonly pageSizeOptions = [10, 25, 50];
  readonly pageSize = signal(10);
  readonly pageIndex = signal(0);
  readonly searchQuery = signal('');

  // Selected user for detailed view drawer
  readonly selectedUser = signal<UserRecord | null>(null);

  // Toast message state
  readonly toastMessage = signal<string | null>(null);

  readonly filteredUsers = computed(() => {
    const term = this.searchQuery().trim().toLowerCase();
    const list = this.usersList();
    if (!term) return list;
    return list.filter(u =>
      u.username.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term) ||
      u.registeredOn.toLowerCase().includes(term)
    );
  });

  readonly totalCount = computed(() => this.filteredUsers().length);
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.totalCount() / this.pageSize())));

  readonly pageRows = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredUsers().slice(start, start + this.pageSize());
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

  toggleStatus(user: UserRecord): void {
    this.stateService.usersList.update(list =>
      list.map(u => (u.id === user.id ? { ...u, status: !u.status } : u))
    );
    this.showToast(`User "${user.username}" status updated!`);
  }

  deleteUser(user: UserRecord, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      this.stateService.usersList.update(list => list.filter(u => u.id !== user.id));
      this.showToast(`User "${user.username}" deleted successfully.`);
      if (this.pageIndex() >= this.pageCount()) {
        this.pageIndex.set(Math.max(0, this.pageCount() - 1));
      }
    }
  }

  openDetails(user: UserRecord, event: Event): void {
    event.stopPropagation();
    this.selectedUser.set(user);
    document.body.classList.add('oh-modal-open');
  }

  closeDetails(): void {
    this.selectedUser.set(null);
    document.body.classList.remove('oh-modal-open');
  }

  createUser(): void {
    this.router.navigate(['/users/create']);
  }

  initials(username: string): string {
    if (!username) return 'US';
    return username.slice(0, 2).toUpperCase();
  }

  roleBadgeClass(role: string): string {
    switch (role) {
      case 'SUPER_ADMIN': return 'badge-super-admin';
      case 'ADMIN': return 'badge-admin';
      default: return 'badge-default';
    }
  }

  private showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4000);
  }
}
