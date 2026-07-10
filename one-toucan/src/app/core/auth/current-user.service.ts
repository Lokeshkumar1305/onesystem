import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  // Defaults to the login form's demo email so the header/sidenav show a real
  // name even before a fresh sign-in in this demo build.
  private readonly emailSignal = signal('lokesh.kanuboina@toucanus.com');

  readonly email = this.emailSignal.asReadonly();
  readonly fullName = computed(() => this.deriveFullName(this.emailSignal()));
  readonly initials = computed(() => this.deriveInitials(this.fullName()));

  setEmail(email: string): void {
    this.emailSignal.set(email);
  }

  private deriveFullName(email: string): string {
    const localPart = email.split('@')[0] ?? '';
    const parts = localPart.split(/[._-]+/).filter(Boolean);
    if (!parts.length) {
      return 'User';
    }
    return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(' ');
  }

  private deriveInitials(fullName: string): string {
    const parts = fullName.split(' ').filter(Boolean);
    if (!parts.length) {
      return '?';
    }
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}
