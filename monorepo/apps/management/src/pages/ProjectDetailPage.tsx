import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import { Badge } from '@repo/ui/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { getProjectById } from '../data/mockProjects';
import type { Project } from '../data/mockProjects';

const statusVariant: Record<Project['status'], 'default' | 'secondary' | 'outline'> = {
  planning: 'outline',
  active: 'default',
  completed: 'secondary',
};

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId ? getProjectById(projectId) : undefined;

  if (!project) {
    return <Navigate to="/management/projects" replace />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/management/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to projects
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{project.name}</CardTitle>
              <Badge variant={statusVariant[project.status]} className="capitalize">
                {project.status}
              </Badge>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/management/projects/${project.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Description</h3>
            <p className="text-foreground leading-relaxed">{project.description}</p>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Project lead</dt>
              <dd className="mt-1 text-foreground">{project.lead}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Timeline</dt>
              <dd className="mt-1 text-foreground">
                {project.startDate} – {project.endDate}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Project ID</dt>
              <dd className="mt-1 font-mono text-sm text-foreground">#{project.id}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
