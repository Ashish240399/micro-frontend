import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
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
import { getProjectById } from '../data/mockProjects';

export function EditProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const project = projectId ? getProjectById(projectId) : undefined;

  if (!project) {
    return <Navigate to="/management/projects" replace />;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/management/projects/${project.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to={`/management/projects/${project.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to project
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
          <CardDescription>Update project &ldquo;{project.name}&rdquo;</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project name</Label>
              <Input id="name" name="name" defaultValue={project.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={project.description}
                rows={4}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lead">Project lead</Label>
                <Input id="lead" name="lead" defaultValue={project.lead} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue={project.status}>
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
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" asChild>
                <Link to={`/management/projects/${project.id}`}>Cancel</Link>
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
