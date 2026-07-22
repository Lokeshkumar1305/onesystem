import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CurrentUserService } from '../../core/auth/current-user.service';
import { ProjectStateService } from '../../core/projects/project-state.service';
import { WorkspaceModuleService } from '../../core/workspace/workspace-module.service';

import { LogoComponent } from '../../shared/ui/logo/logo.component';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'oh-sidenav',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, LogoComponent],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit, OnDestroy {
  private readonly projectState = inject(ProjectStateService);
  private routerSub?: Subscription;

  // TEMP: hides the module-driven nav list while keeping the template markup intact,
  // showing this minimal stand-in list instead. "Project" opens the temp-project
  // dashboard rather than the regular /projects list. Flip hideNavListTemp back to
  // false to restore the original module-driven list.
  readonly hideNavListTemp = true;
  readonly tempNavItems: NavItem[] = [
    { label: 'Dashboard', icon: 'grid-1x2', route: '/project-dashboard' },
    { label: 'Project', icon: 'folder', route: '/temp-project' },
    { label: 'Users', icon: 'people', route: '/users' },
    { label: 'Roles', icon: 'shield-lock', route: '/roles' }
  ];

  readonly activeModule = this.workspaceModules.activeModule;

  // When inside a specific Atlas project's workspace, the sidenav swaps its
  // generic module nav for that project's own flat artifact list — this is
  // the direct, one-click navigation replacing the old top-tabs + pill
  // sub-nav (which required drilling into "Atlas Backlog" first).
  private readonly currentProjectId = signal<string | null>(null);

  readonly currentProject = computed(() => {
    const id = this.currentProjectId();
    return id ? this.projectState.activeProjects().find(p => p.id === id) ?? null : null;
  });

  readonly groups = computed<NavGroup[]>(() => {
    const project = this.currentProject();
    if (!project) {
      return this.activeModule()?.groups ?? [];
    }

    const base = `/atlas/projects/${project.id}`;
    return [
      { title: project.name, items: [{ label: 'Features Board', icon: 'kanban', route: `${base}/board` }] },
      {
        title: 'Delivery',
        items: [
          { label: 'Requirements', icon: 'file-earmark-ruled', route: `${base}/requirements` },
          { label: 'User Stories', icon: 'journal-bookmark', route: `${base}/stories` },
          { label: 'Tasks', icon: 'check2-square', route: `${base}/tasks` }
        ]
      },
      {
        title: 'Quality',
        items: [
          { label: 'Test Cases', icon: 'clipboard2-check', route: `${base}/test-cases` },
          { label: 'Bugs', icon: 'bug', route: `${base}/bugs` }
        ]
      },
      { title: 'Operational', items: [{ label: 'Documents & More', icon: 'clipboard-data', route: `${base}/operational` }] }
    ];
  });

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

    const match = this.activeRoute.match(/^\/atlas\/projects\/([^/]+)/);
    this.currentProjectId.set(match ? match[1] : null);
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

  goToProfile(): void {
    this.router.navigateByUrl('/profile');
  }
}
