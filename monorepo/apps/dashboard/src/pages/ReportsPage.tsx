import { Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Badge } from '@repo/ui/components/ui/badge';

const reports = [
  { id: '1', name: 'Weekly Task Summary', type: 'Tasks', generatedAt: '2026-06-20' },
  { id: '2', name: 'User Activity Report', type: 'Users', generatedAt: '2026-06-18' },
  { id: '3', name: 'Project Status Q2', type: 'Projects', generatedAt: '2026-06-15' },
];

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to overview
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports</h1>
        <p className="text-muted-foreground">Download and view generated reports</p>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{report.name}</CardTitle>
                <Badge variant="outline">{report.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Generated {report.generatedAt}
              </span>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
