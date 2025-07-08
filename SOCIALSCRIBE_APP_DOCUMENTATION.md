# SocialScribe - Complete App Documentation 📚

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [API Integration](#api-integration)
7. [Components](#components)
8. [Configuration](#configuration)
9. [Deployment](#deployment)
10. [Development](#development)
11. [Environment Variables](#environment-variables)
12. [Recent Updates](#recent-updates)

---

## Overview

**SocialScribe** is an AI-powered social media content generator that helps users create tailored posts, comments, and direct messages for various platforms like LinkedIn, Twitter, Facebook, and more. The application leverages AI models to generate contextually appropriate content based on user preferences.

### Key Capabilities
- Generate platform-specific social media content
- Customize tone, sentiment, and style
- Add emojis, hashtags, and call-to-actions
- Support for multiple content types (posts, comments, DMs)
- Real-time content generation with AI

---

## Architecture

### Frontend Architecture
- **Framework**: Next.js 14.2.5 with App Router
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: React hooks (useState, useEffect)
- **Runtime**: Edge runtime for API routes

### Backend Architecture
- **API Routes**: Next.js API routes with edge runtime
- **AI Integration**: OpenRouter API with DeepSeek model
- **Deployment**: Cloudflare Pages with Wrangler

---

## Features

### Core Features ✨
1. **Content Generation**
   - AI-powered content creation
   - Platform-specific optimization
   - Multiple content types support

2. **Customization Options**
   - **Content Type**: Post, Comment, Direct Message
   - **Platform**: LinkedIn, Twitter, Facebook, Instagram, TikTok, YouTube
   - **Tone**: Professional, Casual, Friendly, Formal, Humorous, Inspirational, Persuasive, Informative
   - **Length**: Short (1-2 sentences), Medium (3-5 sentences), Long (6+ sentences)
   - **Sentiment Control**: 0-100% positivity slider
   - **Add-ons**: Emojis, Hashtags, Call-to-Action

3. **User Experience**
   - Real-time content generation
   - Copy-to-clipboard functionality
   - Responsive design
   - Dark mode support
   - Loading states and error handling

### Advanced Features 🚀
- **Smart Prompting**: Context-aware AI prompts
- **Platform Optimization**: Content tailored for each social platform
- **Sentiment Analysis**: Adjustable positivity levels
- **Content Persistence**: Local storage for user preferences

---

## Tech Stack

### Frontend Technologies
```json
{
  "framework": "Next.js 14.2.5",
  "language": "JavaScript/JSX",
  "styling": "Tailwind CSS",
  "ui_library": "Radix UI",
  "icons": "Lucide React",
  "animations": "Framer Motion",
  "forms": "React Hook Form",
  "validation": "Zod"
}
```

### Backend Technologies
```json
{
  "runtime": "Edge Runtime",
  "ai_provider": "OpenRouter",
  "ai_model": "DeepSeek R1",
  "deployment": "Cloudflare Pages",
  "build_tool": "Wrangler"
}
```

### Development Tools
```json
{
  "package_manager": "npm",
  "linting": "ESLint",
  "bundler": "Next.js built-in",
  "deployment": "Cloudflare Pages"
}
```

---

## Project Structure

```
socialscribe/
├── public/                     # Static assets
│   ├── ads.txt                # Google AdSense verification
│   ├── next.svg               # Next.js logo
│   └── vercel.svg             # Vercel logo
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── about/             # About page
│   │   │   └── page.js
│   │   ├── api/               # API routes
│   │   │   ├── generate/      # Main AI generation endpoint
│   │   │   │   └── route.js
│   │   │   └── hello/         # Test endpoint
│   │   │       └── route.js
│   │   ├── globals.css        # Global styles
│   │   ├── layout.js          # Root layout
│   │   ├── not-found.js       # 404 page
│   │   └── page.js            # Home page
│   ├── components/            # React components
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── button.jsx
│   │   │   ├── select.jsx
│   │   │   ├── textarea.jsx
│   │   │   ├── slider.jsx
│   │   │   └── [40+ other components]
│   │   ├── Footer.js          # App footer
│   │   ├── Menubar.js         # Main content generator
│   │   └── NavBar.js          # Navigation bar
│   └── lib/
│       └── utils.js           # Utility functions
├── .env                       # Environment variables
├── .gitignore                 # Git ignore rules
├── components.json            # Shadcn/ui configuration
├── jsconfig.json              # JavaScript configuration
├── next.config.mjs            # Next.js configuration
├── package.json               # Dependencies and scripts
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── wrangler.toml              # Cloudflare deployment config
```

---

## API Integration

### OpenRouter Integration
The app now uses OpenRouter API with DeepSeek model instead of Google Gemini.

#### Configuration
```javascript
// src/app/api/generate/route.js
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});
```

#### API Endpoint: `/api/generate`
**Method**: POST

**Request Body**:
```json
{
  "contentType": "post|comment|dm",
  "platform": "linkedin|twitter|facebook|instagram|tiktok|youtube",
  "context": "User's content context",
  "tone": "professional|casual|friendly|formal|humorous|inspirational|persuasive|informative",
  "length": "short|medium|long",
  "useEmojis": boolean,
  "useHashtags": boolean,
  "useCTA": boolean,
  "sentiment": number (0-100)
}
```

**Response**:
```json
{
  "content": "Generated social media content"
}
```

**Error Response**:
```json
{
  "error": "Error message"
}
```

---

## Components

### Core Components

#### 1. Menubar.js (Main Component)
The primary interface for content generation with all customization options.

**Key Features**:
- Form controls for all content parameters
- Real-time AI content generation
- Copy-to-clipboard functionality
- Local storage for user preferences
- Loading states and error handling

**State Management**:
```javascript
const [contentType, setContentType] = useState("");
const [platform, setPlatform] = useState("");
const [tone, setTone] = useState("");
const [length, setLength] = useState("");
const [useEmojis, setUseEmojis] = useState(false);
const [useHashtags, setUseHashtags] = useState(false);
const [useCTA, setUseCTA] = useState(false);
const [sentiment, setSentiment] = useState(50);
const [context, setContext] = useState("");
const [loading, setLoading] = useState(false);
const [generatedContent, setGeneratedContent] = useState("");
```

#### 2. NavBar.js
Navigation component with branding and links.

**Features**:
- SocialScribe branding with stylized logo
- Navigation links (About, GitHub)
- Responsive design
- Sticky positioning

#### 3. Footer.js
Simple footer with copyright and social links.

### UI Components (src/components/ui/)
Comprehensive set of reusable UI components built on Radix UI:

- **Form Controls**: Button, Input, Textarea, Select, Checkbox, Radio, Switch
- **Layout**: Card, Separator, Tabs, Accordion, Collapsible
- **Feedback**: Alert, Toast, Progress, Skeleton
- **Navigation**: Navigation Menu, Breadcrumb, Pagination
- **Overlay**: Dialog, Popover, Tooltip, Hover Card, Sheet
- **Data Display**: Table, Badge, Avatar, Calendar
- **Advanced**: Command, Context Menu, Dropdown Menu, Slider

---

## Configuration

### Next.js Configuration (next.config.mjs)
```javascript
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

const nextConfig = {};
export default nextConfig;
```

### Tailwind Configuration (tailwind.config.js)
- Custom color scheme with CSS variables
- Dark mode support
- Custom animations and keyframes
- NextUI integration
- Responsive breakpoints

### Wrangler Configuration (wrangler.toml)
```toml
name = "sopgames"
compatibility_date = "2024-08-06"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"
```

---

## Deployment

### Cloudflare Pages Deployment
The app is configured for deployment on Cloudflare Pages using Wrangler.

**Build Commands**:
```bash
# Build for Cloudflare Pages
npm run pages:build

# Preview locally
npm run preview

# Deploy to production
npm run deploy
```

**Deployment Process**:
1. Build Next.js application
2. Convert to Cloudflare Pages format using `@cloudflare/next-on-pages`
3. Deploy using Wrangler CLI

### Environment Setup
Required environment variables for deployment:
- `OPENROUTER_API_KEY`: OpenRouter API key for AI generation

---

## Development

### Getting Started
```bash
# Clone the repository
git clone https://github.com/sh20raj/socialscribe.git

# Navigate to project directory
cd socialscribe

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "pages:build": "npx @cloudflare/next-on-pages",
  "preview": "npm run pages:build && wrangler pages dev",
  "deploy": "npm run pages:build && wrangler pages deploy"
}
```

### Code Quality
- **ESLint**: Code linting with Next.js configuration
- **Prettier**: Code formatting (implied by project structure)
- **TypeScript**: JSConfig for better IDE support

---

## Environment Variables

### Required Variables
```bash
# .env file
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
```

### Optional Variables
```bash
# Google AdSense (if using ads)
GOOGLE_ADSENSE_CLIENT_ID=ca-pub-your-client-id

# Analytics (if implementing)
GOOGLE_ANALYTICS_ID=GA-your-tracking-id
```

---

## Recent Updates

### AI Model Migration
- **Previous**: Google Gemini 1.5 Flash
- **Current**: OpenRouter with DeepSeek R1 model
- **Benefits**: 
  - Free tier access
  - Better performance for social media content
  - More reliable API access

### Technical Improvements
1. **API Integration**: Migrated from Google Generative AI to OpenRouter
2. **Dependencies**: Added OpenAI SDK for OpenRouter compatibility
3. **Error Handling**: Improved error handling in API routes
4. **Environment**: Fixed environment variable formatting

### Code Changes
```javascript
// Before (Gemini)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const result = await model.generateContent(prompt);

// After (OpenRouter + DeepSeek)
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});
const completion = await openai.chat.completions.create({
  model: "deepseek/deepseek-r1-0528:free",
  messages: [{ role: "user", content: prompt }],
  temperature: 0.7,
  max_tokens: 1000
});
```

---

## Performance & Optimization

### Edge Runtime
- All API routes use Edge Runtime for faster cold starts
- Reduced latency for global users
- Better scalability

### Bundle Optimization
- Tree-shaking enabled
- Dynamic imports for large components
- Optimized Tailwind CSS bundle

### Caching Strategy
- Static assets cached by Cloudflare CDN
- API responses can be cached (not implemented yet)
- Local storage for user preferences

---

## Security Considerations

### API Security
- Environment variables for sensitive data
- Rate limiting (can be implemented)
- Input validation and sanitization

### Client Security
- XSS prevention through React's built-in protections
- CSRF protection through SameSite cookies
- Content Security Policy (can be enhanced)

---

## Future Enhancements

### Planned Features
1. **Multi-Model Support**: Switch between different AI models
2. **User Accounts**: Save preferences and content history
3. **Chrome Extension**: Browser extension for quick access
4. **Analytics**: Track content performance
5. **Templates**: Pre-built content templates
6. **Collaboration**: Team features for content creation
7. **API Rate Limiting**: Implement proper rate limiting
8. **Content Scheduling**: Schedule posts for later

### Technical Improvements
1. **Database Integration**: Add persistent storage
2. **Authentication**: User login and management
3. **Caching**: Implement Redis caching
4. **Monitoring**: Add application monitoring
5. **Testing**: Unit and integration tests
6. **CI/CD**: Automated deployment pipeline

---

## Support & Contact

### Developer Information
- **Developer**: SH20RAJ (Shaswat Raj)
- **Email**: sh20raj@gmail.com
- **LinkedIn**: [linkedin.com/in/sh20raj](https://linkedin.com/in/sh20raj)
- **Website**: [shaswat.live](https://shaswat.live)

### Project Links
- **Live Demo**: [socialscribe.pages.dev](https://socialscribe.pages.dev)
- **GitHub**: [github.com/sh20raj/socialscribe](https://github.com/sh20raj/socialscribe)
- **Issues**: Report bugs and feature requests on GitHub

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

*Last Updated: January 2025*
*Documentation Version: 1.0*