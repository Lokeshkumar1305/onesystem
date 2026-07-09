import { Component, Input, OnChanges } from '@angular/core';

export type SparklineColor = 'success' | 'error' | 'info' | 'violet' | 'teal';

@Component({
  selector: 'oh-sparkline',
  standalone: true,
  templateUrl: './sparkline.component.html',
  styleUrl: './sparkline.component.scss'
})
export class SparklineComponent implements OnChanges {
  @Input({ required: true }) data: number[] = [];
  @Input() color: SparklineColor = 'teal';

  readonly viewWidth = 100;
  readonly viewHeight = 32;

  linePath = '';
  areaPath = '';
  lastPoint = { x: 0, y: 0 };

  ngOnChanges(): void {
    this.build();
  }

  private build(): void {
    if (!this.data?.length) {
      this.linePath = '';
      this.areaPath = '';
      return;
    }

    const min = Math.min(...this.data);
    const max = Math.max(...this.data);
    const range = max - min || 1;
    const inset = 3;
    const stepX = this.viewWidth / (this.data.length - 1 || 1);

    const points = this.data.map((value, i) => ({
      x: i * stepX,
      y: this.viewHeight - inset - ((value - min) / range) * (this.viewHeight - inset * 2)
    }));

    this.linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
    this.areaPath = `${this.linePath} L ${this.viewWidth} ${this.viewHeight} L 0 ${this.viewHeight} Z`;
    this.lastPoint = points[points.length - 1];
  }
}
