import { Link } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import { Badge } from '@repo/ui/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { PermissionGate } from '@repo/ui/components/rbac/PermissionGate';
import { MOCK_USERS } from '../data/mockUsers';

export function UserListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Users</h1>
          <p className="text-muted-foreground">Manage team members and their roles</p>
        </div>
        <PermissionGate requires="users:write">
          <Button asChild>
            <Link to="/users/new">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Link>
          </Button>
        </PermissionGate>
      </div>

      <div className="grid gap-4">
        {MOCK_USERS.map((user) => (
          <Card key={user.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">
                    <Link
                      to={`/users/${user.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {user.name}
                    </Link>
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {user.department} · Joined {user.joinedAt}
                </span>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/users/${user.id}`}>
                    View profile
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
