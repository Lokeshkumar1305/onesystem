import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface TempBreadcrumbTab {
  label: string;
  route: string;
}

// TEMP: the shell's real sub-header tabs row is driven by
// WorkspaceModuleService (see shell.component.ts activeModuleTabs), which
// knows nothing about /temp-project or /temp-profile — so it renders empty
// on those routes. This is a self-contained stand-in with working routing
// for just those two screens. See shell.component.html/.ts for the other
// half of this (only rendered in place of the real tabs row on temp routes).
@Component({
  selector: 'oh-temp-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './temp-breadcrumb.component.html',
  styleUrl: './temp-breadcrumb.component.scss'
})
export class TempBreadcrumbComponent implements OnInit, OnDestroy {
  private routerSub?: Subscription;
  private readonly activeUrl = signal('');

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.activeUrl.set(this.router.url);
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => this.activeUrl.set((event as NavigationEnd).urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  get tabs(): TempBreadcrumbTab[] {
    const path = this.activeUrl().split('?')[0].split('#')[0];
    // Profile isn't nested under Project, so it gets its own single tab
    // instead of a "Project > Profile" trail.
    if (path.startsWith('/temp-profile')) {
      return [{ label: 'Profile', route: '/temp-profile' }];
    }
    return [{ label: 'Project', route: '/temp-project' }];
  }

  isActive(tab: TempBreadcrumbTab): boolean {
    const path = this.activeUrl().split('?')[0].split('#')[0];
    return path === tab.route || path.startsWith(tab.route + '/');
  }

  navigate(tab: TempBreadcrumbTab): void {
    this.router.navigateByUrl(tab.route);
  }
}
