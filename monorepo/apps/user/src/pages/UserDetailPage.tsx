import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import { Badge } from '@repo/ui/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { PermissionGate } from '@repo/ui/components/rbac/PermissionGate';
import { getUserById } from '../data/mockUsers';

export function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const user = userId ? getUserById(userId) : undefined;

  if (!user) {
    return <Navigate to="/users" replace />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/users">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to users
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex gap-2">
                <Badge variant="outline" className="capitalize">
                  {user.role}
                </Badge>
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                  {user.status}
                </Badge>
              </div>
            </div>
            <PermissionGate requires="users:write">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/users/${user.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </PermissionGate>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Department</dt>
              <dd className="mt-1 text-foreground">{user.department}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Joined</dt>
              <dd className="mt-1 text-foreground">{user.joinedAt}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">User ID</dt>
              <dd className="mt-1 font-mono text-sm text-foreground">#{user.id}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
