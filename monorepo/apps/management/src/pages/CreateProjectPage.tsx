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

export function CreateProjectPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/management/projects/1');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/management/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to projects
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
          <CardDescription>Start a new project for your team</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project name</Label>
              <Input id="name" name="name" placeholder="Project name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Project goals and scope..."
                rows={4}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lead">Project lead</Label>
                <Input id="lead" name="lead" placeholder="Team lead name" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue="planning">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start date</Label>
                <Input id="startDate" name="startDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End date</Label>
                <Input id="endDate" name="endDate" type="date" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" asChild>
                <Link to="/management/projects">Cancel</Link>
              </Button>
              <Button type="submit">Create Project</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
