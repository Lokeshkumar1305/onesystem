import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';

import { CurrentUserService } from '../../core/auth/current-user.service';
import { AreaChartComponent } from '../../shared/ui/area-chart/area-chart.component';
import { BarChartComponent } from '../../shared/ui/bar-chart/bar-chart.component';
import { DonutChartComponent } from '../../shared/ui/donut-chart/donut-chart.component';
import { GroupedBarChartComponent } from '../../shared/ui/grouped-bar-chart/grouped-bar-chart.component';
import {
  DELIVERY_HEALTH,
  DELIVERY_VS_TARGET,
  KPI_CARDS,
  RECENT_APPROVALS,
  RESOURCE_ALLOCATION,
  RISK_PROJECTS,
  TOTAL_HEADCOUNT,
  YTD_DELIVERY_VS_TARGET
} from './dashboard.data';

type RangeTab = 'This Quarter' | 'Month' | 'Week';
type ChartRangeTab = 'Week' | 'Month' | '6M' | 'Year';

@Component({
  selector: 'oh-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    MatTableModule,
    BarChartComponent,
    AreaChartComponent,
    GroupedBarChartComponent,
    DonutChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  readonly rangeTabs: RangeTab[] = ['This Quarter', 'Month', 'Week'];
  activeRange: RangeTab = 'This Quarter';

  readonly chartRangeTabs: ChartRangeTab[] = ['Week', 'Month', '6M', 'Year'];
  activeChartRange: ChartRangeTab = '6M';

  private readonly now = new Date();

  constructor(private readonly currentUser: CurrentUserService) {}

  get userFirstName(): string {
    return this.currentUser.fullName().split(' ')[0];
  }

  readonly kpiCards = KPI_CARDS;
  readonly deliveryHealth = DELIVERY_HEALTH;
  readonly deliveryVsTarget = DELIVERY_VS_TARGET;
  readonly resourceAllocation = RESOURCE_ALLOCATION;
  readonly riskProjects = RISK_PROJECTS;
  readonly recentApprovals = RECENT_APPROVALS;
  readonly riskColumns = ['project', 'lead', 'budget', 'trend', 'health'];
  readonly approvalColumns = ['project', 'method', 'status', 'amount'];

  readonly totalHeadcount = TOTAL_HEADCOUNT;

  readonly headlineAreaLabels = this.deliveryHealth.map(p => p.label);
  readonly headlineAreaSeries = [
    { name: 'Utilization', colorVar: '--oh-chart-teal', fill: true, values: this.deliveryHealth.map(p => p.value) }
  ];

  private readonly ytdDeliveryVsTarget = YTD_DELIVERY_VS_TARGET;
  readonly ytdAreaLabels = this.ytdDeliveryVsTarget.map(p => p.label);
  readonly ytdAreaSeries = [
    { name: 'Utilization', colorVar: '--oh-chart-teal', fill: true, values: this.ytdDeliveryVsTarget.map(p => p.actual) },
    { name: 'Target', colorVar: '--oh-chart-amber', dashed: true, values: this.ytdDeliveryVsTarget.map(p => p.target) }
  ];

  readonly totalUtilizationHours = '2,145 hrs';
  readonly bestMonth = 'Jul · 79%';
  readonly vsTargetSummary = '+3 pts ahead';

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

  budgetColor(health: 'At Risk' | 'Blocked'): 'accent' | 'warn' {
    return health === 'Blocked' ? 'warn' : 'accent';
  }

  healthBadgeClass(health: 'At Risk' | 'Blocked'): string {
    return health === 'Blocked' ? 'oh-badge--error oh-badge--outline' : 'oh-badge--warning oh-badge--outline';
  }

  approvalBadgeClass(status: 'Success' | 'Pending'): string {
    return status === 'Success' ? 'oh-badge--success' : 'oh-badge--error';
  }
}
