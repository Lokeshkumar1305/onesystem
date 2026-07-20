import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RoleService } from '../../core/auth/role.service';
import { ProjectStateService } from '../../core/projects/project-state.service';
import {
  ActiveProject,
  ProjectProposal,
  TeamMember,
  ResourcePoolMember,
  RESOURCE_POOL
} from '../../core/projects/projects.data';

@Component({
  selector: 'oh-projects',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly projectState = inject(ProjectStateService);
  readonly roleService = inject(RoleService);

  // Navigation & View States
  readonly activeView = signal<'dashboard' | 'proposal-wizard'>('dashboard');

  // Shared project/proposal data — owned by ProjectStateService so both this
  // Project Management screen and the Atlas per-project workspace read the
  // same live list.
  readonly activeProjects = this.projectState.activeProjects;
  readonly proposals = this.projectState.proposals;

  // Filter Active Projects by Project or Module Type
  readonly selectedTypeFilter = signal<'all' | 'project' | 'module'>('all');
  readonly filteredActiveProjects = computed(() => {
    const filter = this.selectedTypeFilter();
    const list = this.activeProjects();
    if (filter === 'all') return list;
    if (filter === 'project') return list.filter(p => !p.isModule);
    return list.filter(p => p.isModule);
  });

  // Selected entities
  readonly selectedProposal = signal<ProjectProposal | null>(null);

  // Wizard state (1 to 6)
  // 1: Ideation, 2: Ideation Approval, 3: BRD, 4: BRD Approval, 5: Project Creation, 6: Team Allocation
  readonly wizardStep = signal<number>(1);
  readonly lastSavedLabel = signal('Just now');

  // Temporary/Input forms states
  // Proposal Wizard Inputs
  propName = '';
  propType: 'project' | 'module' | 'other' = 'project';
  propCustomType = '';
  propParentProjectId = '';
  propDesc = '';

  // Step 1 Ideation inputs
  ideaTitle = '';
  ideaDesc = '';
  ideaValue = '';
  ideaSubmitter = 'Rahul Menon';

  // Step 2 Ideation Approval simulated CTO inputs
  ctoIdeaComment = '';

  // Step 3 BRD inputs
  brdTitle = '';
  brdDesc = '';
  brdDocUrl = 'https://docs.google.com/brd/new-draft';
  brdScope = '';
  brdOutOfScope = '';
  readonly uploadedBrdFile = signal<File | null>(null);

  // Step 4 BRD Approval simulated CTO inputs
  ctoBrdComment = '';

  // Step 5 Creation parameters
  creationKey = '';
  creationClient = 'Razorpay';
  creationBudget = '45,000';
  creationMethodology: 'scrum' | 'kanban' | 'waterfall' = 'scrum';

  // Step 6 Allocation inputs
  allocatedMembers: TeamMember[] = [];
  newAllocName = '';
  newAllocRole = 'Developer';
  newAllocPercent = 100;
  newAllocInitials = '';

  // Step 6 Resource Pool (available vs. already allocated elsewhere)
  resourcePool: ResourcePoolMember[] = RESOURCE_POOL;
  resourceSearch = '';

  // Helper arrays for lookups
  get parentProjects(): ActiveProject[] {
    return this.activeProjects().filter(p => !p.isModule);
  }

  // Navigate into the project's Atlas workspace
  openProject(project: ActiveProject): void {
    this.router.navigate(['/atlas/projects', project.id]);
  }

  goBackToDashboard(): void {
    this.activeView.set('dashboard');
  }

  // Stepper wizards triggers
  startNewProposal(): void {
    if (!this.roleService.canManageProjects()) return;

    this.selectedProposal.set({
      id: 'PROP-' + (this.proposals().length + 101),
      name: '',
      isModule: false,
      description: '',
      stage: 'ideation',
      ideation: { title: '', description: '', valueProps: '', submittedBy: 'Rahul Menon', status: 'Pending', comments: '' },
      brd: { title: '', description: '', documentUrl: '', scope: '', outOfScope: '', status: 'Pending', comments: '' },
      creation: { key: '', client: 'Razorpay', budget: '20,000', methodology: 'scrum' },
      team: []
    });

    this.resetWizardInputs();
    this.wizardStep.set(1);
    this.activeView.set('proposal-wizard');
  }

  openProposalWizard(proposal: ProjectProposal): void {
    this.selectedProposal.set(proposal);
    this.propName = proposal.name;
    this.propType = proposal.isModule ? 'module' : (proposal.customType ? 'other' : 'project');
    this.propCustomType = proposal.customType || '';
    this.propParentProjectId = proposal.parentProjectId || '';
    this.propDesc = proposal.description;

    // Load sub-fields based on current step
    this.ideaTitle = proposal.ideation.title || proposal.name;
    this.ideaDesc = proposal.ideation.description || proposal.description;
    this.ideaValue = proposal.ideation.valueProps;
    this.ideaSubmitter = proposal.ideation.submittedBy;
    this.ctoIdeaComment = proposal.ideation.comments;

    this.brdTitle = proposal.brd.title || (proposal.name ? proposal.name + ' Specs' : '');
    this.brdDesc = proposal.brd.description;
    this.brdDocUrl = proposal.brd.documentUrl || 'https://docs.google.com/brd/draft';
    this.brdScope = proposal.brd.scope;
    this.brdOutOfScope = proposal.brd.outOfScope;
    this.ctoBrdComment = proposal.brd.comments;

    this.creationKey = proposal.creation.key;
    this.creationClient = proposal.creation.client;
    this.creationBudget = proposal.creation.budget;
    this.creationMethodology = proposal.creation.methodology;

    this.allocatedMembers = [...proposal.team];

    // Determine current wizard step based on proposal stage
    switch (proposal.stage) {
      case 'ideation':
        this.wizardStep.set(1);
        break;
      case 'ideation_approval':
        this.wizardStep.set(2);
        break;
      case 'brd':
        this.wizardStep.set(3);
        break;
      case 'brd_approval':
        this.wizardStep.set(4);
        break;
      case 'creation':
        this.wizardStep.set(5);
        break;
      case 'allocation':
        this.wizardStep.set(6);
        break;
      default:
        this.wizardStep.set(1);
        break;
    }

    this.activeView.set('proposal-wizard');
  }

  // Stepper Step 1: Submit Ideation
  submitIdeation(): void {
    const proposal = this.selectedProposal();
    if (!proposal) return;

    proposal.name = this.ideaTitle;
    proposal.description = this.ideaDesc;
    proposal.ideation = {
      title: this.ideaTitle,
      description: this.ideaDesc,
      valueProps: this.ideaValue,
      submittedBy: this.ideaSubmitter,
      status: 'Pending',
      comments: ''
    };
    proposal.stage = 'ideation_approval';
    this.projectState.saveProposal(proposal);
    this.wizardStep.set(2);
  }

  // Stepper Step 2: CTO Approves/Rejects Ideation (simulated)
  ctoApproveIdeation(approved: boolean): void {
    const proposal = this.selectedProposal();
    if (!proposal) return;

    proposal.ideation.status = approved ? 'Approved' : 'Rejected';
    proposal.ideation.comments = this.ctoIdeaComment;

    if (approved) {
      proposal.stage = 'brd';
      this.brdTitle = proposal.name + ' BRD';
      this.wizardStep.set(3);
    } else {
      alert(`Proposal "${proposal.name}" rejected by CTO.`);
      this.activeView.set('dashboard');
    }
    this.projectState.saveProposal(proposal);
  }

  // Stepper Step 3: Submit BRD
  submitBrd(): void {
    const proposal = this.selectedProposal();
    if (!proposal) return;

    proposal.brd = {
      title: this.brdTitle,
      description: this.brdDesc,
      documentUrl: this.brdDocUrl,
      scope: this.brdScope,
      outOfScope: this.brdOutOfScope,
      status: 'Pending',
      comments: ''
    };
    proposal.stage = 'brd_approval';
    this.projectState.saveProposal(proposal);
    this.wizardStep.set(4);
  }

  onBrdFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const fileList = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      this.uploadedBrdFile.set(file);
      this.brdDocUrl = `file:///${file.name}`;
    }
  }

  // Stepper Step 4: CTO Approves/Rejects BRD
  ctoApproveBrd(approved: boolean): void {
    const proposal = this.selectedProposal();
    if (!proposal) return;

    proposal.brd.status = approved ? 'Approved' : 'Rejected';
    proposal.brd.comments = this.ctoBrdComment;

    if (approved) {
      proposal.stage = 'creation';
      // Auto-suggest key
      if (!this.creationKey) {
        this.creationKey = proposal.name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 3);
      }
      this.wizardStep.set(5);
    } else {
      alert(`BRD rejected by CTO. Feedback: ${this.ctoBrdComment}`);
      this.activeView.set('dashboard');
    }
    this.projectState.saveProposal(proposal);
  }

  // Stepper Step 5: Save Project Definition
  saveProjectDefinition(): void {
    const proposal = this.selectedProposal();
    if (!proposal) return;

    proposal.isModule = this.propType === 'module';
    proposal.customType = this.propType === 'other' ? this.propCustomType.trim() : undefined;
    proposal.parentProjectId = this.propParentProjectId;
    proposal.creation = {
      key: this.creationKey,
      client: this.creationClient,
      budget: this.creationBudget,
      methodology: this.creationMethodology
    };
    proposal.stage = 'allocation';
    this.projectState.saveProposal(proposal);
    this.wizardStep.set(6);
  }

  // Stepper Step 6: Team Allocation and Finalize
  addAllocatedMember(): void {
    if (!this.newAllocName.trim()) return;

    const parts = this.newAllocName.split(' ').filter(Boolean);
    const initials = parts.length > 0
      ? (parts[0][0] + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase()
      : '??';

    const colors = ['blue', 'purple', 'pink', 'teal'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    this.allocatedMembers.push({
      initials,
      name: this.newAllocName,
      role: this.newAllocRole,
      allocation: this.newAllocPercent,
      avatarColor: color
    });

    this.newAllocName = '';
  }

  removeAllocatedMember(member: TeamMember): void {
    this.allocatedMembers = this.allocatedMembers.filter(m => m.name !== member.name);
  }

  totalAllocationPercent(): number {
    return this.allocatedMembers.reduce((sum, m) => sum + m.allocation, 0);
  }

  uniqueRolesCount(): number {
    return new Set(this.allocatedMembers.map(m => m.role)).size;
  }

  // Step 6: Resource Pool — available vs. already-allocated-elsewhere
  get availableResources(): ResourcePoolMember[] {
    return this.filterResourcePool(this.resourcePool.filter(r => r.status === 'available'));
  }

  get busyResources(): ResourcePoolMember[] {
    return this.filterResourcePool(this.resourcePool.filter(r => r.status === 'allocated'));
  }

  private filterResourcePool(list: ResourcePoolMember[]): ResourcePoolMember[] {
    const term = this.resourceSearch.trim().toLowerCase();
    if (!term) return list;
    return list.filter(r =>
      r.name.toLowerCase().includes(term) ||
      r.role.toLowerCase().includes(term) ||
      r.skills.some(s => s.toLowerCase().includes(term))
    );
  }

  isResourceAssigned(member: ResourcePoolMember): boolean {
    return this.allocatedMembers.some(m => m.name === member.name);
  }

  assignResourceFromPool(member: ResourcePoolMember): void {
    if (this.isResourceAssigned(member)) return;

    this.allocatedMembers.push({
      initials: member.initials,
      name: member.name,
      role: member.role,
      allocation: this.newAllocPercent,
      avatarColor: member.avatarColor
    });
  }

  launchProject(): void {
    const proposal = this.selectedProposal();
    if (!proposal) return;

    const newProj = this.projectState.launchProject(
      proposal,
      { key: this.creationKey, client: this.creationClient },
      this.allocatedMembers
    );

    this.selectedProposal.set(null);
    alert(`Successfully launched ${proposal.isModule ? 'Module' : (proposal.customType || 'Project')} "${newProj.name}"!`);

    // Redirect straight into the newly created project's Atlas workspace.
    this.router.navigate(['/atlas/projects', newProj.id]);
  }

  // Cancel flow
  cancelWizard(): void {
    this.activeView.set('dashboard');
    this.selectedProposal.set(null);
  }

  private resetWizardInputs(): void {
    this.propName = '';
    this.propType = 'project';
    this.propCustomType = '';
    this.propParentProjectId = '';
    this.propDesc = '';

    this.ideaTitle = '';
    this.ideaDesc = '';
    this.ideaValue = '';
    this.ideaSubmitter = 'Rahul Menon';
    this.ctoIdeaComment = '';

    this.brdTitle = '';
    this.brdDesc = '';
    this.brdDocUrl = 'https://docs.google.com/brd/new-draft';
    this.brdScope = '';
    this.brdOutOfScope = '';
    this.uploadedBrdFile.set(null);
    this.ctoBrdComment = '';

    this.creationKey = '';
    this.creationClient = 'Razorpay';
    this.creationBudget = '45,000';
    this.creationMethodology = 'scrum';

    this.allocatedMembers = [];
    this.newAllocName = '';
    this.newAllocRole = 'Developer';
    this.newAllocPercent = 100;
  }

  // Utilities
  getStageStep(stage: string): number {
    switch (stage) {
      case 'ideation': return 1;
      case 'ideation_approval': return 2;
      case 'brd': return 3;
      case 'brd_approval': return 4;
      case 'creation': return 5;
      case 'allocation': return 6;
      case 'completed': return 7;
      default: return 1;
    }
  }

  getAvatarClass(color: string): string {
    return `oh-avatar-circle--${color}`;
  }

  ngOnDestroy(): void {
    document.body.classList.remove('oh-modal-open');
  }
}
