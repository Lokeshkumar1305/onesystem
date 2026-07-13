import { CommonModule } from '@angular/common';
import { Component, computed, signal, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
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
  EmergencyContact,
  HARDWARE_ASSETS,
  HardwareAsset,
  HardwareStatus,
  INDIAN_STATES,
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
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSlideToggleModule,
    LogoComponent
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss'
})
export class OnboardingComponent {
  @ViewChild('stateSearchInput') stateSearchInput?: ElementRef<HTMLInputElement>;

  readonly steps = ONBOARDING_STEPS;
  readonly accessBundleOptions = ACCESS_BUNDLES;
  readonly primaryRoleOptions = PRIMARY_ROLES;

  readonly currentStep = signal(1);
  readonly progress = computed(() => ((this.currentStep() - 1) / (this.steps.length - 1)) * 100);
  readonly activeStepMeta = computed(() => this.steps[this.currentStep() - 1]);

  readonly relationOptions = ['Spouse', 'Parent', 'Sibling', 'Friend', 'Other'];
  readonly emergencyContacts = signal(EMERGENCY_CONTACTS);
  readonly documents = signal(ONBOARDING_DOCUMENTS);
  readonly backgroundChecks = signal(BACKGROUND_CHECKS);
  readonly apps = signal(APP_ACCESS);
  readonly hardware = signal<HardwareAsset[]>([
    { name: 'Dell Laptop', meta: 'Pending IT provisioning', status: 'Pending' },
    { name: 'MacBook', meta: 'Pending IT provisioning', status: 'Pending' },
    { name: 'Laptop Charger', meta: 'Pending IT provisioning', status: 'Pending' },
    { name: 'Mouse', meta: 'Pending IT provisioning', status: 'Pending' },
    { name: 'HeadSet', meta: 'Pending IT provisioning', status: 'Pending' },
    { name: 'Keyboard', meta: 'Pending IT provisioning', status: 'Pending' },
    { name: 'Monitor', meta: 'Pending IT provisioning', status: 'Pending' },
    { name: 'Tab', meta: 'Pending IT provisioning', status: 'Pending' },
    { name: 'Mobile', meta: 'Pending IT provisioning', status: 'Pending' },
    { name: 'Laptop Bag', meta: 'Pending IT provisioning', status: 'Pending' },
    { name: 'Bottle', meta: 'Pending IT provisioning', status: 'Pending' },
    { name: 'Coffee Cup', meta: 'Pending IT provisioning', status: 'Pending' }
  ]);
  readonly allocatedDevicesSummary = computed(() => {
    const list = this.hardware()
      .filter(h => h.status === 'Allocated')
      .map(h => {
        if (h.name.includes('MacBook')) return 'MacBook Pro';
        if (h.name.includes('Dell') || h.name.includes('Monitor')) return 'Monitor';
        if (h.name.includes('SIM')) return 'SIM Card';
        return h.name;
      });
    return list.join(', ') || 'None';
  });

  readonly accessBundle = signal<AccessBundleId>('Engineering');
  readonly primaryRole = signal<PrimaryRoleId>('Engineer');

  readonly documentsReceived = computed(
    () => this.documents().filter(d => d.status === 'Verified' || d.status === 'Uploaded').length
  );
  readonly missingRequiredDocs = computed(() => this.documents().filter(d => d.required && d.status === 'Missing'));
  readonly enabledAppsCount = computed(() => this.apps().filter(a => a.enabled).length);

  readonly genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

  readonly indianStates = INDIAN_STATES;
  readonly filteredStates = signal<string[]>(INDIAN_STATES);

  readonly personalForm = this.fb.group({
    firstName: ['Lokesh'],
    middleName: [''],
    lastName: ['Kanuboina'],
    dob: [new Date(1997, 2, 14)],
    gender: ['Male'],
    personalEmail: ['lokesh.kanuboina@toucanus.com'],
    phone: ['+91 99001 22334'],
    houseNumber: ['Flat 402'],
    street: ['Lake View Residency, Gachibowli'],
    state: ['Telangana'],
    country: ['India'],
    pincode: ['500032']
  });

  readonly roleForm = this.fb.group({
    jobTitle: ['Machine Learning Engineer'],
    employeeId: ['TPI-04821'],
    department: ['Analytics'],
    employmentType: ['Full-time'],
    reportingManager: ['Divya Rao'],
    workLocation: ['Hyderabad'],
    startDate: [new Date(2026, 6, 1)]
  });

  get firstName(): string {
    return this.personalForm.value.firstName || 'the new hire';
  }

  get fullName(): string {
    const { firstName, middleName, lastName } = this.personalForm.value;
    return [firstName, middleName, lastName].filter(Boolean).join(' ');
  }

  get initials(): string {
    const first = this.personalForm.value.firstName ?? '';
    const last = this.personalForm.value.lastName ?? '';
    const combined = (first[0] ?? '') + (last[0] ?? first[1] ?? '');
    return combined.toUpperCase() || '?';
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
    this.emergencyContacts.update(list => [...list, { relation: 'Spouse', name: '', phone: '' }]);
  }

