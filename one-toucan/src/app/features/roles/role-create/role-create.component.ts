import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

import { UsersRolesStateService } from '../../../core/users-roles-state.service';

interface PrivilegeItem {
  id: string;
  name: string;
  subLabel: string;
  selected: boolean;
}

interface PrivilegeSection {
  title: string;
  expanded: boolean;
  items: PrivilegeItem[];
}

@Component({
  selector: 'oh-role-create',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule],
  templateUrl: './role-create.component.html',
  styleUrl: './role-create.component.scss'
})
export class RoleCreateComponent {
  private readonly router = inject(Router);
  private readonly stateService = inject(UsersRolesStateService);

  readonly roleName = signal('');
  readonly description = signal('');

  // Privilege Sections list matching Image 2 structure
  readonly sections = signal<PrivilegeSection[]>([
    {
      title: 'POST COMMUNICATION TEMPLATES',
      expanded: true,
      items: [
        {
          id: 'priv-1',
          name: 'POST /communication/templates/all',
          subLabel: 'COMM_PRIV_POST_COMMUNICATION_TEMPLATES_ALL',
          selected: false
        },
        {
          id: 'priv-2',
          name: 'POST /communication/templates/save',
          subLabel: 'COMM_PRIV_POST_COMMUNICATION_TEMPLATES_SAVE',
          selected: false
        }
      ]
    },
    {
      title: 'POST COMMUNICATION NOTIFICATIONS',
      expanded: true,
      items: [
        {
          id: 'priv-3',
          name: 'POST /communication/notifications/all',
          subLabel: 'COMM_PRIV_POST_COMMUNICATION_NOTIFICATIONS_ALL',
          selected: true
        },
        {
          id: 'priv-4',
          name: 'POST /communication/notifications/delete',
          subLabel: 'COMM_PRIV_POST_COMMUNICATION_NOTIFICATIONS_DELETE',
          selected: true
        },
        {
          id: 'priv-5',
          name: 'POST /communication/notifications/unread',
          subLabel: 'COMM_PRIV_POST_COMMUNICATION_NOTIFICATIONS_UNREAD',
          selected: true
        }
      ]
    },
    {
      title: 'POST COMMUNICATION',
      expanded: true,
      items: [
        {
          id: 'priv-6',
          name: 'POST /communication/send',
          subLabel: 'COMM_PRIV_POST_COMMUNICATION_SEND',
          selected: true
        },
        {
          id: 'priv-7',
          name: 'POST /communication/history',
          subLabel: 'COMM_PRIV_POST_COMMUNICATION_HISTORY',
          selected: false
        }
      ]
    }
  ]);

  // Compute description character length
  readonly charCount = computed(() => this.description().length);

  // Compute total selected privilege count
  readonly totalPrivilegesCount = computed(() => {
    let count = 0;
    this.sections().forEach(sec => {
      sec.items.forEach(item => {
        if (item.selected) count++;
      });
    });
    return count;
  });

  toggleSectionExpand(sectionIndex: number): void {
    this.sections.update(list => {
      const copy = [...list];
      copy[sectionIndex] = {
        ...copy[sectionIndex],
        expanded: !copy[sectionIndex].expanded
      };
      return copy;
    });
  }

  isAllSelected(section: PrivilegeSection): boolean {
    return section.items.every(i => i.selected);
  }

  toggleSelectAll(sectionIndex: number): void {
    this.sections.update(list => {
      const copy = [...list];
      const section = copy[sectionIndex];
      const targetState = !this.isAllSelected(section);
      
      const updatedItems = section.items.map(item => ({
        ...item,
        selected: targetState
      }));

      copy[sectionIndex] = {
        ...section,
        items: updatedItems
      };
      return copy;
    });
  }

  toggleItemSelection(sectionIndex: number, itemIndex: number): void {
    this.sections.update(list => {
      const copy = [...list];
      const section = copy[sectionIndex];
      const items = [...section.items];
      
      items[itemIndex] = {
        ...items[itemIndex],
        selected: !items[itemIndex].selected
      };

      copy[sectionIndex] = {
        ...section,
        items
      };
      return copy;
    });
  }

  goBack(): void {
    this.router.navigate(['/roles']);
  }

  onSubmit(): void {
    if (!this.roleName().trim()) {
      alert('Please fill in a Role Name.');
      return;
    }

    // Collect all selected privilege names
    const selectedPrivs: string[] = [];
    this.sections().forEach(sec => {
      sec.items.forEach(item => {
        if (item.selected) {
          selectedPrivs.push(item.name);
        }
      });
    });

    this.stateService.addRole({
      name: this.roleName().trim().toUpperCase(),
      description: this.description().trim() || 'Custom Administrator Role',
      privilegesCount: this.totalPrivilegesCount(),
      privileges: selectedPrivs
    });

    this.router.navigate(['/roles']);
  }
}
