import { Injectable, computed, inject, signal } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { RoleService } from '../auth/role.service';
import {
  ActiveProject,
  AtlasBug,
  AtlasRequirement,
  AtlasTask,
  AtlasTestCase,
  AtlasUserStory,
  DemoItem,
  DocumentItem,
  KtSession,
  ProjectCard,
  ProjectProposal,
  TeamMember,
  TestCaseFolder,
  INITIAL_ACTIVE_PROJECTS,
  INITIAL_PROPOSALS
} from './projects.data';

// Single source of truth for active projects & proposals — shared by the
// Project Management wizard/dashboard and the Atlas per-project workspace,
// so a project created in one place is immediately visible in the other.
@Injectable({ providedIn: 'root' })
export class ProjectStateService {
  private readonly roleService = inject(RoleService);

  private readonly activeProjectsSignal = signal<ActiveProject[]>(INITIAL_ACTIVE_PROJECTS);
  private readonly proposalsSignal = signal<ProjectProposal[]>(INITIAL_PROPOSALS);

  readonly activeProjects = this.activeProjectsSignal.asReadonly();
  readonly proposals = this.proposalsSignal.asReadonly();

  // Managers see every project; everyone else only sees projects where their
  // mapped display name appears on the team — reusing real team-membership
  // data instead of a separate hardcoded visibility list.
  readonly visibleProjects = computed<ActiveProject[]>(() => {
    const all = this.activeProjectsSignal();
    if (this.roleService.isManager()) {
      return all;
    }
    const name = this.roleService.currentUserDisplayName();
    if (!name) {
      return [];
    }
    return all.filter(p => p.team.some(m => m.name === name));
  });

  getProject(id: string): ActiveProject | undefined {
    return this.activeProjectsSignal().find(p => p.id === id);
  }

  saveProposal(proposal: ProjectProposal): void {
    this.proposalsSignal.update(list => {
      const idx = list.findIndex(p => p.id === proposal.id);
      if (idx !== -1) {
        const next = [...list];
        next[idx] = { ...proposal };
        return next;
      }
      return [...list, proposal];
    });
  }

  removeProposal(proposalId: string): void {
    this.proposalsSignal.update(list => list.filter(p => p.id !== proposalId));
  }

  // Builds and stores the new ActiveProject from a finalized wizard proposal,
  // returning it so the caller can navigate to its Atlas workspace.
  launchProject(
    proposal: ProjectProposal,
    creation: { key: string; client: string },
    allocatedMembers: TeamMember[]
  ): ActiveProject {
    let parentName = '';
    if (proposal.isModule && proposal.parentProjectId) {
      const parentObj = this.activeProjectsSignal().find(p => p.id === proposal.parentProjectId);
      parentName = parentObj ? parentObj.name : '';
    }

    const newProj: ActiveProject = {
      id: 'PRJ-' + (this.activeProjectsSignal().length + 101),
      name: proposal.name,
      key: creation.key || 'NEW',
      client: creation.client,
      description: proposal.description || 'No description provided.',
      isModule: proposal.isModule,
      customType: proposal.customType,
      parentProjectName: parentName || undefined,
      status: 'active',
      board: [
        { id: 'backlog', name: 'Backlog', bulletColor: '#6b7280', cards: [] },
        { id: 'in-progress', name: 'In Progress', bulletColor: '#2563eb', cards: [] },
        { id: 'in-review', name: 'In Review', bulletColor: '#d97706', cards: [] },
        { id: 'done', name: 'Done', bulletColor: '#16a34a', cards: [] }
      ],
      team: [...allocatedMembers],
      documents: [
        {
          id: 'DOC-101',
          name: 'Approved BRD Specification',
          category: 'BRD',
          url: proposal.brd.documentUrl || 'https://docs.google.com/brd',
          addedBy: 'CTO Approval Flow',
          addedDate: new Date().toISOString().split('T')[0]
        }
      ],
      ktSessions: [],
      demos: [],
      requirements: [],
      userStories: [],
      tasks: [],
      testCaseFolders: [],
      testCases: [],
      bugs: []
    };

    this.activeProjectsSignal.update(list => [...list, newProj]);
    this.removeProposal(proposal.id);

    return newProj;
  }

  markCompleted(projectId: string): void {
    this.updateProject(projectId, p => ({ ...p, status: 'completed' }));
  }

