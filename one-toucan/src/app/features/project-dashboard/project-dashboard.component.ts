import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CurrentUserService } from '../../core/auth/current-user.service';
import { ProjectStateService } from '../../core/projects/project-state.service';
import { AreaChartComponent } from '../../shared/ui/area-chart/area-chart.component';
import { BarChartComponent } from '../../shared/ui/bar-chart/bar-chart.component';
import { DonutChartComponent } from '../../shared/ui/donut-chart/donut-chart.component';
import { GroupedBarChartComponent } from '../../shared/ui/grouped-bar-chart/grouped-bar-chart.component';

type RangeTab = 'This Quarter' | 'Month' | 'Week';
type ChartRangeTab = 'Week' | 'Month' | '6M' | 'Year';

@Component({
  selector: 'oh-project-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    MatTableModule,
    MatTooltipModule,
    BarChartComponent,
    AreaChartComponent,
    GroupedBarChartComponent,
    DonutChartComponent
  ],
  templateUrl: './project-dashboard.component.html',
  styleUrl: './project-dashboard.component.scss'
})
export class ProjectDashboardComponent {
  readonly rangeTabs: RangeTab[] = ['This Quarter', 'Month', 'Week'];
  activeRange: RangeTab = 'This Quarter';

  readonly chartRangeTabs: ChartRangeTab[] = ['Week', 'Month', '6M', 'Year'];
  activeChartRange: ChartRangeTab = '6M';

  private readonly now = new Date();
  private readonly currentUser = inject(CurrentUserService);
  readonly projectState = inject(ProjectStateService);

  get userFirstName(): string {
    return this.currentUser.fullName().split(' ')[0];
  }

  // Dynamic KPI Cards based on creation screen data
  get kpiCards() {
    const projects = this.projectState.activeProjects();
    const pmSet = new Set<string>();
    const tlSet = new Set<string>();
    const baSet = new Set<string>();
    const ownerSet = new Set<string>();
    let docCount = 0;

    for (const p of projects) {
      if (p.projectManager) pmSet.add(p.projectManager);
      if (p.projectTechLead) tlSet.add(p.projectTechLead);
      if (p.projectBa) baSet.add(p.projectBa);
      p.primaryOwners?.forEach(o => ownerSet.add(o));
      p.secondaryOwners?.forEach(o => ownerSet.add(o));
      docCount += (p.documents?.length || 0) + (p.ktSessions?.length || 0);
    }

    const leadersCount = pmSet.size + tlSet.size + baSet.size;

    return [
      {
        label: 'Active Workspaces',
        value: projects.length.toString(),
        icon: 'kanban',
        cardBgVar: '--oh-success-bg',
        iconBgVar: '--oh-success'
      },
      {
        label: 'Assigned Leaders',
        value: leadersCount.toString(),
        icon: 'people',
        cardBgVar: '--oh-info-bg',
        iconBgVar: '--oh-info'
      },
      {
        label: 'Workspace Owners',
        value: ownerSet.size.toString(),
        icon: 'shield',
        cardBgVar: '--oh-warning-bg',
        iconBgVar: '--oh-chart-amber'
      },
      {
        label: 'Uploaded Documents',
        value: docCount.toString(),
        icon: 'file-text',
        cardBgVar: '--oh-violet-bg',
        iconBgVar: '--oh-violet'
      }
    ];
  }

  // Projects list matching the creation screen leadership & ownership
  get activeProjectsData() {
    return this.projectState.activeProjects().map(p => {
      const pm = p.projectManager || 'Unassigned';
      const tl = p.projectTechLead || 'Unassigned';
      const ba = p.projectBa || 'Unassigned';
      const ownersList = p.primaryOwners && p.primaryOwners.length > 0 ? p.primaryOwners.join(', ') : 'No Owners';

      return {
        name: p.name,
        client: p.client,
        pm: pm,
        techLead: tl,
        ba: ba,
        owners: ownersList,
        status: p.status === 'completed' ? 'Completed' : 'Active'
      };
    });
  }

  readonly projectColumns = ['project', 'pm', 'techLead', 'ba', 'owners', 'status'];
  readonly documentColumns = ['document', 'project', 'category', 'date'];

