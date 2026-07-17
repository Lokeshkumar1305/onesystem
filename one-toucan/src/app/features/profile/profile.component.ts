import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface ExperienceItem {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  year: string;
}

export interface DocumentDetails {
  id: string;
  name: string;
  status: 'pending' | 'verified';
  mandatory: boolean;
  docNumber?: string;
  holderName?: string;
  dob?: string;
  parentName?: string;
  fileName?: string;
}

export interface SignatureDetails {
  id: string;
  name: string;
  designation: string;
  fileName: string;
  status: 'active' | 'pending';
}

export interface AssetRequestItem {
  id: string;
  assetName: string;
  assetType: string;
  justification: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

@Component({
  selector: 'oh-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatSlideToggleModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  // Navigation tabs signal
  activeTab = signal<'about' | 'profile' | 'job' | 'documents' | 'assets'>('about');
  activeAboutSubTab = signal<'summary' | 'timeline' | 'wall'>('summary');

  // Documents Sidebar Signal
  selectedDocFolder = signal<'pending' | 'education' | 'experience' | 'identity' | 'insurance' | 'signatures'>('pending');
  docSearchQuery = signal<string>('');

  // Assets sub-tabs signal
  activeAssetsSubTab = signal<'assigned' | 'requests' | 'damage'>('assigned');
  assetRequestsList = signal<AssetRequestItem[]>([]);
  showAddAssetRequestForm = signal<boolean>(false);
  tempAssetRequest = {
    assetName: '',
    assetType: 'Laptop',
    justification: ''
  };

  // Signatures Drawer Signal
  showAddSignatureDrawer = signal<boolean>(false);
  signaturesList = signal<SignatureDetails[]>([]);
  tempSignatureForm = {
    name: '',
    designation: '',
    fileName: ''
  };

  // Edit Modes State
  editMode = signal<{ [key: string]: boolean }>({
    primary: false,
    contact: false,
    addresses: false,
    relations: false,
    summary: false,
    experience: false,
    education: false
  });

  // User details state (signals)
  firstName = signal<string>('Lokesh Kumar');
  middleName = signal<string>('');
  lastName = signal<string>('Kanuboina');
  displayName = signal<string>('Lokesh Kanuboina');
  gender = signal<string>('Male');
  dob = signal<string>('1999-05-13');
  maritalStatus = signal<string>('Single');
  bloodGroup = signal<string>('B- (B Negative)');
  physicallyHandicapped = signal<string>('No');
  nationality = signal<string>('India');

  workEmail = signal<string>('lokesh.kanuboina@toucanus.com');
  personalEmail = signal<string>('lokeshkumar.kanuboina@gmail.com');
  mobileNumber = signal<string>('+91-9177638977');
  workPhone = signal<string>('');
  residencePhone = signal<string>('');
  emergencyNumber = signal<string>('');
  emergencyContactName = signal<string>('');

  currentAddress = signal<string>('');
  permanentAddress = signal<string>('');

  motherName = signal<string>('0');
  spouseName = signal<string>('0');

  professionalSummaryText = signal<string>('');

  // Experience and Education lists
  experiences = signal<ExperienceItem[]>([]);
  educations = signal<EducationItem[]>([]);

  // Documents Store (Signal)
  documentsList = signal<DocumentDetails[]>([
    {
      id: 'aadhaar',
      name: 'Aadhaar Card',
      status: 'pending',
      mandatory: true
    },
    {
      id: 'pan',
      name: 'Pan Card',
      status: 'verified',
      mandatory: false,
      docNumber: 'XXXXXXXX58J',
      holderName: 'Lokesh Kumar Kanuboina',
      dob: '1999-05-13',
      parentName: 'Lokesh Kumar Kanuboina'
    },
    {
      id: 'voter',
      name: 'Voter Id Card',
      status: 'pending',
      mandatory: true
    },
    {
      id: 'license',
      name: 'Driving License',
      status: 'pending',
      mandatory: true
    },
    {
      id: 'passport',
      name: 'Passport',
      status: 'pending',
      mandatory: true
    },
    {
      id: 'edu_docs',
      name: 'Educational Documents',
      status: 'pending',
      mandatory: true
    },
    {
      id: 'prev_exp',
      name: 'Previous Experience',
      status: 'pending',
      mandatory: true
    },
    {
      id: 'ins_2025',
      name: 'Insurance 2025-26',
      status: 'verified',
      mandatory: false,
      fileName: 'insurance_policy_2025.pdf'
    },
    {
      id: 'ins_2026',
      name: 'Insurance 2026-27',
      status: 'verified',
      mandatory: false,
      fileName: 'insurance_policy_2026.pdf'
    }
  ]);

  // Document add forms controller
  activeDocAddForm = signal<string | null>(null);
  tempDocForm = {
    docNumber: '',
    holderName: '',
    dob: '',
    parentName: '',
    fileName: ''
  };

  // Temp form models for edit modes
  tempPrimary = {
    firstName: '',
    middleName: '',
    lastName: '',
    displayName: '',
    gender: '',
    dob: '',
    maritalStatus: '',
    bloodGroup: '',
    physicallyHandicapped: '',
    nationality: ''
  };

  tempContact = {
    personalEmail: '',
    mobileNumber: '',
    workPhone: '',
    residencePhone: '',
    emergencyNumber: '',
    emergencyContactName: ''
  };

  tempAddresses = {
    currentAddress: '',
    permanentAddress: ''
  };

  tempRelations = {
    motherName: '',
    spouseName: ''
  };

  tempSummary = '';

  tempNewExp = { company: '', role: '', startDate: '', endDate: '' };
  tempNewEdu = { school: '', degree: '', year: '' };

  // Datepicker-bound fields — kept as stable Date references (set only on
  // entering edit mode / on user selection), never recomputed inline in the
  // template. Computing a fresh `new Date(...)` on every change-detection
  // cycle there previously caused mat-datepicker's internal selection model
  // to loop indefinitely (write -> change -> write -> ...), hanging the page.
  tempPrimaryDob: Date | null = null;
  tempDocDob: Date | null = null;
  tempExpStartDate: Date | null = null;
  tempExpEndDate: Date | null = null;

  // Profile completeness calculator
  completionPercent = computed(() => {
    let totalFields = 16;
    let filledFields = 0;

    if (this.firstName().trim()) filledFields++;
    if (this.lastName().trim()) filledFields++;
    if (this.displayName().trim()) filledFields++;
    if (this.gender().trim()) filledFields++;
    if (this.dob().trim()) filledFields++;
    if (this.maritalStatus().trim()) filledFields++;
    if (this.bloodGroup().trim()) filledFields++;
    if (this.nationality().trim()) filledFields++;

    if (this.workEmail().trim()) filledFields++;
    if (this.personalEmail().trim()) filledFields++;
    if (this.mobileNumber().trim()) filledFields++;
    if (this.currentAddress().trim()) filledFields++;
    if (this.permanentAddress().trim()) filledFields++;
    if (this.professionalSummaryText().trim()) filledFields++;
    if (this.experiences().length > 0) filledFields++;
    if (this.educations().length > 0) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  });

  // Dynamic filter for documents pending count
  pendingDocsCount = computed(() => {
    return this.documentsList().filter(d => d.status === 'pending').length;
  });

  // Skills state
  skills = signal<string[]>([]);
  showAddSkillForm = signal<boolean>(false);
  newSkillText = signal<string>('');

  // Sidenav toggle simulation for JOB tab
  disableAttendanceTracking = signal<boolean>(false);

  // Success message alert signal
  alertMessage = signal<string>('');

  triggerAlert(message: string): void {
    this.alertMessage.set(message);
    setTimeout(() => this.alertMessage.set(''), 4000);
  }

  // Edit action handlers
  toggleEdit(section: string): void {
    const states = { ...this.editMode() };
    const enteringEdit = !states[section];
    states[section] = enteringEdit;
    this.editMode.set(states);

    if (enteringEdit) {
      // Initialize form bindings
      if (section === 'primary') {
        this.tempPrimary = {
          firstName: this.firstName(),
          middleName: this.middleName(),
          lastName: this.lastName(),
          displayName: this.displayName(),
          gender: this.gender(),
          dob: this.dob(),
          maritalStatus: this.maritalStatus(),
          bloodGroup: this.bloodGroup(),
          physicallyHandicapped: this.physicallyHandicapped(),
          nationality: this.nationality()
        };
        this.tempPrimaryDob = this.dateStringToDate(this.dob());
      } else if (section === 'contact') {
        this.tempContact = {
          personalEmail: this.personalEmail(),
          mobileNumber: this.mobileNumber(),
          workPhone: this.workPhone(),
          residencePhone: this.residencePhone(),
          emergencyNumber: this.emergencyNumber(),
          emergencyContactName: this.emergencyContactName()
        };
      } else if (section === 'addresses') {
        this.tempAddresses = {
          currentAddress: this.currentAddress(),
          permanentAddress: this.permanentAddress()
        };
      } else if (section === 'relations') {
        this.tempRelations = {
          motherName: this.motherName(),
          spouseName: this.spouseName()
        };
      } else if (section === 'summary') {
        this.tempSummary = this.professionalSummaryText();
      }
    }
  }

  saveSection(section: string): void {
    if (section === 'primary') {
      this.firstName.set(this.tempPrimary.firstName);
      this.middleName.set(this.tempPrimary.middleName);
      this.lastName.set(this.tempPrimary.lastName);
      this.displayName.set(this.tempPrimary.displayName);
      this.gender.set(this.tempPrimary.gender);
      this.dob.set(this.dateToDateString(this.tempPrimaryDob));
      this.maritalStatus.set(this.tempPrimary.maritalStatus);
      this.bloodGroup.set(this.tempPrimary.bloodGroup);
      this.physicallyHandicapped.set(this.tempPrimary.physicallyHandicapped);
      this.nationality.set(this.tempPrimary.nationality);
    } else if (section === 'contact') {
      this.personalEmail.set(this.tempContact.personalEmail);
      this.mobileNumber.set(this.tempContact.mobileNumber);
      this.workPhone.set(this.tempContact.workPhone);
      this.residencePhone.set(this.tempContact.residencePhone);
      this.emergencyNumber.set(this.tempContact.emergencyNumber);
      this.emergencyContactName.set(this.tempContact.emergencyContactName);
    } else if (section === 'addresses') {
      this.currentAddress.set(this.tempAddresses.currentAddress);
      this.permanentAddress.set(this.tempAddresses.permanentAddress);
    } else if (section === 'relations') {
      this.motherName.set(this.tempRelations.motherName);
      this.spouseName.set(this.tempRelations.spouseName);
    } else if (section === 'summary') {
      this.professionalSummaryText.set(this.tempSummary);
    }

    this.toggleEdit(section);
    this.triggerAlert(`Successfully updated ${section.replace(/^\w/, c => c.toUpperCase())} Details!`);
  }

  // Skills management
  addSkill(): void {
    const text = this.newSkillText().trim();
    if (text && !this.skills().includes(text)) {
      this.skills.set([...this.skills(), text]);
      this.newSkillText.set('');
      this.showAddSkillForm.set(false);
      this.triggerAlert(`Skill "${text}" added!`);
    }
  }

  removeSkill(skill: string): void {
    this.skills.set(this.skills().filter(s => s !== skill));
    this.triggerAlert(`Skill "${skill}" removed.`);
  }

  // Education/Experience add handlers
  addNewExperience(): void {
    if (this.tempNewExp.company.trim() && this.tempNewExp.role.trim()) {
      this.experiences.set([...this.experiences(), { ...this.tempNewExp }]);
      this.tempNewExp = { company: '', role: '', startDate: '', endDate: '' };
      this.tempExpStartDate = null;
      this.tempExpEndDate = null;
      this.triggerAlert('Added work experience item!');
    }
  }

  addNewEducation(): void {
    if (this.tempNewEdu.school.trim() && this.tempNewEdu.degree.trim()) {
      this.educations.set([...this.educations(), { ...this.tempNewEdu }]);
      this.tempNewEdu = { school: '', degree: '', year: '' };
      this.triggerAlert('Added education credential!');
    }
  }

  // ---- Date <-> string conversions for mat-datepicker fields --------------------
  // The underlying signals/temp forms store plain 'YYYY-MM-DD' / 'YYYY-MM' strings
  // (used elsewhere via the `date` pipe), while mat-datepicker works with Date objects.
  dateStringToDate(value: string): Date | null {
    if (!value) {
      return null;
    }
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  dateToDateString(value: Date | null): string {
    if (!value) {
      return '';
    }
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  monthStringToDate(value: string): Date | null {
    if (!value) {
      return null;
    }
    const parsed = new Date(`${value}-01`);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  dateToMonthString(value: Date | null): string {
    if (!value) {
      return '';
    }
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  chosenMonthHandler(normalizedMonth: Date, datepicker: MatDatepicker<Date>, target: 'expStart' | 'expEnd'): void {
    if (target === 'expStart') {
      this.tempExpStartDate = normalizedMonth;
      this.tempNewExp.startDate = this.dateToMonthString(normalizedMonth);
    } else {
      this.tempExpEndDate = normalizedMonth;
      this.tempNewExp.endDate = this.dateToMonthString(normalizedMonth);
    }
    datepicker.close();
  }

  // Documents management
  openAddDocForm(docId: string): void {
    this.tempDocForm = {
      docNumber: '',
      holderName: this.displayName(),
      dob: this.dob(),
      parentName: '',
      fileName: ''
    };
    this.tempDocDob = this.dateStringToDate(this.dob());
    this.activeDocAddForm.set(docId);
  }

  saveDocumentDetails(docId: string): void {
    const dobString = this.dateToDateString(this.tempDocDob);
    const list = this.documentsList().map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          status: 'verified' as const,
          docNumber: this.tempDocForm.docNumber || 'XXXXXXXX99X',
          holderName: this.tempDocForm.holderName,
          dob: dobString,
          parentName: this.tempDocForm.parentName,
          fileName: this.tempDocForm.fileName || `${docId}_uploaded.pdf`
        };
      }
      return doc;
    });

    this.documentsList.set(list);
    this.activeDocAddForm.set(null);
    this.triggerAlert(`Successfully uploaded and verified ${docId.toUpperCase()} details!`);
  }

  getFilteredDocs(category: string): DocumentDetails[] {
    const search = this.docSearchQuery().toLowerCase().trim();
    let docs = this.documentsList();

    // First filter by category
    if (category === 'pending') {
      docs = docs.filter(d => d.status === 'pending');
    } else if (category === 'education') {
      docs = docs.filter(d => d.id === 'edu_docs');
    } else if (category === 'experience') {
      docs = docs.filter(d => d.id === 'prev_exp');
    } else if (category === 'identity') {
      docs = docs.filter(d => ['aadhaar', 'pan', 'voter', 'license', 'passport'].includes(d.id));
    } else if (category === 'insurance') {
      docs = docs.filter(d => d.id.startsWith('ins_'));
    } else if (category === 'signatures') {
      docs = [];
    }

    // Apply search filter if query exists
    if (search) {
      docs = docs.filter(d => d.name.toLowerCase().includes(search));
    }

    return docs;
  }

  // Signatures trigger handlers
  openAddSignature(): void {
    this.tempSignatureForm = {
      name: '',
      designation: '',
      fileName: ''
    };
    this.showAddSignatureDrawer.set(true);
  }

  onSignatureFileSelected(event: any): void {
    const file = event.target?.files?.[0];
    if (file) {
      this.tempSignatureForm.fileName = file.name;
    }
  }

  addSignatureSubmit(): void {
    if (this.tempSignatureForm.name.trim()) {
      const newSig: SignatureDetails = {
        id: 'sig_' + Date.now(),
        name: this.tempSignatureForm.name,
        designation: this.tempSignatureForm.designation || 'Staff',
        fileName: this.tempSignatureForm.fileName || 'signature_uploaded.png',
        status: 'active'
      };
      this.signaturesList.set([...this.signaturesList(), newSig]);
      this.showAddSignatureDrawer.set(false);
      this.triggerAlert(`Signature configuration for "${newSig.name}" added successfully!`);
    }
  }

  deleteSignature(sigId: string): void {
    this.signaturesList.set(this.signaturesList().filter(s => s.id !== sigId));
    this.triggerAlert('Deleted signature configuration.');
  }

  // Asset request submit
  addAssetRequestSubmit(): void {
    if (this.tempAssetRequest.assetName.trim()) {
      const newRequest: AssetRequestItem = {
        id: 'req_' + Date.now(),
        assetName: this.tempAssetRequest.assetName,
        assetType: this.tempAssetRequest.assetType,
        justification: this.tempAssetRequest.justification,
        requestDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      this.assetRequestsList.set([newRequest, ...this.assetRequestsList()]);
      this.tempAssetRequest = { assetName: '', assetType: 'Laptop', justification: '' };
      this.showAddAssetRequestForm.set(false);
      this.triggerAlert('Requested asset successfully!');
    }
  }
}