  removeContact(contact: EmergencyContact): void {
    this.emergencyContacts.update(list => list.filter(c => c !== contact));
  }

  updateContact(index: number, field: keyof EmergencyContact, value: string): void {
    this.emergencyContacts.update(list => list.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }

  toggleHardwareStatus(hw: HardwareAsset): void {
    this.hardware.update(list =>
      list.map(h => {
        if (h === hw) {
          const isAllocated = h.status === 'Allocated';
          const nextStatus: HardwareStatus = isAllocated ? 'Pending' : 'Allocated';
          
          let nextMeta = h.meta;
          if (nextStatus === 'Allocated') {
            if (h.name.includes('SIM')) {
              nextMeta = 'Asset TPI-SIM-9104 · ready for pickup';
            } else if (h.name.includes('MacBook')) {
              nextMeta = 'Asset TPI-LAP-2291 · ready for pickup';
            } else if (h.name.includes('Dell') || h.name.includes('Monitor')) {
              nextMeta = 'Asset TPI-MON-0884 · ready for pickup';
            } else {
              nextMeta = 'Asset TPI-HW-9901 · ready for pickup';
            }
          } else {
            nextMeta = 'Pending IT provisioning';
          }
          
          return { ...h, status: nextStatus, meta: nextMeta };
        }
        return h;
      })
    );
  }

  addHardware(opt: { name: string; defaultMeta: string }): void {
    this.hardware.update(list => [
      ...list,
      {
        name: opt.name,
        meta: opt.defaultMeta,
        status: 'Pending'
      }
    ]);
  }

  addHardwareFromInput(inputElement: HTMLInputElement): void {
    const value = inputElement.value.trim();
    if (value) {
      this.addHardware({ name: value, defaultMeta: 'Pending IT provisioning' });
      inputElement.value = '';
    }
  }

  removeHardware(hw: HardwareAsset): void {
    this.hardware.update(list => list.filter(h => h !== hw));
  }

  filterStates(query: string): void {
    const q = query.trim().toLowerCase();
    this.filteredStates.set(q ? this.indianStates.filter(s => s.toLowerCase().includes(q)) : this.indianStates);
  }

  onStateSelectOpened(opened: boolean): void {
    if (opened) {
      setTimeout(() => {
        this.stateSearchInput?.nativeElement.focus();
      }, 0);
    } else {
      this.filterStates('');
      if (this.stateSearchInput) {
        this.stateSearchInput.nativeElement.value = '';
      }
    }
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

  docIcon(name: string): string {
    switch (name) {
      case 'Aadhaar / National ID':
        return 'card-heading';
      case 'PAN Card':
        return 'file-earmark-text';
      case 'Signed Offer & Contract':
        return 'file-earmark-check';
      case 'Education Certificates':
        return 'mortarboard';
      case 'Bank & PF (UAN) Details':
        return 'bank';
      case 'Previous Employer Relieving Letter':
        return 'clipboard2-check';
      default:
        return 'file-earmark';
    }
  }

  docIconClass(name: string): string {
    switch (name) {
      case 'Aadhaar / National ID':
        return 'oh-icon-tile--blue';
      case 'PAN Card':
        return 'oh-icon-tile--purple';
      case 'Signed Offer & Contract':
        return 'oh-icon-tile--violet';
      case 'Education Certificates':
        return 'oh-icon-tile--orange';
      case 'Bank & PF (UAN) Details':
        return 'oh-icon-tile--indigo';
      case 'Previous Employer Relieving Letter':
        return 'oh-icon-tile--amber';
      default:
        return '';
    }
  }

  appIcon(name: string): string {
    switch (name) {
      case 'Slack':
        return 'chat-square-text';
      case 'OneToucan Analytics':
        return 'bar-chart-fill';
      case 'GitLab':
        return 'wrench';
      case 'AWS Console':
        return 'cloud-fill';
      case 'Confluence / Wiki':
        return 'journal-bookmark-fill';
      case 'Spira':
      case 'Jira':
        return 'kanban-fill';
      default:
        return 'app';
    }
  }

  appIconClass(name: string): string {
    switch (name) {
      case 'Slack':
        return 'oh-icon-tile--violet';
      case 'OneToucan Analytics':
        return 'oh-icon-tile--blue';
      case 'GitLab':
        return 'oh-icon-tile--purple';
      case 'AWS Console':
        return 'oh-icon-tile--blue';
      case 'Confluence / Wiki':
        return 'oh-icon-tile--purple';
      case 'Spira':
      case 'Jira':
        return 'oh-icon-tile--orange';
      default:
        return 'oh-icon-tile--neutral';
    }
  }

  hardwareIcon(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('charger') || lower.includes('plug') || lower.includes('adapter')) {
      return 'plug';
    }
    if (lower.includes('bag') || lower.includes('backpack') || lower.includes('briefcase')) {
      return 'backpack';
    }
    if (lower.includes('bottle') || lower.includes('flask') || lower.includes('water')) {
      return 'bottle';
    }
    if (lower.includes('cup') || lower.includes('tea') || lower.includes('coffee') || lower.includes('mug')) {
      return 'cup-hot';
    }
    if (
      lower.includes('macbook') ||
      lower.includes('mackbooh') ||
      lower.includes('mackbook') ||
      lower.includes('mac') ||
      lower.includes('laptop') ||
      lower.includes('computer') ||
      lower.includes('pc') ||
      lower.includes('apple') ||
      lower.includes('applle')
    ) {
      return 'laptop';
    }
    if (
      lower.includes('monitor') ||
      lower.includes('moniter') ||
      lower.includes('screen') ||
      lower.includes('display') ||
      lower.includes('desktop')
    ) {
      return 'pc-display';
    }
    if (lower.includes('sim') || lower.includes('card') || lower.includes('network')) {
      return 'sim';
    }
    if (
      lower.includes('phone') ||
      lower.includes('mobile') ||
      lower.includes('iphone') ||
      lower.includes('android') ||
      lower.includes('phn')
    ) {
      return 'phone';
    }
    if (lower.includes('tablet') || lower.includes('tab') || lower.includes('ipad')) {
      return 'tablet';
    }
    if (lower.includes('keyboard') || lower.includes('kybd')) {
      return 'keyboard';
    }
    if (lower.includes('mouse') || lower.includes('mice')) {
      return 'mouse';
    }
    if (
      lower.includes('headset') ||
      lower.includes('headphone') ||
      lower.includes('headphones') ||
      lower.includes('earphone')
    ) {
      return 'headset';
    }
    return 'cpu';
  }

  hardwareIconClass(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('charger') || lower.includes('plug') || lower.includes('adapter')) {
      return 'oh-icon-tile--orange';
    }
    if (lower.includes('bag') || lower.includes('backpack') || lower.includes('briefcase')) {
      return 'oh-icon-tile--amber';
    }
    if (lower.includes('bottle') || lower.includes('flask') || lower.includes('water')) {
      return 'oh-icon-tile--blue';
    }
    if (lower.includes('cup') || lower.includes('tea') || lower.includes('coffee') || lower.includes('mug')) {
      return 'oh-icon-tile--violet';
    }
    if (
      lower.includes('macbook') ||
      lower.includes('mackbooh') ||
      lower.includes('mackbook') ||
      lower.includes('mac') ||
      lower.includes('laptop') ||
      lower.includes('computer') ||
      lower.includes('pc') ||
      lower.includes('apple') ||
      lower.includes('applle')
    ) {
      return 'oh-icon-tile--blue';
    }
    if (
      lower.includes('monitor') ||
      lower.includes('moniter') ||
      lower.includes('screen') ||
      lower.includes('display') ||
      lower.includes('desktop')
    ) {
      return 'oh-icon-tile--purple';
    }
    if (lower.includes('sim') || lower.includes('card') || lower.includes('network')) {
      return 'oh-icon-tile--indigo';
    }
    if (
      lower.includes('phone') ||
      lower.includes('mobile') ||
      lower.includes('iphone') ||
      lower.includes('android') ||
      lower.includes('phn')
    ) {
      return 'oh-icon-tile--orange';
    }
    if (lower.includes('tablet') || lower.includes('tab') || lower.includes('ipad')) {
      return 'oh-icon-tile--indigo';
    }
    if (
      lower.includes('headset') ||
      lower.includes('headphone') ||
      lower.includes('headphones') ||
      lower.includes('earphone')
    ) {
      return 'oh-icon-tile--violet';
    }
    return 'oh-icon-tile--amber';
  }

