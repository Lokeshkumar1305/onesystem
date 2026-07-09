import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';

import { DonutChartComponent } from '../../shared/ui/donut-chart/donut-chart.component';
import { LineChartComponent } from '../../shared/ui/line-chart/line-chart.component';
import { SparklineComponent } from '../../shared/ui/sparkline/sparkline.component';
import {
  AI_INSIGHTS,
  DELIVERY_HEALTH,
  KPI_CARDS,
  RESOURCE_ALLOCATION,
  RISK_PROJECTS,
  TOTAL_HEADCOUNT
} from './dashboard.data';

type RangeTab = 'This Quarter' | 'Month' | 'Week';

@Component({
  selector: 'oh-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    SparklineComponent,
    LineChartComponent,
    DonutChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  readonly rangeTabs: RangeTab[] = ['This Quarter', 'Month', 'Week'];
  activeRange: RangeTab = 'This Quarter';

  readonly kpiCards = KPI_CARDS;
  readonly deliveryHealth = DELIVERY_HEALTH;
  readonly resourceAllocation = RESOURCE_ALLOCATION;
  readonly riskProjects = RISK_PROJECTS;
  readonly aiInsights = AI_INSIGHTS;
  readonly riskColumns = ['project', 'lead', 'health', 'budget'];

  readonly totalHeadcount = TOTAL_HEADCOUNT;

  budgetColor(health: 'At Risk' | 'Blocked'): 'accent' | 'warn' {
    return health === 'Blocked' ? 'warn' : 'accent';
  }

  badgeClass(health: 'At Risk' | 'Blocked'): string {
    return health === 'Blocked' ? 'oh-badge--error' : 'oh-badge--warning';
  }
}
