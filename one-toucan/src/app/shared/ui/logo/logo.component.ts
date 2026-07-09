import { Component, Input } from '@angular/core';

@Component({
  selector: 'oh-logo',
  standalone: true,
  template: `
    <span class="oh-logo" [class.oh-logo--on-dark]="theme === 'onDark'">
      <span class="oh-logo__mark"><span class="oh-logo__beak"></span></span>
      <span class="oh-logo__wordmark">OneToucan</span>
    </span>
  `,
  styleUrl: './logo.component.scss'
})
export class LogoComponent {
  @Input() theme: 'onLight' | 'onDark' = 'onLight';
}
