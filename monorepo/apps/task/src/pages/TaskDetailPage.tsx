import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import { Badge } from '@repo/ui/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { PermissionGate } from '@repo/ui/components/rbac/PermissionGate';
import { getTaskById } from '../data/mockTasks';
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

export function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const task = taskId ? getTaskById(taskId) : undefined;

  if (!task) {
    return <Navigate to="/tasks" replace />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/tasks">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to tasks
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{task.title}</CardTitle>
              <div className="flex gap-2">
                <Badge variant={statusVariant[task.status]}>
                  {formatLabel(task.status)}
                </Badge>
                <Badge variant={priorityVariant[task.priority]}>
                  {task.priority} priority
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <PermissionGate requires="tasks:write">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/tasks/${task.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              </PermissionGate>
              <PermissionGate requires="tasks:delete">
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </PermissionGate>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Description</h3>
            <p className="text-foreground leading-relaxed">{task.description}</p>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Assignee</dt>
              <dd className="mt-1 text-foreground">{task.assignee}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Due date</dt>
              <dd className="mt-1 text-foreground">{task.dueDate}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Created</dt>
              <dd className="mt-1 text-foreground">{task.createdAt}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Task ID</dt>
              <dd className="mt-1 font-mono text-sm text-foreground">#{task.id}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
