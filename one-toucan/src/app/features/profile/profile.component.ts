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
  category?: 'identity' | 'education' | 'experience' | 'insurance';
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

export interface AssignedAssetItem {
  id: string;
  assetName: string;
  assetCode: string;
  category: string;
  serialNumber: string;
  assignedDate: string;
  status: 'active' | 'under_maintenance';
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

  // Documents Sidebar Signal — Defaults to 'all' so all employee documents populate immediately
  selectedDocFolder = signal<'all' | 'pending' | 'education' | 'experience' | 'identity' | 'insurance' | 'signatures'>('all');
  docSearchQuery = signal<string>('');

  // Assets sub-tabs signal
  activeAssetsSubTab = signal<'assigned' | 'requests' | 'damage'>('assigned');
  assignedAssetsList = signal<AssignedAssetItem[]>([
    {
      id: 'ast_1',
      assetName: 'MacBook Pro 16" (M3 Max, 36GB RAM, 1TB SSD)',
      assetCode: 'AST-MBP-2024-0042',
      category: 'Laptop / Workstation',
      serialNumber: 'C02G4089MD6R',
      assignedDate: '15 Jan 2024',
      status: 'active'
    },
    {
      id: 'ast_2',
      assetName: 'Dell UltraSharp 27" 4K USB-C Hub Monitor (U2723QE)',
      assetCode: 'AST-MON-2024-0118',
      category: 'External Display',
      serialNumber: 'CN-0TY481-74261',
      assignedDate: '15 Jan 2024',
      status: 'active'
    },
    {
      id: 'ast_3',
      assetName: 'Apple Magic Keyboard with Touch ID & Magic Trackpad',
      assetCode: 'AST-ACC-2024-0302',
      category: 'Peripherals',
      serialNumber: 'MK-9940218-A',
      assignedDate: '16 Jan 2024',
      status: 'active'
    },
    {
      id: 'ast_4',
      assetName: 'Jabra Evolve2 75 Wireless ANC Headset',
      assetCode: 'AST-AUD-2024-0091',
      category: 'Audio Device',
      serialNumber: 'JB-7740291-B',
      assignedDate: '20 Feb 2024',
      status: 'active'
    }
  ]);
  assetRequestsList = signal<AssetRequestItem[]>([]);
  showAddAssetRequestForm = signal<boolean>(false);
  tempAssetRequest = {
    assetName: '',
    assetType: 'Laptop',
    justification: ''
  };

  // Signatures Drawer Signal
  showAddSignatureDrawer = signal<boolean>(false);
  signaturesList = signal<SignatureDetails[]>([
    {
      id: 'sig_primary',
      name: 'Primary E-Signature',
      designation: 'CTO · Admin',
      fileName: 'lokesh_kanuboina_signature.png',
      status: 'active'
    }
  ]);
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

  // Bio & Hobbies responses signals
  bioAbout = signal<string>('Full-stack Software Engineer with 5+ years of experience crafting modern enterprise web applications using Angular, TypeScript, and Node.js.');
  bioLoveAboutJob = signal<string>('Solving complex architectural challenges, building intuitive UI/UX design systems, and collaborating with cross-functional teams to deliver impactful software products.');
  bioHobbies = signal<string>('Open-source coding, competitive tech blogging, photography, and playing badminton.');

  editingBioSection = signal<'about' | 'love' | 'hobbies' | null>(null);
  tempBioInput = '';

  // Skills List Signal
  skills = signal<string[]>([
    'Angular 19 & Signals',
    'TypeScript',
    'Node.js & Express',
    'RxJS Architecture',
    'HTML5 & SCSS',
    'RESTful APIs',
    'Git & Version Control',
    'UI/UX Design Systems'
  ]);
  showAddSkillForm = signal<boolean>(false);
  newSkillText = '';

  startEditBio(section: 'about' | 'love' | 'hobbies'): void {
    this.editingBioSection.set(section);
    if (section === 'about') this.tempBioInput = this.bioAbout();
    if (section === 'love') this.tempBioInput = this.bioLoveAboutJob();
    if (section === 'hobbies') this.tempBioInput = this.bioHobbies();
  }

  saveBio(section: 'about' | 'love' | 'hobbies'): void {
    if (section === 'about') this.bioAbout.set(this.tempBioInput);
    if (section === 'love') this.bioLoveAboutJob.set(this.tempBioInput);
    if (section === 'hobbies') this.bioHobbies.set(this.tempBioInput);
    this.editingBioSection.set(null);
    this.triggerAlert('Updated response successfully!');
  }

