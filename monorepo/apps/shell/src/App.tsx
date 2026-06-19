import { Button } from '@repo/ui/components/ui/button'

// HOST APP — lazy load remote MFEs here
// const AuthApp = lazy(() => import('auth/App'))
// const DashboardApp = lazy(() => import('dashboard/App'))

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold">shell — Shell</h1>
      </header>
      <main className="p-6">
        <p className="text-muted-foreground mb-4">
          This is the host shell. Add remote MFEs in vite.config.ts and import them here.
        </p>
        <Button>Get Started</Button>
      </main>
    </div>
  )
}

export default App
