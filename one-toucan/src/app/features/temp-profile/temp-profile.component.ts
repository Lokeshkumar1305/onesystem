import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

interface GeneralInfoForm {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
}

type TempProfileTab = 'general' | 'security' | 'notifications';

// TEMP: scaffold for the header's profile-menu click — sidebar + General
// Information panel layout. Security & Password / Notifications are nav
// placeholders; only General Information (name/email/phone) is wired up to
// actually save. See header.component.ts goToProfile() and app.routes.ts
// for the other half of this.
@Component({
  selector: 'oh-temp-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule],
  templateUrl: './temp-profile.component.html',
  styleUrl: './temp-profile.component.scss'
})
export class TempProfileComponent {
  readonly activeTab = signal<TempProfileTab>('general');

  readonly fullName = signal('Aarav Sharma');
  readonly emailAddress = signal('aarav@onehostel.in');
  readonly phoneNumber = signal('+91 98765 43210');
  readonly role = signal('Super Admin');
  readonly status = signal<'Active' | 'Inactive'>('Active');

  readonly profileImage = signal<string | null>(null);

  readonly initials = computed(() => {
    const parts = this.fullName().trim().split(/\s+/);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });

  readonly alertMessage = signal('');

  form: GeneralInfoForm = this.buildFormSnapshot();

  private buildFormSnapshot(): GeneralInfoForm {
    return {
      fullName: this.fullName(),
      emailAddress: this.emailAddress(),
      phoneNumber: this.phoneNumber()
    };
  }

  selectTab(tab: TempProfileTab): void {
    this.activeTab.set(tab);
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result) {
          this.profileImage.set(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  cancel(): void {
    this.form = this.buildFormSnapshot();
  }

  save(): void {
    this.fullName.set(this.form.fullName);
    this.emailAddress.set(this.form.emailAddress);
    this.phoneNumber.set(this.form.phoneNumber);

    this.alertMessage.set('Profile updated successfully!');
    setTimeout(() => this.alertMessage.set(''), 4000);
  }
}