  // Languages List Signal
  languagesSpoken = signal<{ name: string; proficiency: string }[]>([
    { name: 'English', proficiency: 'Professional Fluent' },
    { name: 'Telugu', proficiency: 'Native / Mother Tongue' },
    { name: 'Hindi', proficiency: 'Conversational' }
  ]);

  // Color palette for language rows — cycles for N languages
  langColorPalette: { bg: string; text: string; border: string }[] = [
    { bg: '#e0f2fe', text: '#0369a1', border: '#7dd3fc' },   // Sky Blue
    { bg: '#fce7f3', text: '#be185d', border: '#f9a8d4' },   // Rose Pink
    { bg: '#dcfce7', text: '#15803d', border: '#86efac' },   // Emerald Green
    { bg: '#fef3c7', text: '#b45309', border: '#fcd34d' },   // Amber
    { bg: '#f3e8ff', text: '#7e22ce', border: '#d8b4fe' },   // Purple
    { bg: '#e0e7ff', text: '#4338ca', border: '#a5b4fc' },   // Indigo
    { bg: '#ccfbf1', text: '#0f766e', border: '#5eead4' },   // Teal
    { bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5' },   // Red
  ];

  getLangColor(index: number): { bg: string; text: string; border: string } {
    return this.langColorPalette[index % this.langColorPalette.length];
  }

  showAddLanguageForm = signal<boolean>(false);
  newLanguageName = '';
  newLanguageProficiency = 'Conversational';

  addSkill(): void {
    const skill = this.newSkillText.trim();
    if (skill && !this.skills().includes(skill)) {
      this.skills.set([...this.skills(), skill]);
      this.newSkillText = '';
      this.triggerAlert(`Added skill "${skill}"`);
    }
  }

  removeSkill(skillToRemove: string): void {
    this.skills.set(this.skills().filter(s => s !== skillToRemove));
    this.triggerAlert(`Removed skill "${skillToRemove}"`);
  }

  addLanguage(): void {
    const lang = this.newLanguageName.trim();
    if (lang && !this.languagesSpoken().some(l => l.name.toLowerCase() === lang.toLowerCase())) {
      this.languagesSpoken.set([...this.languagesSpoken(), {
        name: lang,
        proficiency: this.newLanguageProficiency
      }]);
      this.newLanguageName = '';
      this.newLanguageProficiency = 'Conversational';
      this.showAddLanguageForm.set(false);
      this.triggerAlert(`Added language "${lang}"`);
    }
  }

  removeLanguage(langToRemove: string): void {
    this.languagesSpoken.set(this.languagesSpoken().filter(l => l.name !== langToRemove));
    this.triggerAlert(`Removed language "${langToRemove}"`);
  }

  // Experience and Education lists
  experiences = signal<ExperienceItem[]>([
    {
      company: 'Toucan Payments',
      role: 'Software Engineer',
      startDate: '2023-04',
      endDate: ''
    },
    {
      company: 'TechSolutions Ltd',
      role: 'Associate Software Engineer',
      startDate: '2021-06',
      endDate: '2023-03'
    }
  ]);
  educations = signal<EducationItem[]>([
    {
      school: 'Jawaharlal Nehru Technological University',
      degree: 'B.Tech in Computer Science',
      year: '2021'
    }
  ]);

  // Documents Store (Signal)
  documentsList = signal<DocumentDetails[]>([
    {
      id: 'aadhaar',
      name: 'Aadhaar Card',
      status: 'pending',
      mandatory: true,
      category: 'identity'
    },
    {
      id: 'pan',
      name: 'PAN Card',
      status: 'verified',
      mandatory: false,
      category: 'identity',
      docNumber: 'XXXXXXXX58J',
      holderName: 'Lokesh Kumar Kanuboina',
      dob: '1999-05-13',
      parentName: 'Ramana Kanuboina'
    },
    {
      id: 'voter',
      name: 'Voter ID Card',
      status: 'pending',
      mandatory: true,
      category: 'identity'
    },
    {
      id: 'license',
      name: 'Driving License',
      status: 'pending',
      mandatory: true,
      category: 'identity'
    },
    {
      id: 'passport',
      name: 'Passport',
      status: 'pending',
      mandatory: true,
      category: 'identity'
    },
    {
      id: 'edu_degree',
      name: 'Graduation Degree Certificate (B.Tech)',
      status: 'verified',
      mandatory: true,
      category: 'education',
      docNumber: 'REG-2017-CS-0492',
      holderName: 'Lokesh Kumar Kanuboina',
      dob: '1999-05-13',
      parentName: 'JNTU Kakinada'
    },
    {
      id: 'edu_12th',
      name: '12th / Higher Secondary Certificate',
      status: 'verified',
      mandatory: true,
      category: 'education',
      docNumber: 'HSC-2017-884920',
      holderName: 'Lokesh Kumar Kanuboina',
      dob: '1999-05-13'
    },
    {
      id: 'exp_relieving',
      name: 'Relieving & Experience Letter',
      status: 'verified',
      mandatory: true,
      category: 'experience',
      docNumber: 'EXP-TOUCAN-2024-089',
      holderName: 'Lokesh Kumar Kanuboina',
      dob: '1999-05-13',
      parentName: 'TechSolutions Ltd'
    },
    {
      id: 'exp_payslip',
      name: 'Last 3 Months Pay Slips',
      status: 'verified',
      mandatory: true,
      category: 'experience',
      docNumber: 'PAY-2024-Q2',
      holderName: 'Lokesh Kumar Kanuboina',
      dob: '1999-05-13'
    },
    {
      id: 'ins_2025',
      name: 'Group Health Insurance Policy 2025-26',
      status: 'verified',
      mandatory: false,
      category: 'insurance',
      docNumber: 'GMI-8849-2025',
      holderName: 'Lokesh Kumar Kanuboina',
      fileName: 'insurance_policy_2025.pdf'
    },
    {
      id: 'ins_2026',
      name: 'Group Health Insurance Policy 2026-27',
      status: 'verified',
      mandatory: false,
      category: 'insurance',
      docNumber: 'GMI-8849-2026',
      holderName: 'Lokesh Kumar Kanuboina',
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

  isPrimaryComplete = computed(() => {
    return !!this.firstName().trim() &&
           !!this.lastName().trim() &&
           !!this.displayName().trim() &&
           !!this.gender().trim() &&
           !!this.dob().trim() &&
           !!this.maritalStatus().trim() &&
           !!this.bloodGroup().trim() &&
           !!this.nationality().trim();
  });

  isContactComplete = computed(() => {
    return !!this.workEmail().trim() &&
           !!this.personalEmail().trim() &&
           !!this.mobileNumber().trim();
  });

  isAddressesComplete = computed(() => {
    return !!this.currentAddress().trim() &&
           !!this.permanentAddress().trim();
  });

  isExperienceComplete = computed(() => {
    return this.experiences().length > 0;
  });

  isEducationComplete = computed(() => {
    return this.educations().length > 0;
  });

  isSummaryComplete = computed(() => {
    return !!this.professionalSummaryText().trim();
  });

  panCardDoc = computed(() => {
    return this.documentsList().find(d => d.id === 'pan');
  });

  aadhaarCardDoc = computed(() => {
    return this.documentsList().find(d => d.id === 'aadhaar');
  });

  initials = computed(() => {
    const parts = this.displayName().trim().split(/\s+/);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });

  removeExperience(item: ExperienceItem): void {
    this.experiences.set(this.experiences().filter(e => e !== item));
    this.triggerAlert(`Removed experience at ${item.company}`);
  }

  removeEducation(item: EducationItem): void {
    this.educations.set(this.educations().filter(e => e !== item));
    this.triggerAlert(`Removed education at ${item.school}`);
  }

  // Dynamic filter for documents pending count and summary stats
  pendingDocsCount = computed(() => {
    return this.documentsList().filter(d => d.status === 'pending').length;
  });
  verifiedDocsCount = computed(() => {
    return this.documentsList().filter(d => d.status === 'verified').length;
  });
  totalDocsCount = computed(() => {
    return this.documentsList().length;
  });

  // Modal & Preview state for Documents tab
  previewDocumentModal = signal<DocumentDetails | null>(null);
  showAddCustomDocModal = signal<boolean>(false);
  tempCustomDoc = {
    name: '',
    category: 'identity' as 'identity' | 'education' | 'experience' | 'insurance',
    docNumber: '',
    holderName: '',
    dob: '',
    parentName: '',
    fileName: '',
    mandatory: false
  };
  tempCustomDocDob: Date | null = null;

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
    const existing = this.documentsList().find(d => d.id === docId);
    this.tempDocForm = {
      docNumber: existing?.docNumber || '',
      holderName: existing?.holderName || this.displayName(),
      dob: existing?.dob || this.dob(),
      parentName: existing?.parentName || '',
      fileName: existing?.fileName || ''
    };
    this.tempDocDob = this.dateStringToDate(existing?.dob || this.dob());
    this.activeDocAddForm.set(docId);
  }

  onDocFileSelected(event: any): void {
    const file = event.target?.files?.[0];
    if (file) {
      this.tempDocForm.fileName = file.name;
    }
  }

  saveDocumentDetails(docId: string): void {
    const dobString = this.dateToDateString(this.tempDocDob);
    const existing = this.documentsList().find(d => d.id === docId);
    const list = this.documentsList().map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          status: 'verified' as const,
          docNumber: this.tempDocForm.docNumber || doc.docNumber || 'XXXXXXXX99X',
          holderName: this.tempDocForm.holderName || doc.holderName || this.displayName(),
          dob: dobString || doc.dob || this.dob(),
          parentName: this.tempDocForm.parentName !== undefined ? this.tempDocForm.parentName : doc.parentName,
          fileName: this.tempDocForm.fileName || doc.fileName || `${doc.id}_uploaded.pdf`
        };
      }
      return doc;
    });

