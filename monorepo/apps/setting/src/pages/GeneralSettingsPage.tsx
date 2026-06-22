import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui/components/ui/card';
import { SettingsNav } from '../components/SettingsNav';

export function GeneralSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      <SettingsNav />

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Application-wide settings and defaults</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appName">Application name</Label>
            <Input id="appName" defaultValue="MicroApp" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" defaultValue="UTC" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input id="language" defaultValue="English" />
          </div>
          <Button>Save changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
