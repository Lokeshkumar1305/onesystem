import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';

export interface LineChartPoint {
  label: string;
  value: number;
}

export type LineChartColor = 'teal' | 'info' | 'violet' | 'accent';

interface PlottedPoint extends LineChartPoint {
  x: number;
  y: number;
}

@Component({
  selector: 'oh-line-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss'
})
export class LineChartComponent implements OnChanges {
  @Input({ required: true }) points: LineChartPoint[] = [];
  @Input() color: LineChartColor = 'teal';
  @Input() unit = '%';

  readonly vbWidth = 700;
  readonly vbHeight = 260;
  readonly plotTop = 16;
  readonly plotBottom = 208;
  readonly plotLeft = 8;
  readonly plotRight = 692;
  readonly labelY = 240;
  readonly gridSteps = [0.25, 0.5, 0.75];

  coords: PlottedPoint[] = [];
  linePath = '';
  areaPath = '';
  hoverIndex: number | null = null;

  ngOnChanges(): void {
    this.build();
  }

  onMove(event: PointerEvent): void {
    if (!this.coords.length) {
      return;
    }
    const svg = event.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const x = ratio * this.vbWidth;

    let nearest = 0;
    let nearestDist = Infinity;
    this.coords.forEach((c, i) => {
      const d = Math.abs(c.x - x);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = i;
      }
    });
    this.hoverIndex = nearest;
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

  gridY(step: number): number {
    return this.plotTop + (this.plotBottom - this.plotTop) * step;
  }

  private build(): void {
    if (!this.points.length) {
      this.coords = [];
      this.linePath = '';
      this.areaPath = '';
      return;
    }

    const values = this.points.map(p => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = (max - min) * 0.25 || 5;
    const lo = min - pad;
    const hi = max + pad;
    const span = hi - lo || 1;
    const stepX = (this.plotRight - this.plotLeft) / (this.points.length - 1 || 1);

    this.coords = this.points.map((p, i) => ({
      ...p,
      x: this.plotLeft + stepX * i,
      y: this.plotBottom - ((p.value - lo) / span) * (this.plotBottom - this.plotTop)
    }));

    this.linePath = this.coords
      .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(2)} ${c.y.toFixed(2)}`)
      .join(' ');

    const last = this.coords[this.coords.length - 1];
    const first = this.coords[0];
    this.areaPath = `${this.linePath} L ${last.x.toFixed(2)} ${this.plotBottom} L ${first.x.toFixed(2)} ${this.plotBottom} Z`;
  }
}
