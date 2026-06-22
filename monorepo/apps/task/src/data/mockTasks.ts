export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  createdAt: string;
}

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design dashboard wireframes',
    description: 'Create low-fidelity wireframes for the main dashboard layout and navigation.',
    status: 'done',
    priority: 'high',
    assignee: 'Alice Johnson',
    dueDate: '2026-06-10',
    createdAt: '2026-06-01',
  },
  {
    id: '2',
    title: 'Implement task routing',
    description: 'Add nested routes for task list, create, detail, and edit pages in the task MFE.',
    status: 'in_progress',
    priority: 'high',
    assignee: 'Bob Smith',
    dueDate: '2026-06-22',
    createdAt: '2026-06-15',
  },
  {
    id: '3',
    title: 'Write API integration tests',
    description: 'Cover CRUD endpoints for tasks and users with integration test suite.',
    status: 'todo',
    priority: 'medium',
    assignee: 'Carol Davis',
    dueDate: '2026-06-28',
    createdAt: '2026-06-18',
  },
  {
    id: '4',
    title: 'Update documentation',
    description: 'Document micro-frontend routing patterns and deployment steps.',
    status: 'todo',
    priority: 'low',
    assignee: 'Dave Wilson',
    dueDate: '2026-07-05',
    createdAt: '2026-06-20',
  },
];

export function getTaskById(id: string): Task | undefined {
  return MOCK_TASKS.find((t) => t.id === id);
}
