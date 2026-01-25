# AIGC Creator Portfolio - NextGen

A high-performance personal website for an AIGC creator featuring an immersive portfolio and a personalized AI digital twin agent.

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend & AI
- **AI Model**: Doubao (via Coze Integration)
- **API**: Server-Side Rendering with Next.js API Routes
- **Architecture**: RAG (Retrieval Augmented Generation)

### Key Features
- 🎨 Dark mode with neon accents (Cyberpunk/Futuristic aesthetic)
- 📱 Mobile-first, fully responsive design
- 🤖 AI Digital Twin chat interface with RAG capabilities
- 🖼️ Portfolio gallery with filtering (Visuals, Video, Audio, Writing)
- 📝 Contact form with guestbook
- 📄 Resume download with analytics
- ✨ Smooth animations and transitions

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # AI chat API endpoint
│   ├── chat/
│   │   └── page.tsx              # AI Digital Twin chat page
│   ├── contact/
│   │   └── page.tsx              # Contact form & resume
│   ├── portfolio/
│   │   └── page.tsx              # Portfolio gallery
│   ├── globals.css               # Global styles & neon effects
│   ├── layout.tsx                # Root layout with theme provider
│   ├── page.tsx                  # Homepage
│   └── robots.ts                 # SEO robots configuration
├── components/
│   ├── ui/                       # shadcn/ui components
│   └── navigation.tsx            # Main navigation component
└── lib/
    └── utils.ts                  # Utility functions
```

## 🎨 Pages Overview

### 1. Home (/)
- Hero section with animated particle background
- Featured works carousel
- Brief introduction section
- Floating AI greeting widget
- Scroll animations

### 2. Portfolio (/portfolio)
- Gallery with multiple media types
- Filter by category (Visuals, Video, Audio, Writing)
- Filter by tool (Midjourney, Stable Diffusion, etc.)
- Lightbox view for items
- Responsive grid layout

### 3. AI Chat (/chat)
- Full-screen chat interface
- AI Digital Twin with RAG capabilities
- Streaming responses
- Conversation history
- Professional yet creative tone

### 4. Contact (/contact)
- Contact form
- Resume download button (with analytics)
- Social media links
- Guestbook for public comments

## 🤖 AI Digital Twin System Prompt

```
You are the AI Digital Twin of the creator. Act as them. Use their knowledge base to answer inquiries about services, pricing, and background.

Tone: Professional yet creative, matching the user's specific linguistic style.

Key Information:
- You are an AIGC creator specializing in AI-generated visuals, videos, audio, and writing
- You use tools like Midjourney, Stable Diffusion, Runway ML, Suno AI, GPT-4, Claude
- You offer services including custom artwork, video production, music composition, and content creation
- Your pricing is competitive and flexible based on project scope
- You are open to collaborations and freelance work

When answering:
1. Maintain a professional yet creative tone
2. Be helpful and informative about the creator's work
3. If you don't know something specific, offer to connect them with the creator directly
4. Keep responses concise but thorough
5. Show enthusiasm for AI creativity
```

## 🛠️ Development

### Prerequisites
- Node.js 24 or higher
- pnpm package manager

### Installation
```bash
# Install dependencies
pnpm install
```

### Running the Development Server
```bash
# Start development server (runs on port 5000)
pnpm dev
# or
coze dev
```

### Building for Production
```bash
# Build the application
pnpm build
```

### Starting Production Server
```bash
# Start production server
pnpm start
# or
coze start
```

## 🎯 Development Phases

### Phase 1: Setup ✅
- Initialize Next.js repository
- Set up UI skeleton
- Configure shadcn/ui components

### Phase 2: Portfolio ✅
- Build portfolio grid
- Implement filtering by category
- Add media players for different content types

### Phase 3: AI Agent ✅
- Develop AI agent API endpoint
- Set up RAG (Retrieval Augmented Generation)
- Build chat widget UI
- Implement streaming responses

### Phase 4: Contact & Resume ✅
- Implement contact form
- Add guestbook functionality
- Resume download with analytics

### Phase 5: Polish & Deploy
- Final polish and animations
- SEO optimization
- Deploy to production

## 🎨 Design Philosophy

- **Modern & Minimalist**: Clean interfaces with purposeful elements
- **Tech-Forward**: Embracing AI and cutting-edge technologies
- **Dark Mode First**: Neon accents on dark backgrounds for cyberpunk aesthetic
- **Mobile-First**: Responsive design that works on all devices
- **Performance-First**: Optimized loading and smooth interactions

## 🌐 Deployment

The application is configured to run on port 5000 by default.

### Environment Variables
Create a `.env.local` file with:
```env
DOUBAO_API_KEY=your_api_key_here
INTEGRATION_BASE_URL=http://localhost:9000
```

## 📊 Analytics & Tracking

- Site visits tracking (to be implemented)
- Resume download counting
- AI chat interaction metrics

## 🔮 Future Enhancements

- [ ] Content Management System (Sanity.io or Strapi)
- [ ] Vector database integration for enhanced RAG
- [ ] Voice synthesis (ElevenLabs)
- [ ] Visual avatar (HeyGen or Live2D)
- [ ] Advanced analytics dashboard
- [ ] Blog section
- [ ] Multi-language support

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For inquiries, visit the contact page or email: hello@aigccreator.com

---

Built with ❤️ using Next.js, Tailwind CSS, and AI-powered creativity.
