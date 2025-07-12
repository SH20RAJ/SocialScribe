export const runtime = 'edge';
import PollinationsDemo from "@/components/PollinationsDemo"

export default function PollinationsDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                🌸
              </div>
              <span className="text-xl font-semibold text-foreground">
                Pollinations AI Demo
              </span>
            </a>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              ← Back to SocialScribe
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <PollinationsDemo />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
              <span>Powered by</span>
              <a 
                href="https://pollinations.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:underline"
              >
                Pollinations AI
              </a>
              <span>•</span>
              <span>Free & Open Source</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This demo showcases the integration of Pollinations AI for text rewriting and image generation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}