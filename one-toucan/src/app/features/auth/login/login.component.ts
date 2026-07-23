import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { CurrentUserService } from '../../../core/auth/current-user.service';
import { LogoComponent } from '../../../shared/ui/logo/logo.component';

@Component({
  selector: 'oh-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCheckboxModule, MatButtonModule, MatIconModule, LogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  showPassword = false;

  readonly stats = [
    { value: '22', label: 'Modules' },
    { value: '115', label: 'Screens' },
    { value: 'SSO', label: 'SAML · OAuth' }
  ];

  readonly changePasswordForm = this.fb.group({
    currentPassword: ['CurrentPass123', Validators.required],
    newPassword: ['NewPassword123', [Validators.required, Validators.minLength(10)]],
    confirmPassword: ['NewPassword123', Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly currentUser: CurrentUserService
  ) {}

  updatePassword(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }
    // Set mock user email and navigate to project dashboard
    this.currentUser.setEmail('lokesh.kanuboina@toucanus.com');
    this.router.navigateByUrl('/temp-project');
  }
}
