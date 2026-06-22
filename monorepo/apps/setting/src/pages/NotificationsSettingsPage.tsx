import { Button } from '@repo/ui/components/ui/button';
import { Label } from '@repo/ui/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui/components/ui/card';
import { SettingsNav } from '../components/SettingsNav';

const notificationOptions = [
  { id: 'task-updates', label: 'Task updates', description: 'Get notified when tasks are assigned or updated' },
  { id: 'user-activity', label: 'User activity', description: 'Alerts for new users and role changes' },
  { id: 'weekly-digest', label: 'Weekly digest', description: 'Summary of activity sent every Monday' },
];

export function NotificationsSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure notification preferences</p>
      </div>

      <SettingsNav />

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what you want to be notified about</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationOptions.map(({ id, label, description }) => (
            <div key={id} className="flex items-start justify-between gap-4">
              <div>
                <Label htmlFor={id} className="text-base font-medium">
                  {label}
                </Label>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <input
                id={id}
                type="checkbox"
                defaultChecked
                className="mt-1 h-4 w-4 rounded border-border"
              />
            </div>
          ))}
          <Button>Save preferences</Button>
        </CardContent>
      </Card>
    </div>
  );
}
