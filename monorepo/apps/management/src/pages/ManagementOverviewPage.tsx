import { Link } from 'react-router-dom';
import { Briefcase, FolderKanban } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';
import { MOCK_PROJECTS } from '../data/mockProjects';

export function ManagementOverviewPage() {
  const activeCount = MOCK_PROJECTS.filter((p) => p.status === 'active').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Management</h1>
        <p className="text-muted-foreground">Oversee projects and team operations</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Projects
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Projects
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_PROJECTS.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/management/projects">View all projects</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/management/projects/new">Create project</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
