import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Router } from '@angular/router';
import { CurrentUserService } from '../../core/auth/current-user.service';
import { WorkspaceModule, WorkspaceModuleService } from '../../core/workspace/workspace-module.service';

@Component({
  selector: 'oh-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() pageTitle = '';
  @Input() pageSubtitle = '';

  searchQuery = '';

  readonly userRole = 'CTO · Admin';
  readonly notificationCount = 4;

  constructor(
    private readonly currentUser: CurrentUserService,
    private readonly workspaceModules: WorkspaceModuleService,
    private readonly router: Router
  ) {}

  get userName(): string {
    return this.currentUser.fullName();
  }

  get activeModuleLabel(): string {
    return this.workspaceModules.activeModule()?.label ?? '';
  }

  get userInitials(): string {
    return this.currentUser.initials();
  }

  get workspaceModulesList(): WorkspaceModule[] {
    return this.workspaceModules.modules;
  }

  switchApp(module: WorkspaceModule): void {
    this.workspaceModules.setActiveModule(module.id);
    this.router.navigateByUrl(module.homeRoute);
  }

  goToPortalSelector(): void {
    this.router.navigateByUrl('/home');
  }

  getAppAccentBg(accent: string): string {
    switch (accent) {
      case 'violet': return 'var(--oh-violet-bg)';
      case 'teal': return 'var(--oh-primary-soft)';
      case 'amber': return 'var(--oh-accent-50)';
      default: return 'var(--oh-gray-100)';
    }
  }

  getAppAccentColor(accent: string): string {
    switch (accent) {
      case 'violet': return 'var(--oh-violet)';
      case 'teal': return 'var(--oh-primary)';
      case 'amber': return 'var(--oh-accent-600)';
      default: return 'var(--oh-gray-700)';
    }
  }
}
