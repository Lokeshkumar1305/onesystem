import { CommonModule } from '@angular/common';
import { Component, computed, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  AllocationLevel,
  BenchedEmployee,
  INITIAL_ACTIVE_RESOURCES,
  INITIAL_BENCH_RESOURCES,
  Resource
} from './resource-allocation.data';

@Component({
  selector: 'oh-resource-allocation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './resource-allocation.component.html',
  styleUrl: './resource-allocation.component.scss'
})
export class ResourceAllocationComponent implements OnDestroy {
  readonly activeResources = signal<Resource[]>(INITIAL_ACTIVE_RESOURCES);
  readonly benchResources = signal<BenchedEmployee[]>(INITIAL_BENCH_RESOURCES);

  // Bench counter
  readonly freeCount = computed(() => this.benchResources().length);

  // Form overlay drawer state
  readonly showForm = signal(false);
  readonly allocatingEmployee = signal<BenchedEmployee | null>(null);

  // Release Confirmation dialog state
  readonly showReleaseConfirm = signal(false);
  readonly resourceToRelease = signal<Resource | null>(null);

  readonly allocationForm: FormGroup;
  readonly allocationOptions = [
    { label: 'None (0%)', value: 0 },
    { label: 'Low (25%)', value: 1 },
    { label: 'Medium (50%)', value: 2 },
    { label: 'High (75%)', value: 3 },
    { label: 'Maximum (100%)', value: 4 }
  ];

  constructor(private readonly fb: FormBuilder) {
    this.allocationForm = this.fb.group({
      role: ['', Validators.required],
      mon: [2, Validators.required],
      tue: [2, Validators.required],
      wed: [2, Validators.required],
      thu: [2, Validators.required],
      fri: [2, Validators.required]
    });
  }

  ngOnDestroy(): void {
    document.body.classList.remove('oh-modal-open');
  }

  openAllocationForm(emp: BenchedEmployee): void {
    this.allocatingEmployee.set(emp);
    
    // Guess role from skills or default
    let guessedRole = 'Developer';
    if (emp.skills.includes('ML') || emp.skills.includes('Python')) {
      guessedRole = 'Data Scientist';
    } else if (emp.skills.includes('React') || emp.skills.includes('Node')) {
      guessedRole = 'Fullstack Developer';
    } else if (emp.skills.includes('Java') || emp.skills.includes('K8s')) {
      guessedRole = 'Backend Developer';
    }

    this.allocationForm.reset({
      role: guessedRole,
      mon: 2,
      tue: 2,
      wed: 2,
      thu: 2,
      fri: 2
    });

    this.showForm.set(true);
    document.body.classList.add('oh-modal-open');
  }

  closeForm(): void {
    this.showForm.set(false);
    this.allocatingEmployee.set(null);
    document.body.classList.remove('oh-modal-open');
  }

  saveAllocation(): void {
    if (this.allocationForm.invalid) {
      this.allocationForm.markAllAsTouched();
      return;
    }

    const emp = this.allocatingEmployee();
    const val = this.allocationForm.getRawValue();

    if (emp) {
      const newResource: Resource = {
        name: emp.name,
        role: val.role,
        initials: emp.initials,
        avatarBgVar: emp.avatarBgVar,
        avatarColorVar: emp.avatarColorVar,
        weeklyLoad: [
          Number(val.mon) as AllocationLevel,
          Number(val.tue) as AllocationLevel,
          Number(val.wed) as AllocationLevel,
          Number(val.thu) as AllocationLevel,
          Number(val.fri) as AllocationLevel
        ]
      };

      // Add to active heatmap
      this.activeResources.update(list => [...list, newResource]);
      // Remove from bench
      this.benchResources.update(list => list.filter(b => b.name !== emp.name));
    }

    this.closeForm();
  }

  releaseResource(res: Resource): void {
    this.resourceToRelease.set(res);
    this.showReleaseConfirm.set(true);
    document.body.classList.add('oh-modal-open');
  }

  cancelRelease(): void {
    this.showReleaseConfirm.set(false);
    this.resourceToRelease.set(null);
    document.body.classList.remove('oh-modal-open');
  }

  confirmRelease(): void {
    const res = this.resourceToRelease();
    if (res) {
      const benched: BenchedEmployee = {
        name: res.name,
        skills: this.getDefaultSkillsFor(res.role),
        benchDays: 0,
        initials: res.initials,
        avatarBgVar: res.avatarBgVar,
        avatarColorVar: res.avatarColorVar
      };

      // Add to bench list
      this.benchResources.update(list => [...list, benched]);
      // Remove from active heatmap
      this.activeResources.update(list => list.filter(r => r.name !== res.name));
    }
    this.cancelRelease();
  }

  getCellClass(level: AllocationLevel): string {
    return `oh-heatmap-cell--level-${level}`;
  }

  getDefaultSkillsFor(role: string): string {
    const r = role.toLowerCase();
    if (r.includes('lead') || r.includes('manager')) {
      return 'Management · Agile · Architecture';
    }
    if (r.includes('backend') || r.includes('java')) {
      return 'Java · Spring · SQL';
    }
    if (r.includes('data') || r.includes('scientist') || r.includes('ml')) {
      return 'Python · Pandas · TensorFlow';
    }
    if (r.includes('fullstack') || r.includes('react')) {
      return 'React · TypeScript · CSS';
    }
    if (r.includes('qa') || r.includes('testing')) {
      return 'Cypress · Selenium · Manual';
    }
    if (r.includes('devops')) {
      return 'Docker · AWS · Terraform';
    }
    return 'HTML · Javascript · CSS';
  }
}
