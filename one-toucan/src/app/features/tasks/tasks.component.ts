import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { INITIAL_TASKS, Task, TaskPriority, TaskStatus } from './tasks.data';

@Component({
  selector: 'oh-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatTableModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {
  readonly allTasks = signal<Task[]>(INITIAL_TASKS);

  readonly tabs = ['All', 'Assigned to me', 'Watching'];
  readonly columns = ['select', 'task', 'project', 'status', 'priority', 'due'];
  readonly pageSizeOptions = [10, 25, 50];

  readonly activeTab = signal<string>('All');
  searchQuery = '';
  private readonly searchSignal = signal('');
  readonly sortBy = signal<'due' | 'priority' | 'project'>('due');

  readonly pageSize = signal(10);
  readonly pageIndex = signal(0);

  // Dynamic KPIs (only active/uncompleted items count towards active metrics)
  readonly dueTodayCount = computed(() =>
    this.allTasks().filter(t => t.due === 'Today' && !t.completed).length
  );
  readonly inProgressCount = computed(() =>
    this.allTasks().filter(t => t.status === 'In Progress' && !t.completed).length
  );
  readonly openCount = computed(() =>
    this.allTasks().filter(t => t.status === 'Open' && !t.completed).length
  );
  readonly loggedHours = signal('32h');

  // Tab Count for 'All'
  readonly allCount = computed(() => this.allTasks().length);

  // Filtered tasks by Tab and Search Query
  readonly filtered = computed(() => {
    const tab = this.activeTab();
    const q = this.searchSignal().trim().toLowerCase();
    let list = this.allTasks();

    // 1. Tab Filter
    if (tab === 'Assigned to me') {
      list = list.filter(t => t.assignedToMe);
    } else if (tab === 'Watching') {
      list = list.filter(t => t.watching);
    }

    // 2. Search Filter
    if (q) {
      list = list.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.project.toLowerCase().includes(q) ||
          t.status.toLowerCase().includes(q) ||
          t.priority.toLowerCase().includes(q) ||
          t.due.toLowerCase().includes(q)
      );
    }

    return list;
  });

  // Sorted tasks
  readonly sorted = computed(() => {
    const list = [...this.filtered()];
    const sort = this.sortBy();

    if (sort === 'due') {
      const dueOrder: Record<string, number> = { Today: 0, Tomorrow: 1, Thu: 2, Fri: 3, Mon: 4 };
      return list.sort((a, b) => (dueOrder[a.due] ?? 99) - (dueOrder[b.due] ?? 99));
    } else if (sort === 'priority') {
      const prioOrder: Record<string, number> = { High: 0, Med: 1, Low: 2 };
      return list.sort((a, b) => (prioOrder[a.priority] ?? 99) - (prioOrder[b.priority] ?? 99));
    } else if (sort === 'project') {
      return list.sort((a, b) => a.project.localeCompare(b.project));
    }
    return list;
  });

  readonly totalCount = computed(() => this.sorted().length);
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.totalCount() / this.pageSize())));

  readonly pageRows = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.sorted().slice(start, start + this.pageSize());
  });

  readonly rangeStart = computed(() => (this.totalCount() ? this.pageIndex() * this.pageSize() + 1 : 0));
  readonly rangeEnd = computed(() => Math.min(this.rangeStart() + this.pageSize() - 1, this.totalCount()));

  private static readonly MAX_VISIBLE_PAGES = 4;

  readonly pageNumbers = computed(() => {
    const visible = Math.min(this.pageCount(), TasksComponent.MAX_VISIBLE_PAGES);
    return Array.from({ length: visible }, (_, i) => i + 1);
  });

  readonly hasMorePages = computed(() => this.pageCount() > TasksComponent.MAX_VISIBLE_PAGES);

  onSearchChange(value: string): void {
    this.searchQuery = value;
    this.searchSignal.set(value);
    this.pageIndex.set(0);
  }

  selectTab(tab: string): void {
    this.activeTab.set(tab);
    this.pageIndex.set(0);
  }

  setPageSize(size: string): void {
    this.pageSize.set(Number(size));
    this.pageIndex.set(0);
  }

  setSortBy(sort: 'due' | 'priority' | 'project'): void {
    this.sortBy.set(sort);
    this.pageIndex.set(0);
  }

  goToPage(page: number): void {
    this.pageIndex.set(page - 1);
  }

  prevPage(): void {
    this.pageIndex.update(i => Math.max(0, i - 1));
  }

  nextPage(): void {
    this.pageIndex.update(i => Math.min(this.pageCount() - 1, i + 1));
  }

  toggleTaskCompleted(task: Task): void {
    this.allTasks.update(list =>
      list.map(t => (t.id === task.id ? { ...t, completed: !t.completed } : t))
    );
  }

  statusBadgeClass(status: TaskStatus): string {
    switch (status) {
      case 'In Progress':
        return 'oh-badge--success';
      case 'In Review':
        return 'oh-badge--warning';
      case 'Open':
        return 'oh-badge--info';
      case 'Backlog':
        return 'oh-badge--neutral';
      case 'Done':
        return 'oh-badge--success oh-badge--outline';
      default:
        return 'oh-badge--neutral';
    }
  }

  priorityDotClass(priority: TaskPriority): string {
    switch (priority) {
      case 'High':
        return 'oh-priority-dot--high';
      case 'Med':
        return 'oh-priority-dot--med';
      case 'Low':
        return 'oh-priority-dot--low';
      default:
        return '';
    }
  }

  dueTextClass(due: string): string {
    if (due === 'Today') {
      return 'oh-due-text--today font-weight-bold';
    }
    if (due === 'Tomorrow') {
      return 'oh-due-text--tomorrow font-weight-bold';
    }
    return 'text-muted';
  }
}
