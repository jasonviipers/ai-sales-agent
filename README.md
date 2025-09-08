# AI Sales Agent SaaS Platform

A comprehensive AI-powered sales agent platform that automates phone calls, learns from conversations, and provides intelligent insights to boost sales performance.

## 🚀 Features

### Core Functionality
- **AI-Powered Sales Calls**: Automated phone calls using advanced AI agents
- **Real-time Conversation**: Live audio processing with speech-to-text and text-to-speech
- **Intelligent Memory**: Vector-based memory system that learns from every interaction
- **Lead Management**: Comprehensive CRM with intelligent lead scoring
- **Script Management**: Customizable AI agent scripts and prompts
- **Live Call Monitoring**: Real-time call oversight with intervention capabilities

### AI & Memory System
- **Vector Storage**: Persistent memory using Pinecone for conversation context
- **Lead Profiling**: AI-generated profiles based on conversation history
- **Success Patterns**: Machine learning from successful call outcomes
- **Contextual Responses**: AI responses informed by past interactions
- **Sentiment Analysis**: Real-time emotion detection and response adaptation

### Integrations
- **Twilio**: Phone system integration for making and receiving calls
- **OpenRouter**: GPT-4 for conversation AI and Whisper for speech recognition
- **ElevenLabs**: High-quality text-to-speech synthesis
- **PgVector**: Vector database for AI memory storage
- **Redis**: Real-time state management and pub/sub
- **Stripe**: Payment processing and subscription management

## 🛠️ Tech Stack

### Backend
- **TypeScript**: Type-safe development
- **Elysia + oRPC**: Type-safe API layer
- **Drizzle ORM**: Database ORM with PostgreSQL
- **Better Auth**: Authentication and session management

### Frontend
- **Next.js 15**: Full-stack React framework with App Router
- **React 19**: Modern React with concurrent features
- **Tailwind CSS v4**: Utility-first styling
- **shadcn/ui**: High-quality component library
- **Recharts**: Data visualization and analytics

### Infrastructure
- **Vercel**: Deployment and hosting
- **PostgreSQL**: Primary database (Neon/Supabase)
- **Redis**: Caching and real-time features
- **WebSockets**: Real-time communication

## 📋 Prerequisites

Before running the application, ensure you have:

- Node.js 18+ installed
- PostgreSQL database (Neon or Supabase recommended)
- Redis instance (Upstash recommended)
- Required API keys (see Environment Variables section)
