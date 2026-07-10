import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CurrentUserService } from '../../core/auth/current-user.service';

@Component({
  selector: 'oh-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() pageTitle = '';
  @Input() pageSubtitle = '';

  searchQuery = '';

  readonly userRole = 'CTO · Admin';
  readonly notificationCount = 4;

  constructor(private readonly currentUser: CurrentUserService) {}

  get userName(): string {
    return this.currentUser.fullName();
  }

  get userInitials(): string {
    return this.currentUser.initials();
  }
}
