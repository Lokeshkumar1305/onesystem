import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';

export interface GroupedBarPoint {
  label: string;
  actual: number;
  target: number;
}

interface PlottedGroup {
  label: string;
  actualX: number;
  actualY: number;
  actualHeight: number;
  targetX: number;
  targetY: number;
  targetHeight: number;
  labelX: number;
}

@Component({
  selector: 'oh-grouped-bar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grouped-bar-chart.component.html',
  styleUrl: './grouped-bar-chart.component.scss'
})
export class GroupedBarChartComponent implements OnChanges {
  @Input({ required: true }) points: GroupedBarPoint[] = [];
  @Input() actualLabel = 'Actual';
  @Input() targetLabel = 'Target';

  readonly vbWidth = 700;
  readonly vbHeight = 260;
  readonly plotTop = 16;
  readonly plotBottom = 208;
  readonly plotLeft = 8;
  readonly plotRight = 692;
  readonly labelY = 240;
  readonly barRadius = 4;

  groups: PlottedGroup[] = [];
  barWidth = 0;

  ngOnChanges(): void {
    this.build();
  }

  private build(): void {
    if (!this.points.length) {
      this.groups = [];
      return;
    }

    const max = Math.max(...this.points.flatMap(p => [p.actual, p.target])) || 1;
    const plotHeight = this.plotBottom - this.plotTop;
    const slot = (this.plotRight - this.plotLeft) / this.points.length;
    const pairWidth = slot * 0.6;
    const barWidth = pairWidth / 2 - 2;

    this.groups = this.points.map((p, i) => {
      const groupX = this.plotLeft + slot * i + (slot - pairWidth) / 2;
      const actualHeight = (p.actual / max) * plotHeight;
      const targetHeight = (p.target / max) * plotHeight;

      return {
        label: p.label,
        actualX: groupX,
        actualY: this.plotBottom - actualHeight,
        actualHeight,
        targetX: groupX + barWidth + 4,
        targetY: this.plotBottom - targetHeight,
        targetHeight,
        labelX: groupX + pairWidth / 2
      };
    });

    this.barWidth = barWidth;
  }
}
