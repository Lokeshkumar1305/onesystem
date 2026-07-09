import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';

export interface DonutSegment {
  label: string;
  value: number;
  colorVar: string;
}

interface ComputedSegment extends DonutSegment {
  percent: number;
  dash: number;
  offset: number;
}

@Component({
  selector: 'oh-donut-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.scss'
})
export class DonutChartComponent implements OnChanges {
  @Input({ required: true }) segments: DonutSegment[] = [];
  @Input() centerValue = '';
  @Input() centerLabel = '';

  readonly radius = 70;
  readonly circumference = 2 * Math.PI * this.radius;

  computed: ComputedSegment[] = [];

  ngOnChanges(): void {
    const total = this.segments.reduce((sum, s) => sum + s.value, 0) || 1;
    const gap = 6;
    let cursor = 0;

    this.computed = this.segments.map(s => {
      const percent = (s.value / total) * 100;
      const rawDash = (percent / 100) * this.circumference;
      const dash = Math.max(rawDash - gap, 0);
      const segment: ComputedSegment = { ...s, percent, dash, offset: cursor };
      cursor += rawDash;
      return segment;
    });
  }
}
