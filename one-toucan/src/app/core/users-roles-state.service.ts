import { Injectable, signal } from '@angular/core';

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  registeredOn: string;
  status: boolean;
}

export interface RoleRecord {
  id: string;
  name: string;
  description: string;
  privilegesCount: number;
  privileges: string[];
}

@Injectable({ providedIn: 'root' })
export class UsersRolesStateService {
  // Shared Users State
  readonly usersList = signal<UserRecord[]>([
    { id: 'USR-001', username: 'ramanayadavalli', email: 'ramana.yadavalli@toucanus.com', role: 'ADMIN', registeredOn: '07 Jul 2026', status: true },
    { id: 'USR-002', username: 'lokeshkumarkanuboina', email: 'lokeshkumarkanuboina@gmail.com', role: 'SUPER_ADMIN', registeredOn: '08 Jul 2026', status: true },
    { id: 'USR-003', username: 'sarthak_sharma', email: 'sarthak.sharma@toucanus.com', role: 'ADMIN', registeredOn: '09 Jul 2026', status: true },
    { id: 'USR-004', username: 'tanmayee_p', email: 'tanmayee.p@toucanus.com', role: 'ADMIN', registeredOn: '10 Jul 2026', status: true },
    { id: 'USR-005', username: 'gowtham_k', email: 'gowtham.k@toucanus.com', role: 'SUPER_ADMIN', registeredOn: '11 Jul 2026', status: true },
    { id: 'USR-006', username: 'priyanka_r', email: 'priyanka.r@toucanus.com', role: 'ADMIN', registeredOn: '12 Jul 2026', status: true },
    { id: 'USR-007', username: 'raju_m', email: 'raju.m@toucanus.com', role: 'ADMIN', registeredOn: '13 Jul 2026', status: true },
    { id: 'USR-008', username: 'sahithya_v', email: 'sahithya.v@toucanus.com', role: 'SUPER_ADMIN', registeredOn: '14 Jul 2026', status: false },
    { id: 'USR-009', username: 'pavan_k', email: 'pavan.k@toucanus.com', role: 'ADMIN', registeredOn: '15 Jul 2026', status: true },
    { id: 'USR-010', username: 'laya_s', email: 'laya.s@toucanus.com', role: 'ADMIN', registeredOn: '16 Jul 2026', status: true },
    { id: 'USR-011', username: 'swathi_t', email: 'swathi.t@toucanus.com', role: 'SUPER_ADMIN', registeredOn: '17 Jul 2026', status: true },
    { id: 'USR-012', username: 'palkin_v', email: 'palkin.v@toucanus.com', role: 'ADMIN', registeredOn: '18 Jul 2026', status: true }
  ]);

  // Shared Roles State
  readonly rolesList = signal<RoleRecord[]>([
    {
      id: 'ROL-001',
      name: 'SUPER_ADMIN',
      description: 'Tenant Super Administrator',
      privilegesCount: 188,
      privileges: ['read:all', 'write:all', 'delete:all', 'manage:users', 'manage:roles', 'configure:tenant', 'view:reports']
    },
    {
      id: 'ROL-002',
      name: 'ADMIN',
      description: 'Tenant Administrator',
      privilegesCount: 120,
      privileges: ['read:all', 'write:all', 'manage:users', 'manage:roles', 'view:reports']
    }
  ]);

  addUser(user: Omit<UserRecord, 'id' | 'registeredOn'>): void {
    const nextId = `USR-${String(this.usersList().length + 1).padStart(3, '0')}`;
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const registeredOn = `${String(today.getDate()).padStart(2, '0')} ${months[today.getMonth()]} ${today.getFullYear()}`;

    const newUser: UserRecord = {
      id: nextId,
      username: user.username,
      email: user.email,
      role: user.role,
      registeredOn,
      status: user.status
    };

    this.usersList.update(list => [...list, newUser]);
  }

  addRole(role: Omit<RoleRecord, 'id'>): void {
    const nextId = `ROL-${String(this.rolesList().length + 1).padStart(3, '0')}`;
    const newRole: RoleRecord = {
      id: nextId,
      name: role.name.toUpperCase(),
      description: role.description,
      privilegesCount: role.privilegesCount,
      privileges: role.privileges
    };

    this.rolesList.update(list => [...list, newRole]);
  }
}
