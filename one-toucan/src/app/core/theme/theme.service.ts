import { Injectable, signal } from '@angular/core';

export type OhTheme = 'teal' | 'indigo' | 'slate' | 'plum' | 'forest';

const STORAGE_KEY = 'oh-theme';
const DEFAULT_THEME: OhTheme = 'teal';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<OhTheme>(this.readStoredTheme());

  constructor() {
    this.apply(this.theme());
  }

  setTheme(theme: OhTheme): void {
    this.theme.set(theme);
    this.apply(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  private apply(theme: OhTheme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  private readStoredTheme(): OhTheme {
    const stored = localStorage.getItem(STORAGE_KEY) as OhTheme | null;
    return stored ?? DEFAULT_THEME;
  }
}
