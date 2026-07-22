import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectStateService } from '../../../core/projects/project-state.service';
import { DocumentItem } from '../../../core/projects/projects.data';

type DocCategory = 'Tech Doc' | 'Functional Doc' | 'KT' | 'Other';
type TechCategory = 'Backend' | 'Frontend' | 'DevOps' | 'QA' | 'Database' | 'Mobile';

interface DocEntry {
  category: DocCategory;
  subType?: string;
  name: string;
  url?: string;
  fileName?: string;
}

@Component({
  selector: 'oh-create-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly projectState = inject(ProjectStateService);

  // Edit mode — reuses this same wizard, but only Ownership, PM/Tech
  // Lead/BA, and Documents are actually editable; everything else is
  // shown read-only for context. Triggered via ?edit=<projectId>.
  readonly editingProjectId = signal<string | null>(null);
  readonly isEditMode = computed(() => this.editingProjectId() !== null);

  // Available parent projects for sub-module selection
  readonly parentProjects = computed(() =>
    this.projectState.activeProjects().filter(p => !p.isModule)
  );

  ngOnInit(): void {
    const editId = this.route.snapshot.queryParamMap.get('edit');
    if (!editId) return;

    const project = this.projectState.getProject(editId);
    if (!project) return;

    this.editingProjectId.set(editId);
    // All steps are reachable immediately, and land on Ownership (the first
    // editable step) rather than the locked Entity Type step.
    this.maxStepReached.set(this.steps.length);
    this.currentStep.set(3);
    this.formIsModule.set(project.isModule);
    this.formParentProjectName.set(project.parentProjectName || '');
    this.formName.set(project.name);
    this.formKey.set(project.key);
    this.formClient.set(project.client);
    this.formDescription.set(project.description);
    this.formRepoName.set(project.repoName || '');
    this.formProjectManager.set(project.projectManager || '');
    this.formProjectBa.set(project.projectBa || '');
    this.formProjectTechLead.set(project.projectTechLead || '');
    this.primaryOwners.set([...(project.primaryOwners || [])]);
    this.secondaryOwners.set([...(project.secondaryOwners || [])]);
    this.techStackTags.set([...(project.techStack || [])]);

    this.documents.set([
      ...project.documents.map(doc => ({ category: this.docCategoryFromItem(doc.category), name: doc.name })),
      ...project.ktSessions.map(kt => ({ category: 'KT' as const, name: kt.topic, url: kt.recordingUrl }))
    ]);
  }

  private docCategoryFromItem(category: DocumentItem['category']): DocCategory {
    if (category === 'BRD') return 'Functional Doc';
    if (category === 'Architecture') return 'Tech Doc';
    return 'Other';
  }

  // Form signals
  readonly formIsModule = signal(false);
  readonly formParentProjectName = signal('');
  readonly formName = signal('');
  readonly formKey = signal('');
  readonly formClient = signal('Razorpay');
  readonly formDescription = signal('');
  readonly formRepoName = signal('');
  readonly formProjectManager = signal('Lokesh Kanuboina');
  readonly formProjectBa = signal('Vikram Kapoor');
  readonly formProjectTechLead = signal('');

  // Multiple Primary and Secondary Owners
  readonly primaryOwners = signal<string[]>([]);
  readonly secondaryOwners = signal<string[]>([]);
  readonly primaryOwnerInput = signal('');
  readonly secondaryOwnerInput = signal('');
  readonly primaryOwnerSearchQuery = signal('');
  readonly secondaryOwnerSearchQuery = signal('');
  readonly pmSearchQuery = signal('');
  readonly techLeadSearchQuery = signal('');
  readonly baSearchQuery = signal('');

  // Dropdown options exclude names already assigned, so the same person
  // can't be picked twice.
  readonly availablePrimaryOwnerOptions = computed(() =>
    this.availableTeamMembers.filter(m => !this.primaryOwners().includes(m))
  );
  readonly availableSecondaryOwnerOptions = computed(() =>
    this.availableTeamMembers.filter(m => !this.secondaryOwners().includes(m))
  );

  readonly filteredPrimaryOwnerOptions = computed(() => {
    const query = this.primaryOwnerSearchQuery().toLowerCase().trim();
    const available = this.availablePrimaryOwnerOptions();
    if (!query) return available;
    return available.filter(name => name.toLowerCase().includes(query));
  });

  readonly filteredSecondaryOwnerOptions = computed(() => {
    const query = this.secondaryOwnerSearchQuery().toLowerCase().trim();
    const available = this.availableSecondaryOwnerOptions();
    if (!query) return available;
    return available.filter(name => name.toLowerCase().includes(query));
  });

  readonly filteredPmOptions = computed(() => {
    const query = this.pmSearchQuery().toLowerCase().trim();
    const available = this.availableTeamMembers;
    if (!query) return available;
    return available.filter(name => name.toLowerCase().includes(query));
  });

  readonly filteredTechLeadOptions = computed(() => {
    const query = this.techLeadSearchQuery().toLowerCase().trim();
    const available = this.availableTeamMembers;
    if (!query) return available;
    return available.filter(name => name.toLowerCase().includes(query));
  });

  readonly filteredBaOptions = computed(() => {
    const query = this.baSearchQuery().toLowerCase().trim();
    const available = this.availableBas;
    if (!query) return available;
    return available.filter(name => name.toLowerCase().includes(query));
  });

  // Tech stack tags
  readonly techStackTags = signal<string[]>(['Angular', 'Node.js']);
  readonly techInput = signal('');

  // Documents (Optional) — pick a type, the matching mini-form appears below,
  // and everything added lands in one combined list regardless of type.
  readonly documentTypeOptions: DocCategory[] = ['Tech Doc', 'Functional Doc', 'KT', 'Other'];
  readonly selectedDocType = signal<DocCategory>('Tech Doc');

  readonly documents = signal<DocEntry[]>([]);

  // Tech Doc is itself split by engineering discipline, then by the specific
  // technology within it — covers more than just Backend/Frontend.
  readonly techCategories: TechCategory[] = ['Backend', 'Frontend', 'DevOps', 'QA', 'Database', 'Mobile'];
  readonly techTypesByCategory: Record<TechCategory, string[]> = {
    Backend: ['Java', 'Node.js', '.NET', 'Python', 'Go', 'Ruby'],
    Frontend: ['Angular', 'React', 'Vue', 'Next.js', 'Svelte'],
    DevOps: ['Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'AWS', 'Azure'],
    QA: ['Selenium', 'Cypress', 'Playwright', 'Postman', 'JMeter'],
    Database: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
    Mobile: ['iOS (Swift)', 'Android (Kotlin)', 'React Native', 'Flutter']
  };

  readonly selectedTechCategory = signal<TechCategory>('Backend');
  get currentTechTypes(): string[] {
    return this.techTypesByCategory[this.selectedTechCategory()];
  }

  selectTechCategory(category: TechCategory): void {
    this.selectedTechCategory.set(category);
    this.techDocType.set('');
  }

  // No default selection — dropdowns show their "Select..." placeholder until chosen.
  readonly techDocType = signal('');
  readonly techDocName = signal('');
  readonly functionalDocName = signal('');
  readonly ktVideoName = signal('');
  readonly ktVideoUrl = signal('');
  readonly otherDocType = signal('');
  readonly otherDocName = signal('');

  // The uploaded file is tracked separately from the typed name — picking a
  // file no longer overwrites what the user typed. Each shows a
  // remove/re-upload chip once a file is attached.
  readonly techDocFile = signal<File | null>(null);
  readonly functionalDocFile = signal<File | null>(null);
  readonly otherDocFile = signal<File | null>(null);
  readonly ktVideoFile = signal<File | null>(null);

  addTechDoc(): void {
    const name = this.techDocName().trim();
    if (!name || !this.techDocType()) return;
    this.documents.update(list => [...list, {
      category: 'Tech Doc',
      subType: `${this.selectedTechCategory()} · ${this.techDocType()}`,
      name,
      url: 'https://docs.google.com/document/d/1example-tech-spec',
      fileName: this.techDocFile()?.name
    }]);
    this.techDocType.set('');
    this.techDocName.set('');
    this.techDocFile.set(null);
  }

  addFunctionalDoc(): void {
    const name = this.functionalDocName().trim();
    if (!name) return;
    this.documents.update(list => [...list, { 
      category: 'Functional Doc', 
      name, 
      url: 'https://docs.google.com/document/d/1example-functional-brd',
      fileName: this.functionalDocFile()?.name 
    }]);
    this.functionalDocName.set('');
    this.functionalDocFile.set(null);
  }

  addKtVideo(): void {
    const name = this.ktVideoName().trim();
    if (!name) return;
    this.documents.update(list => [...list, {
      category: 'KT',
      name,
      url: this.ktVideoUrl().trim() || 'https://loom.com/share/example-kt-session-video',
      fileName: this.ktVideoFile()?.name
    }]);
    this.ktVideoName.set('');
    this.ktVideoUrl.set('');
    this.ktVideoFile.set(null);
  }

  addOtherDoc(): void {
    const type = this.otherDocType().trim();
    const name = this.otherDocName().trim();
    if (!type || !name) return;
    this.documents.update(list => [...list, { 
      category: 'Other', 
      subType: type, 
      name, 
      url: 'https://docs.google.com/document/d/1example-other-file',
      fileName: this.otherDocFile()?.name 
    }]);
    this.otherDocType.set('');
    this.otherDocName.set('');
    this.otherDocFile.set(null);
  }

  removeDocument(doc: DocEntry): void {
    this.documents.update(list => list.filter(d => d !== doc));
  }

  // File/video "upload" — this prototype has no backend storage, so we just
  // hold onto the picked File so its name can be shown, removed, or replaced
  // before the entry is added.
  onTechDocFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.techDocFile.set(file);
  }

  onFunctionalDocFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.functionalDocFile.set(file);
  }

  onOtherDocFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.otherDocFile.set(file);
  }

  onKtVideoFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.ktVideoFile.set(file);
  }

  // Validation message
  readonly errorMessage = signal<string | null>(null);

  // Stepper wizard state
  readonly steps: { id: number; title: string; subtitle: string }[] = [
    { id: 1, title: 'Entity Type', subtitle: 'Project or sub-module' },
    { id: 2, title: 'Basic Information', subtitle: 'Name, key & description' },
    { id: 3, title: 'Ownership', subtitle: 'Primary & secondary owners' },
    { id: 4, title: 'Leadership & Repo', subtitle: 'PM, Tech Lead, BA, repository' },
    { id: 5, title: 'Tech & Docs', subtitle: 'Tags & optional documents' }
  ];
  readonly currentStep = signal(1);
  readonly maxStepReached = signal(1);

  get activeStepDef() {
    return this.steps.find(s => s.id === this.currentStep())!;
  }

  // Staff members list for quick selection
  readonly availableTeamMembers: string[] = [
    'Dayakar',
    'Gowtham',
    'Ifra',
    'Laya',
    'Lokesh',
    'Manali',
    'Meghadeep',
    'Palkin',
    'Pavam',
    'Priyanka',
    'Raju',
    'Ramana',
    'Ramsai',
    'Sahithya',
    'Soumya',
    'Swathi',
    'Vishvendra',
    'Vivek'
  ];

  readonly availableBas: string[] = ['Sarthak', 'Tanmayee'];

  goBack(): void {
    this.router.navigate(['/temp-project']);
  }

  private validateStep(step: number): string | null {
    if (step === 1 && this.formIsModule() && !this.formParentProjectName()) {
      return 'Please select a Parent Project for the sub-module.';
    }
    if (step === 2 && !this.formName().trim()) {
      return 'Please enter a Project/Module name.';
    }
    return null;
  }

  goToStep(step: number): void {
    if (step > this.maxStepReached()) return;
    this.errorMessage.set(null);
    this.currentStep.set(step);
  }

  back(): void {
    if (this.currentStep() === 1) {
      this.goBack();
      return;
    }
    this.errorMessage.set(null);
    this.currentStep.update(s => s - 1);
  }

  next(): void {
    const error = this.validateStep(this.currentStep());
    if (error) {
      this.errorMessage.set(error);
      return;
    }
    this.errorMessage.set(null);

    if (this.currentStep() === this.steps.length) {
      this.submitProject();
      return;
    }
    this.currentStep.update(s => s + 1);
    this.maxStepReached.update(m => Math.max(m, this.currentStep()));
  }

  onNameChange(val: string): void {
    this.formName.set(val);
  }

  // Primary Owners
  addPrimaryOwner(name?: string): void {
    const ownerName = (name || this.primaryOwnerInput()).trim();
    if (ownerName && !this.primaryOwners().includes(ownerName)) {
      this.primaryOwners.update(list => [...list, ownerName]);
      this.primaryOwnerInput.set('');
      this.primaryOwnerSearchQuery.set('');
    }
  }

  removePrimaryOwner(name: string): void {
    this.primaryOwners.update(list => list.filter(o => o !== name));
  }

  // Secondary Owners
  addSecondaryOwner(name?: string): void {
    const ownerName = (name || this.secondaryOwnerInput()).trim();
    if (ownerName && !this.secondaryOwners().includes(ownerName)) {
      this.secondaryOwners.update(list => [...list, ownerName]);
      this.secondaryOwnerInput.set('');
      this.secondaryOwnerSearchQuery.set('');
    }
  }

  removeSecondaryOwner(name: string): void {
    this.secondaryOwners.update(list => list.filter(o => o !== name));
  }

  // Tech Stack Tags
  addTechTag(tag?: string): void {
    const tagName = (tag || this.techInput()).trim();
    if (tagName && !this.techStackTags().includes(tagName)) {
      this.techStackTags.update(list => [...list, tagName]);
      this.techInput.set('');
    }
  }

  removeTechTag(tag: string): void {
    this.techStackTags.update(list => list.filter(t => t !== tag));
  }

  private get documentPayload() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const timeStr = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return this.documents()
      .filter(d => d.category !== 'KT')
      .map(d => ({
        name: d.subType ? `${d.subType} — ${d.name}` : d.name,
        category: d.category === 'Functional Doc' ? 'BRD' as const : d.category === 'Other' ? 'Other' as const : 'Architecture' as const,
        url: d.url || 'https://docs.google.com/document/d/1example-doc',
        addedBy: 'Lokesh Kanuboina',
        addedDate: `${dateStr} | ${timeStr}`
      }));
  }

  private get ktSessionPayload() {
    return this.documents()
      .filter(d => d.category === 'KT')
      .map(d => ({ topic: d.name, recordingUrl: d.url || '' }));
  }

  submitProject(): void {
    const name = this.formName().trim();
    if (!name) {
      this.errorMessage.set('Please enter a Project/Module name.');
      return;
    }

    if (this.formIsModule() && !this.formParentProjectName()) {
      this.errorMessage.set('Please select a Parent Project for the sub-module.');
      return;
    }

    this.errorMessage.set(null);

    const editId = this.editingProjectId();
    if (editId) {
      this.projectState.editProject(editId, {
        primaryOwners: this.primaryOwners(),
        secondaryOwners: this.secondaryOwners(),
        projectManager: this.formProjectManager().trim(),
        projectBa: this.formProjectBa().trim(),
        projectTechLead: this.formProjectTechLead().trim(),
        documents: this.documentPayload,
        ktSessions: this.ktSessionPayload
      });

      this.router.navigate(['/temp-project'], {
        queryParams: { updated: name }
      });
      return;
    }

    const key = this.formKey().trim() || name.substring(0, 3).toUpperCase();

    const created = this.projectState.createProject({
      name,
      key,
      client: this.formClient() || 'Internal',
      description: this.formDescription() || 'No description provided.',
      isModule: this.formIsModule(),
      parentProjectName: this.formIsModule() ? this.formParentProjectName() : undefined,
      primaryOwners: this.primaryOwners(),
      secondaryOwners: this.secondaryOwners(),
      repoName: this.formRepoName().trim(),
      projectManager: this.formProjectManager().trim(),
      projectBa: this.formProjectBa().trim(),
      projectTechLead: this.formProjectTechLead().trim(),
      techStack: this.techStackTags(),
      documents: this.documentPayload,
      ktSessions: this.ktSessionPayload
    });

    this.router.navigate(['/temp-project'], {
      queryParams: { created: created.name, type: created.isModule ? 'Module' : 'Project' }
    });
  }
}
