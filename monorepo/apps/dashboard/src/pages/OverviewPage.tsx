import { Link } from 'react-router-dom';
import { CheckSquare, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';

const stats = [
  { label: 'Open Tasks', value: '12', icon: CheckSquare, href: '/tasks' },
  { label: 'Team Members', value: '24', icon: Users, href: '/users' },
  { label: 'Completion Rate', value: '78%', icon: TrendingUp, href: '/dashboard/analytics' },
];

export function OverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your workspace activity</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <Button variant="link" className="mt-2 h-auto p-0" asChild>
                <Link to={href}>
                  View details
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between border-b border-border pb-3">
              <span>Task &ldquo;Implement task routing&rdquo; updated</span>
              <span className="text-muted-foreground">2h ago</span>
            </li>
            <li className="flex justify-between border-b border-border pb-3">
              <span>New user Bob Smith added</span>
              <span className="text-muted-foreground">1d ago</span>
            </li>
            <li className="flex justify-between">
              <span>Project Alpha milestone completed</span>
              <span className="text-muted-foreground">3d ago</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
