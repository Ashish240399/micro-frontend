import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Textarea } from '@repo/ui/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui/components/ui/card';

export function CreateTaskPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/tasks/2');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/tasks">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to tasks
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create Task</CardTitle>
          <CardDescription>Add a new task to the team backlog</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Task title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the task..."
                rows={4}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Input id="assignee" name="assignee" placeholder="Team member name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due date</Label>
                <Input id="dueDate" name="dueDate" type="date" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue="todo">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To do</SelectItem>
                    <SelectItem value="in_progress">In progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" asChild>
                <Link to="/tasks">Cancel</Link>
              </Button>
              <Button type="submit">Create Task</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
