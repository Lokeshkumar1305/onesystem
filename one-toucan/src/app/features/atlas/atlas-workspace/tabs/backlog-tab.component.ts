import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';

import { ActiveProject } from '../../../../core/projects/projects.data';
import { RequirementsPanelComponent } from './backlog/requirements-panel.component';
import { UserStoriesPanelComponent } from './backlog/user-stories-panel.component';
import { TasksPanelComponent } from './backlog/tasks-panel.component';
import { TestCasesPanelComponent } from './backlog/test-cases-panel.component';
import { BugsPanelComponent } from './backlog/bugs-panel.component';

type BacklogSub = 'requirements' | 'stories' | 'tasks' | 'testCases' | 'bugs';

@Component({
  selector: 'oh-atlas-backlog-tab',
  standalone: true,
  imports: [
    CommonModule,
    RequirementsPanelComponent,
    UserStoriesPanelComponent,
    TasksPanelComponent,
    TestCasesPanelComponent,
    BugsPanelComponent
  ],
  templateUrl: './backlog-tab.component.html',
  styleUrl: './backlog-tab.component.scss'
})
export class BacklogTabComponent {
  @Input({ required: true }) project!: ActiveProject;

  readonly activeSub = signal<BacklogSub>('requirements');
}
