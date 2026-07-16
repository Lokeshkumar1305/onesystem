import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CurrentUserService } from '../../core/auth/current-user.service';
import { WorkspaceModuleService } from '../../core/workspace/workspace-module.service';

import { LogoComponent } from '../../shared/ui/logo/logo.component';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
}

@Component({
  selector: 'oh-sidenav',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, LogoComponent],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit, OnDestroy {
  private routerSub?: Subscription;

  readonly activeModule = this.workspaceModules.activeModule;
  readonly groups = computed(() => this.activeModule()?.groups ?? []);

  activeRoute = '';

  constructor(
    private readonly router: Router,
    private readonly currentUser: CurrentUserService,
    private readonly workspaceModules: WorkspaceModuleService
  ) {}

  ngOnInit(): void {
    this.syncActiveState(this.router.url);
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => this.syncActiveState((event as NavigationEnd).urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private syncActiveState(url: string): void {
    this.activeRoute = url.split('?')[0].split('#')[0];
    this.workspaceModules.syncFromUrl(this.activeRoute);
  }

  get userName(): string {
    return this.currentUser.fullName();
  }

  get userInitials(): string {
    return this.currentUser.initials();
  }

  isActive(item: NavItem): boolean {
    return !!item.route && this.activeRoute === item.route;
  }

  select(item: NavItem): void {
    if (item.route) {
      this.router.navigateByUrl(item.route);
    }
  }
}