  // Resource Roles allocation breakdown calculated dynamically from projects team roles
  get resourceAllocation() {
    const projects = this.projectState.activeProjects();
    let pmCount = 0;
    let tlCount = 0;
    let baCount = 0;
    let pOwnerCount = 0;
    let sOwnerCount = 0;

    for (const p of projects) {
      if (p.projectManager) pmCount++;
      if (p.projectTechLead) tlCount++;
      if (p.projectBa) baCount++;
      if (p.primaryOwners) pOwnerCount += p.primaryOwners.length;
      if (p.secondaryOwners) sOwnerCount += p.secondaryOwners.length;
    }

    const total = pmCount + tlCount + baCount + pOwnerCount + sOwnerCount || 1;

    return [
      { label: 'Primary Owners', value: Math.round((pOwnerCount / total) * 100) || 0, colorVar: '--oh-chart-teal' },
      { label: 'Project Managers', value: Math.round((pmCount / total) * 100) || 0, colorVar: '--oh-chart-info' },
      { label: 'Tech Leads', value: Math.round((tlCount / total) * 100) || 0, colorVar: '--oh-chart-amber' },
      { label: 'Secondary Owners', value: Math.round((sOwnerCount / total) * 100) || 0, colorVar: '--oh-chart-violet' }
    ];
  }

  get totalAllocationsCount(): number {
    const projects = this.projectState.activeProjects();
    let count = 0;
    for (const p of projects) {
      if (p.projectManager) count++;
      if (p.projectTechLead) count++;
      if (p.projectBa) count++;
      if (p.primaryOwners) count += p.primaryOwners.length;
      if (p.secondaryOwners) count += p.secondaryOwners.length;
    }
    return count;
  }

  // Scope breakdown metrics for top 5 projects
  get scopeMetrics() {
    return this.projectState.activeProjects().slice(0, 5).map(p => ({
      label: p.key || p.name.substring(0, 4).toUpperCase(),
      actual: (p.requirements?.length || 0) + (p.userStories?.length || 0), // Req + Stories as "Scope"
      target: (p.tasks?.length || 0) + (p.bugs?.length || 0) || 5 // Tasks + Bugs as "Execution"
    }));
  }

  // Document Assets Growth Area Chart (Dynamic)
  get headlineAreaLabels(): string[] {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  }

  get headlineAreaSeries() {
    const projects = this.projectState.activeProjects();
    const docCount = projects.reduce((acc, p) => acc + (p.documents?.length || 0) + (p.ktSessions?.length || 0), 0);
    // Mock trending document assets count
    const values = [5, 12, 18, 25, 32, 38, Math.max(40, docCount)];
    return [
      { name: 'Documents', colorVar: '--oh-chart-teal', fill: true, values }
    ];
  }

  // YTD Documents Area Chart
  get ytdAreaLabels(): string[] {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }

  get ytdAreaSeries() {
    const projects = this.projectState.activeProjects();
    const docCount = projects.reduce((acc, p) => acc + (p.documents?.length || 0) + (p.ktSessions?.length || 0), 0);
    const actuals = [2, 5, 8, 12, 18, 22, 28, 32, 35, 40, 42, Math.max(45, docCount)];
    const targets = [5, 10, 15, 20, 25, 30, 35, 38, 40, 42, 45, 45];
    return [
      { name: 'Documents', colorVar: '--oh-chart-teal', fill: true, values: actuals },
      { name: 'Target', colorVar: '--oh-chart-amber', dashed: true, values: targets }
    ];
  }

  // Recently Added Documents dynamically fetched from projects documents list
  get recentDocuments() {
    const list: { docName: string; projName: string; category: string; date: string }[] = [];
    for (const p of this.projectState.activeProjects()) {
      for (const d of p.documents || []) {
        list.push({
          docName: d.name,
          projName: p.name,
          category: d.category,
          date: d.addedDate ? d.addedDate.split('|')[0].trim() : '2026-07-22'
        });
      }
      for (const kt of p.ktSessions || []) {
        list.push({
          docName: kt.topic,
          projName: p.name,
          category: 'KT Session',
          date: '2026-07-22'
        });
      }
    }
    return list.slice(-4).reverse();
  }

  // Helpers
  statusBadgeClass(status: string): string {
    return status === 'Completed' ? 'oh-badge--teal' : 'oh-badge--orange';
  }

  categoryBadgeClass(category: string): string {
    if (category === 'BRD') return 'oh-badge--teal';
    if (category === 'Architecture') return 'oh-badge--violet';
    if (category === 'KT Session') return 'oh-badge--orange';
    return 'oh-badge--blue';
  }

  get greeting(): string {
    const hour = this.now.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  get greetingDate(): string {
    return this.now.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  }

  get greetingTime(): string {
    return this.now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
}
