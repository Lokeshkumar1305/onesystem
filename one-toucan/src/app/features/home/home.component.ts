import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { CurrentUserService } from '../../core/auth/current-user.service';
import { WorkspaceModule, WorkspaceModuleService } from '../../core/workspace/workspace-module.service';

@Component({
  selector: 'oh-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly now = new Date();

  readonly modules = this.workspaceModules.modules;

  constructor(
    private readonly router: Router,
    private readonly workspaceModules: WorkspaceModuleService,
    private readonly currentUser: CurrentUserService
  ) {}

  get userFirstName(): string {
    return this.currentUser.fullName().split(' ')[0];
  }

  get greeting(): string {
    const hour = this.now.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  highlightItems(module: WorkspaceModule): string[] {
    return module.groups.flatMap(group => group.items.map(item => item.label)).slice(0, 4);
  }

  enterModule(module: WorkspaceModule): void {
    this.workspaceModules.setActiveModule(module.id);
    this.router.navigateByUrl(module.homeRoute);
  }
}
