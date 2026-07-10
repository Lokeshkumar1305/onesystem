import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';

export interface BarChartPoint {
  label: string;
  value: number;
}

interface PlottedBar extends BarChartPoint {
  x: number;
  y: number;
  width: number;
  height: number;
}

@Component({
  selector: 'oh-bar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent implements OnChanges {
  @Input({ required: true }) points: BarChartPoint[] = [];
  @Input() unit = '%';
  @Input() highlightLast = true;

  readonly vbWidth = 700;
  readonly vbHeight = 260;
  readonly plotTop = 16;
  readonly plotBottom = 208;
  readonly plotLeft = 8;
  readonly plotRight = 692;
  readonly labelY = 240;
  readonly barRadius = 6;

  bars: PlottedBar[] = [];
  hoverIndex: number | null = null;

  ngOnChanges(): void {
    this.build();
  }

  onEnter(index: number): void {
    this.hoverIndex = index;
  }

  onLeave(): void {
    this.hoverIndex = null;
  }

  leftPercent(x: number): number {
    return (x / this.vbWidth) * 100;
  }

  topPercent(y: number): number {
    return (y / this.vbHeight) * 100;
  }

  private build(): void {
    if (!this.points.length) {
      this.bars = [];
      return;
    }

    const max = Math.max(...this.points.map(p => p.value)) || 1;
    const plotHeight = this.plotBottom - this.plotTop;
    const slot = (this.plotRight - this.plotLeft) / this.points.length;
    const barWidth = slot * 0.62;

    this.bars = this.points.map((p, i) => {
      const height = (p.value / max) * plotHeight;
      return {
        ...p,
        width: barWidth,
        height,
        x: this.plotLeft + slot * i + (slot - barWidth) / 2,
        y: this.plotBottom - height
      };
    });
  }
}
