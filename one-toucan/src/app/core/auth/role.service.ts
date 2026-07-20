import { Injectable, computed, inject } from '@angular/core';
import { CurrentUserService } from './current-user.service';
import { Role, RoleAssignment } from './role.model';

// Small email -> role directory, mirroring the app's existing pattern of
// hardcoded simulated personas (e.g. the CTO approver in the proposal wizard).
// Unmatched emails default to 'manager' (full access) so the default demo
// experience stays unrestricted — only these named personas demonstrate the
// restricted flow.
const ROLE_DIRECTORY: RoleAssignment[] = [
  { email: 'lokesh.kanuboina@toucanus.com', role: 'developer', displayName: 'Lokesh Kanuboina' },
  { email: 'manager@toucanus.com', role: 'manager' },
  { email: 'ba@toucanus.com', role: 'ba', displayName: 'Vikram Kapoor' },
  { email: 'test@toucanus.com', role: 'tester', displayName: 'Arman Khan' }
];

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly currentUser = inject(CurrentUserService);

  private readonly assignment = computed<RoleAssignment | null>(() => {
    const email = this.currentUser.email().trim().toLowerCase();
    return ROLE_DIRECTORY.find(a => a.email.toLowerCase() === email) ?? null;
  });

  readonly role = computed<Role>(() => this.assignment()?.role ?? 'manager');
  readonly currentUserDisplayName = computed<string | null>(() => this.assignment()?.displayName ?? null);

  isManager(): boolean {
    return this.role() === 'manager';
  }

  isBa(): boolean {
    return this.role() === 'ba';
  }

  isDeveloper(): boolean {
    return this.role() === 'developer';
  }

  isTester(): boolean {
    return this.role() === 'tester';
  }

  canManageProjects(): boolean {
    return this.isManager();
  }

  canCreateRequirement(): boolean {
    return this.isManager() || this.isBa();
  }

  canCreateUserStory(): boolean {
    return this.isManager() || this.isBa();
  }

  canCreateTask(): boolean {
    return this.isManager() || this.isDeveloper();
  }

  canUploadTechDoc(project: { status: 'active' | 'completed' }): boolean {
    return this.isManager() || (this.isDeveloper() && project.status === 'completed');
  }

  canMarkCompleted(): boolean {
    return this.isManager();
  }

  canCreateTestCase(): boolean {
    return this.isManager() || this.isTester();
  }

  canRaiseIncident(): boolean {
    return this.isManager() || this.isTester();
  }

  roleLabel(): string {
    switch (this.role()) {
      case 'manager': return 'Manager';
      case 'ba': return 'Business Analyst';
      case 'developer': return 'Developer';
      case 'tester': return 'Tester';
    }
  }

  roleBadgeClass(): string {
    switch (this.role()) {
      case 'manager': return 'oh-badge--success';
      case 'ba': return 'oh-badge--violet';
      case 'developer': return 'oh-badge--info';
      case 'tester': return 'oh-badge--warning';
    }
  }
}
