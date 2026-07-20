import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RoleService } from '../../../../core/auth/role.service';
import { ProjectStateService } from '../../../../core/projects/project-state.service';

@Component({
  selector: 'oh-atlas-operational-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule],
  templateUrl: './operational-tab.component.html',
  styleUrl: './operational-tab.component.scss'
})
export class OperationalTabComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly projectState = inject(ProjectStateService);
  readonly roleService = inject(RoleService);

  private readonly projectId = toSignal(this.route.parent!.paramMap.pipe(map(p => p.get('id') ?? '')), {
    initialValue: this.route.parent!.snapshot.paramMap.get('id') ?? ''
  });

  readonly project = computed(() => this.projectState.activeProjects().find(p => p.id === this.projectId()));

  readonly activeManagementSub = signal<'docs' | 'kt' | 'demo'>('docs');

  showAddDocForm = false;
  newDocName = '';
  newDocCat: 'BRD' | 'Architecture' | 'User Guide' | 'CTO Review' | 'Other' = 'Other';
  newDocUrl = '';

  showAddKtForm = false;
  newKtTopic = '';
  newKtHost = '';
  newKtDate = '';
  newKtAttendees = '';
  newKtRecordingUrl = '';

  showAddDemoForm = false;
  newDemoTitle = '';
  newDemoDate = '';
  newDemoAudience = '';
  newDemoUrl = '';
  newDemoCtoFeedback = '';

  canUploadTechDoc(): boolean {
    const project = this.project();
    return !!project && this.roleService.canUploadTechDoc(project);
  }

  techDocLockReason(): string {
    if (this.canUploadTechDoc()) return '';
    if (this.roleService.isDeveloper()) return 'Unlocks once this project is marked completed';
    return 'Only a Developer (after completion) or Manager can upload technical documents';
  }

  addDocument(): void {
    const project = this.project();
    if (!project || !this.newDocName.trim() || !this.canUploadTechDoc()) return;

    this.projectState.addDocument(project.id, {
      name: this.newDocName,
      category: this.newDocCat,
      url: this.newDocUrl || 'https://docs.google.com/document/view',
      addedBy: 'Rahul Menon'
    });

    this.newDocName = '';
    this.newDocUrl = '';
    this.showAddDocForm = false;
  }

  addKtSession(): void {
    const project = this.project();
    if (!project || !this.newKtTopic.trim()) return;

    this.projectState.addKtSession(project.id, {
      topic: this.newKtTopic,
      host: this.newKtHost || 'Rahul Menon',
      date: this.newKtDate || new Date().toISOString().split('T')[0],
      attendees: this.newKtAttendees || 'All Engineers',
      recordingUrl: this.newKtRecordingUrl || 'https://loom.com/kt/demo',
      status: 'Scheduled'
    });

    this.newKtTopic = '';
    this.newKtHost = '';
    this.newKtDate = '';
    this.newKtAttendees = '';
    this.newKtRecordingUrl = '';
    this.showAddKtForm = false;
  }

  addDemoLog(): void {
    const project = this.project();
    if (!project || !this.newDemoTitle.trim()) return;

    this.projectState.addDemoLog(project.id, {
      title: this.newDemoTitle,
      date: this.newDemoDate || new Date().toISOString().split('T')[0],
      audience: this.newDemoAudience || 'CTO Review',
      recordingUrl: this.newDemoUrl || 'https://loom.com/demo/view',
      ctoFeedback: this.newDemoCtoFeedback || 'Pending reviews',
      status: 'Pending Review'
    });

    this.newDemoTitle = '';
    this.newDemoDate = '';
    this.newDemoAudience = '';
    this.newDemoUrl = '';
    this.newDemoCtoFeedback = '';
    this.showAddDemoForm = false;
  }
}
