import { Button } from '@repo/ui/components/ui/button'

// REMOTE MFE — this component is exposed via Module Federation
function App() {
  return (
    <div className="p-6 bg-background text-foreground">
      <h2 className="text-xl font-semibold mb-2">dashboard MFE</h2>
      <p className="text-muted-foreground mb-4">
        This micro-frontend is exposed as <code className="font-mono text-sm">dashboard/App</code>
      </p>
      <Button>Action</Button>
    </div>
  )
}

export default App
