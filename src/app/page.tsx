export const runtime = 'edge';
import { Button } from "@/components/ui/button"
import { Brain, Chrome, Download, Sparkles, Zap, Globe, MessageCircle, Mail, FileText, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"
import RewriteDemo from "@/components/RewriteDemo"
import ExtensionInstallGuide from "@/components/ExtensionInstallGuide"
import UserAuth from "@/components/UserAuth"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">
              SocialScribe
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Features
            </Link>
            <Link href="#demo" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Rewriter
            </Link>
            <Link href="#faqs" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              FAQs
            </Link>
            <Link href="#install" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Install
            </Link>
            <Button variant="outline" size="sm" asChild>
              <Link href="#install">
                Get Extension
              </Link>
            </Button>
            <UserAuth />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm mb-8 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 animate-pulse  " />
            Powered by AI
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
            Write better,
            <br />
            everywhere
          </h1>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered Chrome extension that fixes grammar, rewrites content, and enhances your writing 
            across any website you visit.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground border-0">
              <Link href="#install">
                Install Extension
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#demo">
                Try Rewriter
              </Link>
            </Button>
          </div>

          {/* Platform Icons */}
          <div className="flex items-center justify-center gap-12 text-muted-foreground">
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

      {/* Coming Soon Features */}
      <section id="coming-soon" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm mb-6">
              <Sparkles className="h-3 w-3" />
              Coming Soon
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">AI Chat Assistant</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Revolutionary context-aware chat suggestions that understand your conversations 
              and suggest perfect replies across all platforms
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature Description */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-4 w-4 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Context-Aware Suggestions</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      AI reads your entire conversation history and suggests 2-3 perfect replies 
                      that match the context and tone of your chat.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">One-Click Replies</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Click any suggestion to instantly send it, or click to edit before sending. 
                      No more typing - just smart, contextual responses.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="h-4 w-4 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Works Everywhere</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      LinkedIn messages, Instagram DMs, Twitter chats, WhatsApp Web, 
                      and any messaging platform you use.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="h-4 w-4 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Tone Matching</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Choose your reply style: Professional for LinkedIn, Casual for friends, 
                      Flirty for dating apps, or let AI match the conversation tone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">
                  Join the waitlist to be the first to try these features:
                </p>
                <div className="flex gap-3">
                    <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white border-0">
                    <Link href="https://tally.so/r/nPQ0gb">
                      Join Waitlist
                    </Link>
                    </Button>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Link href="#">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Visual Preview */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-medium">L</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">LinkedIn Chat</div>
                    <div className="text-xs text-gray-500">Sarah Johnson - Online</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm max-w-xs">
                      Hey Sarah! I saw your post about the new marketing strategy. Really insightful!
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="bg-white px-3 py-2 rounded-lg text-sm max-w-xs border border-gray-200">
                      Thanks! I would love to discuss it further. Are you free for a quick call this week?
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI Suggestions
                  </div>
                  <div className="space-y-2">
                    <button className="w-full text-left p-2 bg-white hover:bg-gray-50 rounded-md text-sm border border-gray-200 transition-colors">
                      Absolutely! I am available Tuesday or Wednesday afternoon. Which works better for you?
                    </button>
                    <button className="w-full text-left p-2 bg-white hover:bg-gray-50 rounded-md text-sm border border-gray-200 transition-colors">
                      I would be happy to chat! Let me check my calendar and get back to you with some options.
                    </button>
                    <button className="w-full text-left p-2 bg-white hover:bg-gray-50 rounded-md text-sm border border-gray-200 transition-colors">
                      Definitely interested! Would a 15-minute call work, or do you prefer a longer discussion?
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Guide */}
      <section id="install" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Install extension</h2>
            <p className="text-gray-600">Get started in less than 2 minutes</p>
          </div>
          
          <ExtensionInstallGuide />
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about SocialScribe+
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Is SocialScribe+ free to use?",
                answer: "Yes! SocialScribe+ is completely free to download and use. There are no hidden fees, subscriptions, or premium features. All AI-powered writing assistance is available at no cost."
              },
              {
                question: "Which websites does it work on?",
                answer: "SocialScribe+ works on virtually every website with text input fields, including Twitter/X, LinkedIn, Gmail, Facebook, Reddit, Medium, Notion, Google Docs, and thousands of other sites. If there's a text box, SocialScribe+ can help improve your writing."
              },
              {
                question: "Do I need to create an account?",
                answer: "No account required! SocialScribe+ works immediately after installation. Your text is processed securely without requiring any personal information or sign-up process."
              },
              {
                question: "Is my data safe and private?",
                answer: "Absolutely. Your text is processed securely and we don't store or save any of your content. Each request is processed independently and your privacy is our top priority."
              },
              {
                question: "What AI model powers SocialScribe+?",
                answer: "SocialScribe+ uses advanced language models optimized for writing assistance. The AI is specifically trained to understand context, tone, and writing style to provide the most helpful suggestions."
              },
              {
                question: "Can I use custom tones?",
                answer: "Yes! In addition to preset tones like formal, casual, friendly, and professional, you can describe your own custom tone (e.g., 'witty and professional' or 'warm but authoritative') for personalized writing assistance."
              },
              {
                question: "Does it work offline?",
                answer: "SocialScribe+ requires an internet connection to process text through our AI models. However, the extension itself is installed locally and will work as soon as you're back online."
              },
              {
                question: "How do I uninstall the extension?",
                answer: "To uninstall, go to chrome://extensions/, find SocialScribe+ in your list of extensions, and click 'Remove'. All extension data will be completely removed from your browser."
              },
              {
                question: "What's the difference between actions like 'Shorten' and 'Rewrite'?",
                answer: "'Fix Grammar' corrects errors while keeping your original style. 'Rewrite' changes the tone and style. 'Shorten' makes text more concise. 'Expand' adds more detail. 'Summarize' creates a brief overview. Each action is optimized for different writing needs."
              },
              {
                question: "Can I suggest new features?",
                answer: "We'd love to hear your ideas! While we don't have a formal feedback system yet, we're constantly working to improve SocialScribe+ based on user needs and the latest AI capabilities."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-background rounded-lg border border-border p-6 hover:shadow-sm transition-shadow">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Still have questions?
            </p>
            <p className="text-sm text-muted-foreground">
              SocialScribe+ is designed to be intuitive and easy to use. Try the demo above or install the extension to get started!
            </p>
          </div>
        </div>
      </section>
      {/* Supported Platforms */}
      <section className="mb-24 flex items-center justify-center flex-col py-16 px-6 bg-muted/30">
        <h2 className="text-3xl font-bold text-foreground text-center mb-8">
          Works Everywhere You Write
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          SocialScribe+ seamlessly integrates with your favorite platforms. Enjoy AI-powered writing assistance wherever you type.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-6xl">
          {[
        { icon: Twitter, name: "Twitter/X", color: "bg-blue-50 text-blue-500", ring: "ring-blue-100" },
        { icon: Linkedin, name: "LinkedIn", color: "bg-blue-50 text-blue-600", ring: "ring-blue-100" },
        { icon: Mail, name: "Gmail", color: "bg-red-50 text-red-500", ring: "ring-red-100" },
        { icon: FileText, name: "Medium", color: "bg-green-50 text-green-600", ring: "ring-green-100" },
        { icon: MessageCircle, name: "Reddit", color: "bg-orange-50 text-orange-500", ring: "ring-orange-100" },
        { icon: Globe, name: "Facebook", color: "bg-blue-100 text-blue-700", ring: "ring-blue-200" },
        { icon: FileText, name: "Notion", color: "bg-gray-100 text-gray-700", ring: "ring-gray-200" },
        { icon: Chrome, name: "Any Website", color: "bg-gray-50 text-gray-600", ring: "ring-gray-100" }
          ].map((platform, index) => (
        <div
          key={index}
          className={`flex flex-col items-center justify-center p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-shadow group`}
        >
          <div
            className={`mb-3 rounded-full p-4 ${platform.color} shadow-md group-hover:scale-110 transition-transform ring-2 ${platform.ring}`}
          >
            <platform.icon className="h-8 w-8" />
          </div>
          <p className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{platform.name}</p>
        </div>
          ))}
        </div>
      </section>


      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-background">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">SocialScribe</span>
          </div>
          <p className="text-muted-foreground mb-2 text-sm">
            AI-powered writing assistant
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by AI - Made for better writing
          </p>
        </div>
      </footer>
    </div>
  )
}