import { Link } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import { Badge } from '@repo/ui/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { PermissionGate } from '@repo/ui/components/rbac/PermissionGate';
import { MOCK_TASKS } from '../data/mockTasks';
import type { TaskPriority, TaskStatus } from '../data/mockTasks';

const statusVariant: Record<TaskStatus, 'default' | 'secondary' | 'outline'> = {
  todo: 'outline',
  in_progress: 'secondary',
  done: 'default',
};

const priorityVariant: Record<TaskPriority, 'default' | 'secondary' | 'destructive'> = {
  low: 'secondary',
  medium: 'default',
  high: 'destructive',
};

function formatLabel(value: string) {
  return value.replace(/_/g, ' ');
}

export function TaskListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Tasks</h1>
          <p className="text-muted-foreground">Manage and track all team tasks</p>
        </div>
        <PermissionGate requires="tasks:write">
          <Button asChild>
            <Link to="/tasks/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Link>
          </Button>
        </PermissionGate>
      </div>

      <div className="grid gap-4">
        {MOCK_TASKS.map((task) => (
          <Card key={task.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-lg">
                  <Link
                    to={`/tasks/${task.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {task.title}
                  </Link>
                </CardTitle>
                <div className="flex shrink-0 gap-2">
                  <Badge variant={statusVariant[task.status]}>
                    {formatLabel(task.status)}
                  </Badge>
                  <Badge variant={priorityVariant[task.priority]}>
                    {task.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {task.assignee} · Due {task.dueDate}
                </span>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/tasks/${task.id}`}>
                    View details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
