"use client"

import { Button } from "@/components/ui/button"
import { Brain, Heart, MessageSquare, Star, ArrowRight, RefreshCw, Download } from "lucide-react"
import Link from "next/link"
import UserAuth from "@/components/UserAuth"

export default function UninstallPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              SocialScribe+
            </span>
          </div>
          <UserAuth />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Sad to See You Go */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-10 w-10 text-orange-500" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            We're Sad to See You Go 💔
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Thank you for trying SocialScribe+. We'd love to know what we could have done better 
            to make your writing experience amazing.
          </p>
        </div>

        {/* Feedback Section */}
        <section className="mb-16">
          <div className="bg-card rounded-lg border border-border p-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-6">
              Help Us Improve 🚀
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground mb-4">Why did you uninstall?</h3>
                <div className="space-y-3">
                  {[
                    "Didn't work as expected",
                    "Too many permissions required",
                    "Interface was confusing",
                    "Didn't need the features",
                    "Found a better alternative",
                    "Privacy concerns",
                    "Performance issues",
                    "Other reason"
                  ].map((reason, index) => (
                    <label key={index} className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="uninstall-reason" 
                        value={reason}
                        className="w-4 h-4 text-primary border-border focus:ring-primary"
                      />
                      <span className="text-sm text-muted-foreground">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-4">Additional feedback (optional)</h3>
                <textarea 
                  className="w-full h-32 p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-none"
                  placeholder="Tell us what we could improve..."
                ></textarea>
                
                <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Feedback
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What You'll Miss */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            What You'll Miss
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">AI-Powered Writing</h3>
              <p className="text-sm text-muted-foreground">
                Smart grammar fixes and tone adjustments across all websites
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Multiple Tones</h3>
              <p className="text-sm text-muted-foreground">
                Professional, casual, flirty, and custom tones for any situation
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Real-time Suggestions</h3>
              <p className="text-sm text-muted-foreground">
                Instant improvements as you type on Twitter, LinkedIn, Gmail
              </p>
            </div>
          </div>
        </section>

        {/* Alternatives */}
        <section className="mb-16">
          <div className="bg-muted/30 rounded-lg p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground text-center mb-6">
              Before You Go... 🤔
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-foreground mb-4">Having Issues?</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Try refreshing the page if the extension isn't working
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Check if you have the latest version installed
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Disable other writing extensions that might conflict
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Try the keyboard shortcut Ctrl+Shift+S
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-4">Want to Try Again?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We're constantly improving SocialScribe+. Maybe give us another chance?
                </p>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/#install">
                    <Download className="h-4 w-4 mr-2" />
                    Reinstall Extension
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Final Message */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Thank You! 🙏
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We appreciate you trying SocialScribe+. Your feedback helps us build better tools 
            for writers everywhere. Best of luck with your writing journey!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/">
                <ArrowRight className="h-5 w-5 mr-2" />
                Visit Homepage
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="mailto:support@socialscribe.dev">
                <MessageSquare className="h-5 w-5 mr-2" />
                Contact Support
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}