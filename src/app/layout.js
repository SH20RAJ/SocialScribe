import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SocialScribe+ - AI Writing Assistant',
  description: 'AI-powered Chrome extension that fixes grammar, rewrites content, and enhances your writing across Twitter, LinkedIn, Gmail, and every website you visit.',
  keywords: 'AI writing assistant, grammar checker, content rewriter, Chrome extension, social media writing, DeepSeek AI',
  authors: [{ name: 'SocialScribe Team' }],
  openGraph: {
    title: 'SocialScribe+ - AI Writing Assistant',
    description: 'Write better everywhere with our AI-powered Chrome extension',
    url: 'https://socialscribe.pages.dev',
    siteName: 'SocialScribe+',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SocialScribe+ AI Writing Assistant',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocialScribe+ - AI Writing Assistant',
    description: 'Write better everywhere with our AI-powered Chrome extension',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}