  checkStatusIcon(status: string): string {
    switch (status) {
      case 'Clear':
        return 'bi-check-circle-fill text-success';
      case 'In progress':
        return 'bi-record-circle-fill text-warning';
      case 'Pending':
        return 'bi-circle text-muted';
      default:
        return 'bi-circle';
    }
  }

  checkStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Clear':
        return 'oh-badge--success';
      case 'In progress':
        return 'oh-badge--warning';
      case 'Pending':
        return 'oh-badge--neutral';
      default:
        return 'oh-badge--neutral';
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
    this.syncBundleFromApps();
  }

  private applyBundlePreset(id: AccessBundleId): void {
    if (id === 'Custom') {
      return;
    }
    const preset = BUNDLE_PRESETS[id];
    this.apps.update(list => list.map(a => ({ ...a, enabled: preset.includes(a.name) })));
  }

  // Manually toggling an app can make the selection no longer match the active
  // named preset — when that happens, switch to "Custom" so the highlighted
  // card reflects reality instead of showing a stale preset as still selected.
  private syncBundleFromApps(): void {
    const enabledNames = this.apps()
      .filter(a => a.enabled)
      .map(a => a.name);
    const enabledSet = new Set(enabledNames);

    const matchesPreset = (id: AccessBundleId) => {
      const preset = BUNDLE_PRESETS[id];
      return preset.length === enabledSet.size && preset.every(name => enabledSet.has(name));
    };

    if (matchesPreset('Engineering')) {
      this.accessBundle.set('Engineering');
    } else if (matchesPreset('Standard')) {
      this.accessBundle.set('Standard');
    } else {
      this.accessBundle.set('Custom');
    }
  }
}
