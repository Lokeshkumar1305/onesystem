import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

import { DepartmentNode, DepartmentTreeRow } from './organization.data';

// Structural contract for whatever hosts the tree (OrganizationComponent) —
// kept as an interface, not a direct class import, to avoid a circular
// dependency between the host and this recursive node component.
export interface DepartmentTreeHost {
  childrenOf(parentId: string | undefined): DepartmentTreeRow[];
  onSiblingDrop(event: CdkDragDrop<DepartmentTreeRow[]>, parentId: string | undefined): void;
  editDepartment(dept: DepartmentNode): void;
  removeDepartment(dept: DepartmentNode): void;
  addSubDepartment(dept: DepartmentNode): void;
}

@Component({
  selector: 'oh-department-tree-node',
  standalone: true,
  imports: [CommonModule, DragDropModule, DepartmentTreeNodeComponent],
  templateUrl: './organization-tree-node.component.html',
  styleUrl: './organization-tree-node.component.scss'
})
export class DepartmentTreeNodeComponent {
  @Input({ required: true }) dept!: DepartmentTreeRow;
  @Input({ required: true }) host!: DepartmentTreeHost;

  childrenOf(parentId: string): DepartmentTreeRow[] {
    return this.host.childrenOf(parentId);
  }
}
