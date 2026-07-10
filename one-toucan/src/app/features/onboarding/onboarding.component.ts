import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';

import { LogoComponent } from '../../shared/ui/logo/logo.component';
import {
  ACCESS_BUNDLES,
  APP_ACCESS,
  AccessBundleId,
  AppAccess,
  BACKGROUND_CHECKS,
  EMERGENCY_CONTACTS,
  HARDWARE_ASSETS,
  ONBOARDING_DOCUMENTS,
  ONBOARDING_STEPS,
  OnboardingDocument,
  PRIMARY_ROLES,
  PrimaryRoleId
} from './onboarding.data';

const BUNDLE_PRESETS: Record<AccessBundleId, string[]> = {
  Engineering: ['Slack', 'OneToucan Analytics', 'GitLab', 'AWS Console', 'Confluence / Wiki'],
  Standard: ['Slack', 'OneToucan Analytics'],
  Custom: []
};

@Component({
  selector: 'oh-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    LogoComponent
  ],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss'
})
export class OnboardingComponent {
  readonly steps = ONBOARDING_STEPS;
  readonly accessBundleOptions = ACCESS_BUNDLES;
  readonly primaryRoleOptions = PRIMARY_ROLES;

  readonly currentStep = signal(1);
  readonly progress = computed(() => ((this.currentStep() - 1) / (this.steps.length - 1)) * 100);
  readonly activeStepMeta = computed(() => this.steps[this.currentStep() - 1]);

  readonly emergencyContacts = signal(EMERGENCY_CONTACTS);
  readonly documents = signal(ONBOARDING_DOCUMENTS);
  readonly backgroundChecks = signal(BACKGROUND_CHECKS);
  readonly apps = signal(APP_ACCESS);
  readonly hardware = signal(HARDWARE_ASSETS);

  readonly accessBundle = signal<AccessBundleId>('Engineering');
  readonly primaryRole = signal<PrimaryRoleId>('Engineer');

  readonly documentsReceived = computed(
    () => this.documents().filter(d => d.status === 'Verified' || d.status === 'Uploaded').length
  );
  readonly missingRequiredDocs = computed(() => this.documents().filter(d => d.required && d.status === 'Missing'));
  readonly enabledAppsCount = computed(() => this.apps().filter(a => a.enabled).length);

  readonly personalForm = this.fb.group({
    fullName: ['Tara Reddy'],
    dob: ['1997-03-14'],
    personalEmail: ['tara.reddy@gmail.com'],
    phone: ['+91 99001 22334'],
    address: ['Flat 402, Lake View Residency, Gachibowli, Hyderabad, Telangana 500032']
  });

  readonly roleForm = this.fb.group({
    jobTitle: ['Machine Learning Engineer'],
    employeeId: ['TPI-04821'],
    department: ['Analytics'],
    employmentType: ['Full-time'],
    reportingManager: ['Divya Rao'],
    workLocation: ['Hyderabad'],
    startDate: ['2026-07-01']
  });

  get firstName(): string {
    return (this.personalForm.value.fullName ?? '').split(' ')[0] || 'the new hire';
  }

  get initials(): string {
    const name = this.personalForm.value.fullName ?? '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {}

  goToStep(id: number): void {
    this.currentStep.set(id);
  }

  back(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  next(): void {
    if (this.currentStep() < this.steps.length) {
      this.currentStep.update(s => s + 1);
    }
  }

  finish(): void {
    this.router.navigateByUrl('/onboarding');
  }

  exit(): void {
    this.router.navigateByUrl('/onboarding');
  }

  addContact(): void {
    this.emergencyContacts.update(list => [...list, { relation: 'Other', name: 'New contact', phone: '' }]);
  }

  markUploaded(doc: OnboardingDocument): void {
    this.documents.update(list => list.map(d => (d === doc ? { ...d, status: 'Uploaded', meta: 'Uploaded just now' } : d)));
  }

  docBadgeClass(doc: OnboardingDocument): string {
    switch (doc.status) {
      case 'Verified':
        return 'oh-badge--success';
      case 'Uploaded':
        return 'oh-badge--info';
      case 'In Review':
        return 'oh-badge--warning';
      default:
        return 'oh-badge--error';
    }
  }

  checkStateClass(status: string): string {
    if (status === 'Clear') {
      return 'oh-check-row__icon--done';
    }
    if (status === 'In progress') {
      return 'oh-check-row__icon--progress';
    }
    return 'oh-check-row__icon--pending';
  }

  selectBundle(id: AccessBundleId): void {
    this.accessBundle.set(id);
    this.applyBundlePreset(id);
  }

  resetToBundle(): void {
    this.applyBundlePreset(this.accessBundle());
  }

  toggleApp(app: AppAccess): void {
    this.apps.update(list => list.map(a => (a === app ? { ...a, enabled: !a.enabled } : a)));
  }

  private applyBundlePreset(id: AccessBundleId): void {
    if (id === 'Custom') {
      return;
    }
    const preset = BUNDLE_PRESETS[id];
    this.apps.update(list => list.map(a => ({ ...a, enabled: preset.includes(a.name) })));
  }
}
