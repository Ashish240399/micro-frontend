import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';

const metrics = [
  { label: 'Tasks completed this week', value: '18' },
  { label: 'Average completion time', value: '2.4 days' },
  { label: 'Active projects', value: '5' },
  { label: 'Team utilization', value: '82%' },
];

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to overview
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Performance metrics and trends</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {metrics.map(({ label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
