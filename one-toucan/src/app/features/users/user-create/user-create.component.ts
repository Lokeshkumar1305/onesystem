import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

import { UsersRolesStateService } from '../../../core/users-roles-state.service';

interface PermissionRow {
  functionName: string;
  create: boolean;
  edit: boolean;
}

@Component({
  selector: 'oh-user-create',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss'
})
export class UserCreateComponent {
  private readonly router = inject(Router);
  private readonly stateService = inject(UsersRolesStateService);

  readonly username = signal('');
  readonly email = signal('');
  readonly clientId = 'CLI-ac8aded9-3173-4427-9165-8aa59b63387d';
  readonly activeAccount = signal(true);

  // Available roles retrieved from the state service
  readonly roles = computed(() => {
    return this.stateService.rolesList().map(r => ({
      ...r,
      selected: false
    }));
  });

  // Locally selected role names
  readonly selectedRoles = signal<Record<string, boolean>>({
    'SUPER_ADMIN': true // default check
  });

  // Dynamic permissions rows
  readonly permissions = signal<PermissionRow[]>([
    { functionName: 'User', create: true, edit: true },
    { functionName: 'Role', create: true, edit: true },
    { functionName: 'Operator', create: true, edit: true },
    { functionName: 'Connector', create: true, edit: true },
    { functionName: 'Workflow', create: true, edit: true },
    { functionName: 'Analytics', create: true, edit: true }
  ]);

  onRoleToggle(roleName: string): void {
    this.selectedRoles.update(sel => {
      const updated = { ...sel, [roleName]: !sel[roleName] };
      
      // Update permissions based on selected roles
      const isSuperAdminSelected = updated['SUPER_ADMIN'];
      const isAdminSelected = updated['ADMIN'];

      this.permissions.update(perms => perms.map(p => {
        if (isSuperAdminSelected) {
          return { ...p, create: true, edit: true };
        } else if (isAdminSelected) {
          // Admin gets edit/create on everything except Roles
          const isRoleFunction = p.functionName === 'Role';
          return { ...p, create: !isRoleFunction, edit: !isRoleFunction };
        } else {
          return { ...p, create: false, edit: false };
        }
      }));

      return updated;
    });
  }

  isRoleSelected(roleName: string): boolean {
    return !!this.selectedRoles()[roleName];
  }

  getRoleFunctionLabel(roleName: string): string {
    if (roleName === 'SUPER_ADMIN') return 'Platform Super Administrator';
    if (roleName === 'ADMIN') return 'Tenant Administrator';
    return 'Custom Function';
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  onCreateNewRole(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/roles/create']);
  }

  onSubmit(): void {
    if (!this.username().trim() || !this.email().trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    // Determine primary role from selected
    let roleToAssign: 'SUPER_ADMIN' | 'ADMIN' = 'ADMIN';
    if (this.selectedRoles()['SUPER_ADMIN']) {
      roleToAssign = 'SUPER_ADMIN';
    }

    this.stateService.addUser({
      username: this.username().trim(),
      email: this.email().trim(),
      role: roleToAssign,
      status: this.activeAccount()
    });

    this.router.navigate(['/users']);
  }
}
