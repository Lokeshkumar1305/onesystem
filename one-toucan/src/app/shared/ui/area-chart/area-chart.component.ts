import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';

export interface AreaChartSeries {
  name: string;
  colorVar: string;
  dashed?: boolean;
  fill?: boolean;
  values: number[];
}

interface PlottedSeries {
  name: string;
  colorVar: string;
  dashed: boolean;
  linePath: string;
  areaPath: string;
}

let instanceCounter = 0;

@Component({
  selector: 'oh-area-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './area-chart.component.html',
  styleUrl: './area-chart.component.scss'
})
export class AreaChartComponent implements OnChanges {
  @Input({ required: true }) labels: string[] = [];
  @Input({ required: true }) series: AreaChartSeries[] = [];
  @Input() showLegend = false;

  readonly instanceId = instanceCounter++;

  readonly vbWidth = 700;
  readonly vbHeight = 260;
  readonly plotTop = 12;
  readonly plotBottom = 208;
  readonly plotLeft = 8;
  readonly plotRight = 692;
  readonly labelY = 240;

  plotted: PlottedSeries[] = [];
  labelX: number[] = [];

  ngOnChanges(): void {
    this.build();
  }

  private build(): void {
    if (!this.labels.length || !this.series.length) {
      this.plotted = [];
      this.labelX = [];
      return;
    }

    const allValues = this.series.flatMap(s => s.values);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const pad = (max - min) * 0.15 || 5;
    const lo = min - pad;
    const hi = max + pad;
    const span = hi - lo || 1;
    const stepX = (this.plotRight - this.plotLeft) / (this.labels.length - 1 || 1);

    this.labelX = this.labels.map((_, i) => this.plotLeft + stepX * i);

    this.plotted = this.series.map(s => {
      const coords = s.values.map((value, i) => ({
        x: this.plotLeft + stepX * i,
        y: this.plotBottom - ((value - lo) / span) * (this.plotBottom - this.plotTop)
      }));

      const linePath = this.smoothPath(coords);
      let areaPath = '';
      if (s.fill) {
        const last = coords[coords.length - 1];
        const first = coords[0];
        areaPath = `${linePath} L ${last.x.toFixed(2)} ${this.plotBottom} L ${first.x.toFixed(2)} ${this.plotBottom} Z`;
      }

      return { name: s.name, colorVar: s.colorVar, dashed: !!s.dashed, linePath, areaPath };
    });
  }

  // Catmull-Rom → cubic Bezier conversion for a smooth (non-jagged) curve through each point.
  private smoothPath(coords: { x: number; y: number }[]): string {
    if (!coords.length) {
      return '';
    }
    if (coords.length === 1) {
      return `M ${coords[0].x.toFixed(2)} ${coords[0].y.toFixed(2)}`;
    }

    let d = `M ${coords[0].x.toFixed(2)} ${coords[0].y.toFixed(2)}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i - 1] || coords[i];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }
    return d;
  }
}
