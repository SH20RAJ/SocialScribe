import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SocialScribe - AI Social Media Content Generator",
  description: "Generate tailored social media posts, comments, and DMs with AI. Customize content for LinkedIn, Twitter, Facebook with perfect tone, emojis, hashtags and more.",
  
  // Basic metadata
  keywords: "social media, AI writer, content generator, LinkedIn posts, Twitter posts, Facebook posts, social media automation, AI content",
  author: "SH20RAJ",
  
  // Manifest and icons
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  
  // Open Graph metadata
  openGraph: {
    title: "SocialScribe - AI Social Media Content Generator",
    description: "Generate perfect social media content with AI. Customize posts for LinkedIn, Twitter, Facebook with ideal tone, emojis, and hashtags.",
    url: "https://socialscribe.pages.dev",
    siteName: "SocialScribe",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "SocialScribe - AI Social Media Content Generator",
    }],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    title: "SocialScribe - AI Social Media Content Generator",
    description: "Generate perfect social media content with AI. Customize posts, comments, and DMs with ideal tone and style.",
    creator: "@sh20raj",
    images: ["/og-image.png"],
  },
  
  // Verification
  verification: {
    google: "google-site-verification-code",
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Alternative languages
  alternates: {
    canonical: "https://socialscribe.pages.dev",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1828915420581549"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={inter.className}>
        <NavBar />
        {children} <Footer />
      </body>
    </html>
  );
}
