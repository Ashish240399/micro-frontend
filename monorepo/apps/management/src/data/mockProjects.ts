export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed';
  lead: string;
  startDate: string;
  endDate: string;
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Micro-Frontend Platform',
    description: 'Build a scalable micro-frontend architecture with module federation.',
    status: 'active',
    lead: 'Alice Johnson',
    startDate: '2026-01-01',
    endDate: '2026-09-30',
  },
  {
    id: '2',
    name: 'Mobile App Redesign',
    description: 'Redesign the mobile experience with a new design system.',
    status: 'planning',
    lead: 'Bob Smith',
    startDate: '2026-07-01',
    endDate: '2026-12-31',
  },
  {
    id: '3',
    name: 'API Gateway Migration',
    description: 'Migrate legacy APIs to the new gateway infrastructure.',
    status: 'completed',
    lead: 'Carol Davis',
    startDate: '2025-06-01',
    endDate: '2026-03-31',
  },
];

export function getProjectById(id: string): Project | undefined {
  return MOCK_PROJECTS.find((p) => p.id === id);
}