    this.documentsList.set(list);
    this.activeDocAddForm.set(null);
    this.triggerAlert(`Successfully updated and verified ${existing?.name || docId.toUpperCase()} details!`);
  }

  openAddCustomDoc(): void {
    this.tempCustomDoc = {
      name: '',
      category: 'identity',
      docNumber: '',
      holderName: this.displayName(),
      dob: this.dob(),
      parentName: '',
      fileName: '',
      mandatory: false
    };
    this.tempCustomDocDob = this.dateStringToDate(this.dob());
    this.showAddCustomDocModal.set(true);
  }

  onCustomDocFileSelected(event: any): void {
    const file = event.target?.files?.[0];
    if (file) {
      this.tempCustomDoc.fileName = file.name;
    }
  }

  addCustomDocSubmit(): void {
    if (this.tempCustomDoc.name.trim()) {
      const dobString = this.dateToDateString(this.tempCustomDocDob);
      const newDoc: DocumentDetails = {
        id: 'custom_' + Date.now(),
        name: this.tempCustomDoc.name.trim(),
        category: this.tempCustomDoc.category,
        status: 'verified',
        mandatory: this.tempCustomDoc.mandatory,
        docNumber: this.tempCustomDoc.docNumber || 'DOC-' + Math.floor(10000 + Math.random() * 90000),
        holderName: this.tempCustomDoc.holderName || this.displayName(),
        dob: dobString || this.dob(),
        parentName: this.tempCustomDoc.parentName,
        fileName: this.tempCustomDoc.fileName || `${this.tempCustomDoc.name.toLowerCase().replace(/\s+/g, '_')}.pdf`
      };
      this.documentsList.set([...this.documentsList(), newDoc]);
      this.showAddCustomDocModal.set(false);
      this.triggerAlert(`Document "${newDoc.name}" uploaded & saved successfully!`);
    }
  }

  deleteDocument(docId: string): void {
    const doc = this.documentsList().find(d => d.id === docId);
    this.documentsList.set(this.documentsList().filter(d => d.id !== docId));
    this.triggerAlert(`Deleted document "${doc?.name || docId}".`);
  }

  openPreviewDocument(doc: DocumentDetails): void {
    this.previewDocumentModal.set(doc);
  }

  closePreviewDocument(): void {
    this.previewDocumentModal.set(null);
  }

  getFilteredDocs(category: string): DocumentDetails[] {
    const search = this.docSearchQuery().toLowerCase().trim();
    let docs = this.documentsList();

    // First filter by category
    if (category === 'all') {
      docs = docs;
    } else if (category === 'pending') {
      docs = docs.filter(d => d.status === 'pending');
    } else if (category === 'education') {
      docs = docs.filter(d => d.category === 'education' || d.id.startsWith('edu_'));
    } else if (category === 'experience') {
      docs = docs.filter(d => d.category === 'experience' || d.id.startsWith('exp_'));
    } else if (category === 'identity') {
      docs = docs.filter(d => d.category === 'identity' || ['aadhaar', 'pan', 'voter', 'license', 'passport'].includes(d.id));
    } else if (category === 'insurance') {
      docs = docs.filter(d => d.category === 'insurance' || d.id.startsWith('ins_'));
    } else if (category === 'signatures') {
      docs = [];
    }

    // Apply search filter if query exists
    if (search) {
      docs = docs.filter(d => d.name.toLowerCase().includes(search) || (d.docNumber && d.docNumber.toLowerCase().includes(search)));
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

  // Asset preview methods
  previewAssetModal = signal<AssignedAssetItem | null>(null);

  openPreviewAsset(asset: AssignedAssetItem): void {
    this.previewAssetModal.set(asset);
  }

  closePreviewAsset(): void {
    this.previewAssetModal.set(null);
  }
}
