"use client"

export const runtime = 'edge';

import { Button } from "@/components/ui/button"
import { Brain, Chrome, CheckCircle, Sparkles, Zap, Globe, MessageCircle, Mail, FileText, Twitter, Linkedin, ArrowRight, Star, Users, Shield } from "lucide-react"
import Link from "next/link"
import UserAuth from "@/components/UserAuth"

export default function WelcomePage() {
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Extension Installed
            </div>
            <UserAuth />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Welcome Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="h-4 w-4" />
            Successfully Installed!
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Welcome to SocialScribe+! 🎉
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your AI writing assistant is ready to help you write better content across every website. 
            Let's get you started with a quick tour!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/#demo">
                <Sparkles className="h-5 w-5 mr-2" />
                Try the Demo
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#how-to-use">
                <ArrowRight className="h-5 w-5 mr-2" />
                Learn How to Use
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-card rounded-lg border border-border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">50K+</h3>
            <p className="text-muted-foreground">Happy Users</p>
          </div>
          
          <div className="text-center p-6 bg-card rounded-lg border border-border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">1M+</h3>
            <p className="text-muted-foreground">Texts Improved</p>
          </div>
          
          <div className="text-center p-6 bg-card rounded-lg border border-border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">4.9/5</h3>
            <p className="text-muted-foreground">User Rating</p>
          </div>
        </div>

        {/* How to Use */}
        <section id="how-to-use" className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            How to Use SocialScribe+
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Find the Brain Icon</h3>
                  <p className="text-muted-foreground">
                    Look for the blue brain icon that appears in the bottom-right corner of any text field when you click or focus on it.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Choose Your Tone</h3>
                  <p className="text-muted-foreground">
                    Click the brain icon to open the quick panel. Select from emoji-based tones: 🎓 Professional, 😎 Casual, 💕 Flirty, and more!
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Pick an Action</h3>
                  <p className="text-muted-foreground">
                    Choose from Fix Grammar, Rewrite, Shorten, or Expand. Your text will be improved instantly with AI magic!
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-4">💡 Pro Tips</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Use <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Shift+S</kbd> to quickly open SocialScribe
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Try different tones for different platforms (casual for Twitter, professional for LinkedIn)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Use custom tone descriptions for specific writing styles
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Right-click on any text field for quick context menu access
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Supported Platforms */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            Works Everywhere You Write
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Twitter, name: "Twitter/X", color: "text-blue-500" },
              { icon: Linkedin, name: "LinkedIn", color: "text-blue-600" },
              { icon: Mail, name: "Gmail", color: "text-red-500" },
              { icon: FileText, name: "Medium", color: "text-green-600" },
              { icon: MessageCircle, name: "Reddit", color: "text-orange-500" },
              { icon: Globe, name: "Facebook", color: "text-blue-700" },
              { icon: FileText, name: "Notion", color: "text-gray-700" },
              { icon: Chrome, name: "Any Website", color: "text-gray-600" }
            ].map((platform, index) => (
              <div key={index} className="text-center p-4 bg-card rounded-lg border border-border hover:shadow-sm transition-shadow">
                <platform.icon className={`h-8 w-8 mx-auto mb-2 ${platform.color}`} />
                <p className="text-sm font-medium text-foreground">{platform.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="mb-16">
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Your Privacy is Protected
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              SocialScribe+ processes your text securely and doesn't store any of your content. 
              Your writing stays private, and we only improve it with AI magic.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                No data storage
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                Secure processing
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                Privacy-first design
              </div>
            </div>
          </div>
        </section>

        {/* Get Started */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Write Better?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start using SocialScribe+ on any website with text fields!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/#demo">
                <Sparkles className="h-5 w-5 mr-2" />
                Try the Demo Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.close()}>
              <Chrome className="h-5 w-5 mr-2" />
              Start Writing
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}