import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import { HeaderComponent } from '../header/header.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TempBreadcrumbComponent } from '../temp-breadcrumb/temp-breadcrumb.component';
import { WorkspaceModuleService } from '../../core/workspace/workspace-module.service';

@Component({
  selector: 'oh-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatSidenavModule, HeaderComponent, SidenavComponent, TempBreadcrumbComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent implements OnInit {
  pageTitle = '';
  pageSubtitle = '';

  constructor(
    public readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly workspaceModules: WorkspaceModuleService
  ) {}

  ngOnInit(): void {
    this.updatePageMeta();
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => this.updatePageMeta());
  }

  // TEMP: true on /temp-project or /temp-profile — the routes the real
  // WorkspaceModuleService-driven tabs below don't know about.
  get isTempRoute(): boolean {
    const path = this.router.url.split('?')[0].split('#')[0];
    return path.startsWith('/temp-project') || path.startsWith('/temp-profile');
  }

  get hideHeaderTitle(): boolean {
    if (this.isTempRoute) {
      return true;
    }
    const mod = this.workspaceModules.activeModule();
    return mod?.id === 'users-roles' || mod?.id === 'project-management';
  }


  get activeModuleLabel(): string {
    return this.workspaceModules.activeModule()?.label ?? 'Workspace';
  }

  get activeModuleTabs(): { label: string; route: string }[] {
    const mod = this.workspaceModules.activeModule();
    if (!mod) return [];

    if (mod.id === 'users-roles') {
      const currentUrlPath = this.router.url.split('?')[0].split('#')[0];
      if (currentUrlPath.startsWith('/users')) {
        return [{ label: 'Users', route: '/users' }];
      }
      if (currentUrlPath.startsWith('/roles')) {
        return [{ label: 'Roles', route: '/roles' }];
      }
    }

    if (mod.id === 'onehr') {
      const currentUrlPath = this.router.url.split('?')[0].split('#')[0];
      if (currentUrlPath === '/profile') {
        return [
          { label: 'Dashboard', route: '/onehr-dashboard' },
          { label: 'Profile', route: '/profile' }
        ];
      }
      if (this.router.url.includes('subview=announcements')) {
        return [
          { label: 'Dashboard', route: '/onehr-dashboard' },
          { label: 'Announcements', route: '/onehr-dashboard?subview=announcements' }
        ];
      }
      return [
        { label: 'Dashboard', route: '/onehr-dashboard' }
      ];
    }

    const currentUrlPath = this.router.url.split('?')[0].split('#')[0];

    // Find the group that contains the current active route
    const activeGroup = mod.groups.find(group =>
      group.items.some(item =>
        item.route && (currentUrlPath === item.route || currentUrlPath.startsWith(item.route + '/'))
      )
    );

    // If an active group is found, return its items (that have routes)
    if (activeGroup) {
      const tabs: { label: string; route: string }[] = [];
      for (const item of activeGroup.items) {
        if (item.route) {
          tabs.push({ label: item.label, route: item.route });
        }
      }
      return tabs.filter((t, i, self) => self.findIndex(o => o.route === t.route) === i);
    }

    // Fallback: If no group matches (e.g. at a parent level), return all routes
    const fallbackTabs: { label: string; route: string }[] = [];
    for (const group of mod.groups) {
      for (const item of group.items) {
        if (item.route) {
          fallbackTabs.push({ label: item.label, route: item.route });
        }
      }
    }
    return fallbackTabs.filter((t, i, self) => self.findIndex(o => o.route === t.route) === i);
  }

  isTabActive(tab: { label: string; route: string }): boolean {
    const currentUrl = this.router.url;
    if (tab.route.includes('subview=')) {
      return currentUrl.includes(tab.route);
    }
    if (tab.route === '/onehr-dashboard') {
      return currentUrl === '/onehr-dashboard' || currentUrl === '/onehr-dashboard/';
    }
    const currentUrlPath = this.router.url.split('?')[0].split('#')[0];
    return currentUrlPath === tab.route || currentUrlPath.startsWith(tab.route + '/');
  }

  navigateToTab(tab: { label: string; route: string }): void {
    this.router.navigateByUrl(tab.route);
  }

  goToHome(): void {
    this.router.navigateByUrl('/home');
  }

  goToActiveModuleHome(): void {
    const home = this.workspaceModules.activeModule()?.homeRoute;
    if (home) {
      this.router.navigateByUrl(home);
    }
  }

  private updatePageMeta(): void {
    let active = this.route.firstChild;
    while (active?.firstChild) {
      active = active.firstChild;
    }
    const data = active?.snapshot.data ?? {};

    const currentUrl = this.router.url;
    if (currentUrl.includes('subview=announcements')) {
      this.pageTitle = 'Announcements';
      this.pageSubtitle = 'Publish and manage company announcements';
    } else {
      this.pageTitle = data['title'] ?? '';
      this.pageSubtitle = data['subtitle'] ?? '';
    }
  }
}
