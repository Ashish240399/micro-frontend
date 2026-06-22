import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui/components/ui/card';
import { SettingsNav } from '../components/SettingsNav';

export function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage security and authentication</p>
      </div>

      <SettingsNav />

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Password and session settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input id="currentPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <Input id="newPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input id="confirmPassword" type="password" />
          </div>
          <Button>Change password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
