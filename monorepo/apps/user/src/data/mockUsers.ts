export type UserRole = 'admin' | 'manager' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  joinedAt: string;
  status: 'active' | 'inactive';
}

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@company.com',
    role: 'admin',
    department: 'Engineering',
    joinedAt: '2024-03-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@company.com',
    role: 'manager',
    department: 'Product',
    joinedAt: '2024-06-01',
    status: 'active',
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@company.com',
    role: 'viewer',
    department: 'Design',
    joinedAt: '2025-01-10',
    status: 'active',
  },
  {
    id: '4',
    name: 'Dave Wilson',
    email: 'dave@company.com',
    role: 'manager',
    department: 'Operations',
    joinedAt: '2023-11-20',
    status: 'inactive',
  },
];

export function getUserById(id: string): User | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}
