export type Role = 'manager' | 'ba' | 'developer' | 'tester';

export interface RoleAssignment {
  email: string;
  role: Role;
  // Matches this login to an existing TeamMember.name so project visibility
  // and permissions fall out of real team-membership data instead of a
  // separate hardcoded list. Omitted for 'manager' — managers see everything.
  displayName?: string;
}
