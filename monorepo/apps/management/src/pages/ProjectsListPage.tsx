import { Link } from 'react-router-dom';
import { Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import { Badge } from '@repo/ui/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { MOCK_PROJECTS } from '../data/mockProjects';
import type { Project } from '../data/mockProjects';

const statusVariant: Record<Project['status'], 'default' | 'secondary' | 'outline'> = {
  planning: 'outline',
  active: 'default',
  completed: 'secondary',
};

export function ProjectsListPage() {
  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/management">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to management
        </Link>
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Projects</h1>
          <p className="text-muted-foreground">All active and archived projects</p>
        </div>
        <Button asChild>
          <Link to="/management/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {MOCK_PROJECTS.map((project) => (
          <Card key={project.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-lg">
                  <Link
                    to={`/management/projects/${project.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {project.name}
                  </Link>
                </CardTitle>
                <Badge variant={statusVariant[project.status]} className="capitalize">
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Lead: {project.lead} · {project.startDate} – {project.endDate}
                </span>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/management/projects/${project.id}`}>
                    View project
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
