import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Chrome, Download, Sparkles, Zap, Globe, MessageCircle, Mail, FileText, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"
import RewriteDemo from "@/components/RewriteDemo"
import ExtensionInstallGuide from "@/components/ExtensionInstallGuide"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              SocialScribe
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
              Features
            </Link>
            <Link href="#demo" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
              Rewriter
            </Link>
            <Link href="#install" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
              Install
            </Link>
            <Button variant="outline" size="sm" asChild className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Link href="#install">
                Get Extension
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm mb-8">
            <Sparkles className="h-3 w-3" />
            Powered by AI
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            Write better,
            <br />
            everywhere
          </h1>
          
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered Chrome extension that fixes grammar, rewrites content, and enhances your writing 
            across any website you visit.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Button size="lg" asChild className="bg-gray-900 hover:bg-gray-800 text-white border-0">
              <Link href="#install">
                Install Extension
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Link href="#demo">
                Try Rewriter
              </Link>
            </Button>
          </div>

          {/* Platform Icons */}
          <div className="flex items-center justify-center gap-12 text-gray-400">
            <div className="flex items-center gap-2">
              <Twitter className="h-5 w-5" />
              <span className="text-sm">Twitter</span>
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="h-5 w-5" />
              <span className="text-sm">LinkedIn</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <span className="text-sm">Gmail</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <span className="text-sm">Any site</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Features</h2>
            <p className="text-gray-600">Everything you need to write better content</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="h-5 w-5 text-gray-700" />,
                title: "Grammar Fixer",
                description: "Fix grammar, typos, and spelling mistakes instantly"
              },
              {
                icon: <MessageCircle className="h-5 w-5 text-gray-700" />,
                title: "Tone Rewriter",
                description: "Rewrite in formal, casual, friendly, or any tone you need"
              },
              {
                icon: <Brain className="h-5 w-5 text-gray-700" />,
                title: "Context Aware",
                description: "Understands the context and platform you're writing for"
              },
              {
                icon: <Globe className="h-5 w-5 text-gray-700" />,
                title: "Works Everywhere",
                description: "Twitter, LinkedIn, Gmail, Medium, Reddit, and more"
              },
              {
                icon: <Sparkles className="h-5 w-5 text-gray-700" />,
                title: "Smart Suggestions",
                description: "Get intelligent suggestions as you type"
              },
              {
                icon: <Chrome className="h-5 w-5 text-gray-700" />,
                title: "Easy to Use",
                description: "Simple floating button that appears when you need it"
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Rewriter Section */}
      <section id="demo" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">AI Text Rewriter</h2>
            <p className="text-gray-600">Improve your writing instantly with AI-powered suggestions</p>
          </div>
          
          <RewriteDemo />
        </div>
      </section>

      {/* Installation Guide */}
      <section id="install" className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Install extension</h2>
            <p className="text-gray-600">Get started in less than 2 minutes</p>
          </div>
          
          <ExtensionInstallGuide />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">SocialScribe</span>
          </div>
          <p className="text-gray-600 mb-2 text-sm">
            AI-powered writing assistant
          </p>
          <p className="text-xs text-gray-500">
            Powered by AI • Made for better writing
          </p>
        </div>
      </footer>
    </div>
  )
}