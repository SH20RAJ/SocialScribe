import React from "react";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero Section */}
      <section className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">About SocialScribe ✍️</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          An AI-powered tool that helps you create tailored social media posts,
          comments, and direct messages for platforms like LinkedIn, Twitter,
          Facebook, and more.
        </p>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Features 🌟</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-2 flex items-center gap-2">Post Customization 🎯</h3>
            <p className="text-muted-foreground">Select tone and customize options for your perfect post</p>
          </div>
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-2 flex items-center gap-2">Platform-Specific 📱</h3>
            <p className="text-muted-foreground">Tailored content for LinkedIn, Twitter, Facebook</p>
          </div>
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-2 flex items-center gap-2">Content Types 💬</h3>
            <p className="text-muted-foreground">Generate posts, comments, and direct messages</p>
          </div>
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-2 flex items-center gap-2">Smart Features 🤖</h3>
            <p className="text-muted-foreground">Emojis, hashtags, CTAs, and sentiment control</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">How It Works 🔧</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="text-3xl mb-3">🖊️</div>
            <h3 className="font-semibold mb-2">1. Input Content</h3>
            <p className="text-muted-foreground">Type or paste your content</p>
          </div>
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-semibold mb-2">2. Customize</h3>
            <p className="text-muted-foreground">Choose tone and options</p>
          </div>
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold mb-2">3. Generate</h3>
            <p className="text-muted-foreground">AI rewrites your content</p>
          </div>
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="text-3xl mb-3">📣</div>
            <h3 className="font-semibold mb-2">4. Publish</h3>
            <p className="text-muted-foreground">Review and share</p>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Tech Stack 💻</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition-shadow text-center font-medium">Next.js</div>
          <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition-shadow text-center font-medium">Gemini 1.5</div>
        </div>
      </section>

      {/* Contact */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6">Contact 📧</h2>
        <p className="mb-4 text-muted-foreground">For support or inquiries, reach out to:</p>
        <div className="space-y-3">
          <a
            href="mailto:sh20raj@gmail.com"
            className="block text-primary hover:text-primary/80 transition-colors hover:underline"
          >
            sh20raj@gmail.com
          </a>
          <a
            href="https://socialscribe.pages.dev"
            className="block text-primary hover:text-primary/80 transition-colors hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            socialscribe.pages.dev
          </a>
          <a
            href="https://www.linkedin.com/in/sh20raj/"
            className="block text-primary hover:text-primary/80 transition-colors hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn Profile
          </a>
        </div>
      </section>
    </div>
  );
}
