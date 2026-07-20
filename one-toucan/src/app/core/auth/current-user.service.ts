import { Injectable, computed, signal } from '@angular/core';

const SESSION_STORAGE_KEY = 'oh-current-user-email';
const DEFAULT_EMAIL = 'lokesh.kanuboina@toucanus.com';

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  // Persisted per browser tab via sessionStorage (never localStorage, which
  // is shared across every tab of the origin and would make separate tabs
  // overwrite each other's login). Without this, any page reload — including
  // the dev server's own live-reload — reset the in-memory signal back to
  // the hardcoded default email, making every open tab appear to spontaneously
  // "log back in" as that default user.
  private readonly emailSignal = signal(this.readStoredEmail());

  readonly email = this.emailSignal.asReadonly();
  readonly fullName = computed(() => this.deriveFullName(this.emailSignal()));
  readonly initials = computed(() => this.deriveInitials(this.fullName()));

  setEmail(email: string): void {
    this.emailSignal.set(email);
    this.persistEmail(email);
  }

  logout(): void {
    this.emailSignal.set('');
    this.persistEmail('');
  }

  private readStoredEmail(): string {
    try {
      return sessionStorage.getItem(SESSION_STORAGE_KEY) ?? DEFAULT_EMAIL;
    } catch {
      return DEFAULT_EMAIL;
    }
  }

  private persistEmail(email: string): void {
    try {
      if (email) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, email);
      } else {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // sessionStorage unavailable (e.g. private browsing) — in-memory state
      // still works for the current page lifetime.
    }
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