  onCardDrop(projectId: string, event: CdkDragDrop<ProjectCard[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    // The cdkDropList data arrays are references into the project's own board
    // columns, so re-emitting the (already-mutated) project is enough to
    // notify subscribers.
    this.updateProject(projectId, p => ({ ...p }));
  }

  addFeatureCard(projectId: string, card: Omit<ProjectCard, 'id'>): void {
    const project = this.getProject(projectId);
    if (!project) return;

    const randNum = Math.floor(Math.random() * 90) + 100;
    const newCard: ProjectCard = { id: `${project.key}-${randNum}`, ...card };

    this.updateProject(projectId, p => ({
      ...p,
      board: p.board.map(col => (col.id === 'backlog' ? { ...col, cards: [newCard, ...col.cards] } : col))
    }));
  }

  addRequirement(projectId: string, item: Omit<AtlasRequirement, 'id'>): void {
    const project = this.getProject(projectId);
    if (!project) return;

    const count = project.requirements.length + 1;
    const newItem: AtlasRequirement = { id: `REQ-${project.key}-${count}`, ...item };
    this.updateProject(projectId, p => ({ ...p, requirements: [...p.requirements, newItem] }));
  }

  addUserStory(projectId: string, item: Omit<AtlasUserStory, 'id'>): void {
    const project = this.getProject(projectId);
    if (!project) return;

    const count = project.userStories.length + 1;
    const newItem: AtlasUserStory = { id: `US-${project.key}-${count}`, ...item };
    this.updateProject(projectId, p => ({ ...p, userStories: [...p.userStories, newItem] }));
  }

  addTask(projectId: string, item: Omit<AtlasTask, 'id'>): void {
    const project = this.getProject(projectId);
    if (!project) return;

    const count = project.tasks.length + 1;
    const newItem: AtlasTask = { id: `TSK-${project.key}-${count}`, ...item };
    this.updateProject(projectId, p => ({ ...p, tasks: [...p.tasks, newItem] }));
  }

  addTestCase(projectId: string, item: Omit<AtlasTestCase, 'id'>): void {
    const project = this.getProject(projectId);
    if (!project) return;

    const count = project.testCases.length + 1;
    const newItem: AtlasTestCase = { id: `TC-${project.key}-${count}`, ...item };
    this.updateProject(projectId, p => ({ ...p, testCases: [...p.testCases, newItem] }));
  }

  setTestCaseStatus(projectId: string, testCaseId: string, status: AtlasTestCase['status']): void {
    this.updateProject(projectId, p => ({
      ...p,
      testCases: p.testCases.map(tc => (tc.id === testCaseId ? { ...tc, status } : tc))
    }));
  }

  moveTestCase(projectId: string, testCaseId: string, folderId: string | null): void {
    this.updateProject(projectId, p => ({
      ...p,
      testCases: p.testCases.map(tc => (tc.id === testCaseId ? { ...tc, folderId } : tc))
    }));
  }

  addTestCaseFolder(projectId: string, name: string, parentId: string | null): void {
    const project = this.getProject(projectId);
    if (!project || !name.trim()) return;

    const newFolder: TestCaseFolder = {
      id: `TCF-${project.key}-${project.testCaseFolders.length + 1}-${Date.now().toString(36)}`,
      name: name.trim(),
      parentId
    };
    this.updateProject(projectId, p => ({ ...p, testCaseFolders: [...p.testCaseFolders, newFolder] }));
  }

  renameTestCaseFolder(projectId: string, folderId: string, name: string): void {
    if (!name.trim()) return;
    this.updateProject(projectId, p => ({
      ...p,
      testCaseFolders: p.testCaseFolders.map(f => (f.id === folderId ? { ...f, name: name.trim() } : f))
    }));
  }

  // Non-destructive: reparents child folders and test cases up to the
  // deleted folder's own parent instead of cascading the delete.
  deleteTestCaseFolder(projectId: string, folderId: string): void {
    const project = this.getProject(projectId);
    const folder = project?.testCaseFolders.find(f => f.id === folderId);
    if (!project || !folder) return;

    const parentId = folder.parentId;
    this.updateProject(projectId, p => ({
      ...p,
      testCaseFolders: p.testCaseFolders
        .filter(f => f.id !== folderId)
        .map(f => (f.parentId === folderId ? { ...f, parentId } : f)),
      testCases: p.testCases.map(tc => (tc.folderId === folderId ? { ...tc, folderId: parentId } : tc))
    }));
  }

  addBug(projectId: string, item: Omit<AtlasBug, 'id'>): void {
    const project = this.getProject(projectId);
    if (!project) return;

    const count = project.bugs.length + 1;
    const newItem: AtlasBug = { id: `BUG-${project.key}-${count}`, ...item };
    this.updateProject(projectId, p => ({ ...p, bugs: [...p.bugs, newItem] }));
  }

  addDocument(projectId: string, item: Omit<DocumentItem, 'id' | 'addedDate'>): void {
    const project = this.getProject(projectId);
    if (!project) return;

    const newItem: DocumentItem = {
      id: 'DOC-' + (project.documents.length + 201),
      addedDate: new Date().toISOString().split('T')[0],
      ...item
    };
    this.updateProject(projectId, p => ({ ...p, documents: [...p.documents, newItem] }));
  }

  addKtSession(projectId: string, item: Omit<KtSession, 'id'>): void {
    const project = this.getProject(projectId);
    if (!project) return;

    const newItem: KtSession = { id: 'KT-' + (project.ktSessions.length + 201), ...item };
    this.updateProject(projectId, p => ({ ...p, ktSessions: [...p.ktSessions, newItem] }));
  }

  addDemoLog(projectId: string, item: Omit<DemoItem, 'id'>): void {
    const project = this.getProject(projectId);
    if (!project) return;

    const newItem: DemoItem = { id: 'DEM-' + (project.demos.length + 201), ...item };
    this.updateProject(projectId, p => ({ ...p, demos: [...p.demos, newItem] }));
  }

  private updateProject(projectId: string, updater: (project: ActiveProject) => ActiveProject): void {
    this.activeProjectsSignal.update(list => list.map(p => (p.id === projectId ? updater(p) : p)));
  }
}
