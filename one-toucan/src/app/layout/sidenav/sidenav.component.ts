import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';

import { CurrentUserService } from '../../core/auth/current-user.service';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
}

import { LogoComponent } from '../../shared/ui/logo/logo.component';

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
export class SidenavComponent {
  activeLabel = 'Dashboard';

  // Icon names are bootstrap-icons suffixes (rendered as class="bi bi-<icon>").
  readonly groups: NavGroup[] = [
    { title: 'Workspace', items: [{ label: 'Dashboard', icon: 'grid-1x2', route: '/dashboard' }] },
    {
      title: 'Foundation',
      items: [
        { label: 'Organization', icon: 'building', route: '/organization' },
        { label: 'Employees', icon: 'people', route: '/employees' },
        { label: 'Recruitment', icon: 'person-plus' },
        { label: 'Onboarding', icon: 'person-check', route: '/onboarding' }
      ]
    },
    {
      title: 'Delivery',
      items: [
        { label: 'Skills & Competency', icon: 'stars' },
        { label: 'Idea Management', icon: 'lightbulb' },
        { label: 'Business Analysis', icon: 'graph-up' }
      ]
    },
    {
      title: 'Execution',
      items: [
        { label: 'Projects', icon: 'folder' },
        { label: 'New Project', icon: 'folder-plus' },
        { label: 'Requirements', icon: 'list-check' },
        { label: 'My Tasks', icon: 'check2-square' },
        { label: 'Resource Allocation', icon: 'diagram-3' }
      ]
    },
    {
      title: 'Workforce',
      items: [
        { label: 'Attendance', icon: 'calendar-check' },
        { label: 'Leave', icon: 'airplane' },
        { label: 'Timesheets', icon: 'clock' }
      ]
    },
    {
      title: 'Knowledge',
      items: [
        { label: 'Documents', icon: 'file-text' },
        { label: 'Knowledge Base', icon: 'book' },
        { label: 'KT Management', icon: 'mortarboard' }
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { label: 'Notifications', icon: 'bell' },
        { label: 'Analytics', icon: 'bar-chart', route: '/dashboard' },
        { label: 'System Config', icon: 'gear' }
      ]
    }
  ];

  constructor(
    private readonly router: Router,
    private readonly currentUser: CurrentUserService
  ) {}

  get userName(): string {
    return this.currentUser.fullName();
  }

  get userInitials(): string {
    return this.currentUser.initials();
  }

  select(item: NavItem): void {
    this.activeLabel = item.label;
    if (item.route) {
      this.router.navigateByUrl(item.route);
    }
  }
}
