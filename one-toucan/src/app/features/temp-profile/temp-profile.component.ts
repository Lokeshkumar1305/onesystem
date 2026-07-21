import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface BasicProfileForm {
  firstName: string;
  lastName: string;
  displayName: string;
  gender: string;
  dob: string;
  maritalStatus: string;
  bloodGroup: string;
  nationality: string;
  personalEmail: string;
  mobileNumber: string;
}

// TEMP: scaffold for the header's profile-menu click — trimmed down to just
// the basic profile fields (no About/Job/Documents/Assets tabs from the real
// ProfileComponent) and directly editable here. See header.component.ts
// goToProfile() and app.routes.ts for the other half of this.
@Component({
  selector: 'oh-temp-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './temp-profile.component.html',
  styleUrl: './temp-profile.component.scss'
})
export class TempProfileComponent {
  readonly firstName = signal('Lokesh Kumar');
  readonly lastName = signal('Kanuboina');
  readonly displayName = signal('Lokesh Kanuboina');
  readonly gender = signal('Male');
  readonly dob = signal('1999-05-13');
  readonly maritalStatus = signal('Single');
  readonly bloodGroup = signal('B- (B Negative)');
  readonly nationality = signal('India');

  readonly workEmail = signal('lokesh.kanuboina@toucanus.com');
  readonly personalEmail = signal('lokeshkumar.kanuboina@gmail.com');
  readonly mobileNumber = signal('+91-9177638977');

  readonly initials = computed(() => {
    const parts = this.displayName().trim().split(/\s+/);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });

  readonly editing = signal(false);
  readonly alertMessage = signal('');

  form: BasicProfileForm = this.buildFormSnapshot();

  private buildFormSnapshot(): BasicProfileForm {
    return {
      firstName: this.firstName(),
      lastName: this.lastName(),
      displayName: this.displayName(),
      gender: this.gender(),
      dob: this.dob(),
      maritalStatus: this.maritalStatus(),
      bloodGroup: this.bloodGroup(),
      nationality: this.nationality(),
      personalEmail: this.personalEmail(),
      mobileNumber: this.mobileNumber()
    };
  }

  startEdit(): void {
    this.form = this.buildFormSnapshot();
    this.editing.set(true);
  }

  cancelEdit(): void {
    this.editing.set(false);
  }

  save(): void {
    this.firstName.set(this.form.firstName);
    this.lastName.set(this.form.lastName);
    this.displayName.set(this.form.displayName);
    this.gender.set(this.form.gender);
    this.dob.set(this.form.dob);
    this.maritalStatus.set(this.form.maritalStatus);
    this.bloodGroup.set(this.form.bloodGroup);
    this.nationality.set(this.form.nationality);
    this.personalEmail.set(this.form.personalEmail);
    this.mobileNumber.set(this.form.mobileNumber);

    this.editing.set(false);
    this.alertMessage.set('Profile updated successfully!');
    setTimeout(() => this.alertMessage.set(''), 4000);
  }
}
