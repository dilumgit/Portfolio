import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <div className="text-8xl font-bold text-transparent bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text">
          404
        </div>
        <h1 className="text-2xl font-semibold text-foreground">Page Not Found</h1>
        <p className="text-muted-foreground max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          ← Back to Portfolio
        </Link>
      </div>
    </div>
  )
}
