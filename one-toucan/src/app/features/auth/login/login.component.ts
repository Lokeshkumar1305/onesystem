import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

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

  readonly form = this.fb.group({
    email: ['lokesh.kanuboina@toucanus.com', [Validators.required, Validators.email]],
    password: ['Password@123', Validators.required],
    remember: [true]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.router.navigateByUrl('/dashboard');
  }
}
