<div align="center">

# VibePass

**Book The Vibe with AI** — A premium, full-stack Event Booking & OTT Explorer platform built with Next.js 15, Drizzle ORM, and Razorpay.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-Latest-C5F74F?logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Neon](https://img.shields.io/badge/Neon_Serverless_PostgreSQL-00E5A0?logo=neon&logoColor=black)](https://neon.tech/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-02042B?logo=razorpay&logoColor=white)](https://razorpay.com/)
[![Zustand](https://img.shields.io/badge/Zustand-State-FF6B6B?logo=zustand&logoColor=white)](https://zustand-demo.pmnd.rs/)
[![Leaflet](https://img.shields.io/badge/Leaflet_Maps-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[🚀 Live Demo](https://vibepass.vercel.app) • [📖 API Docs](/api-docs) • [🐛 Report Bug](https://github.com/dharunkumar-sh/booking-platform/issues) • [✨ Request Feature](https://github.com/dharunkumar-sh/booking-platform/issues)

</div>

---

## 📋 Table of Contents

<details>
<summary><strong>Click to expand</strong></summary>

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Management](#-database-management)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Seat Mapping System](#-seat-mapping-system)
- [Authentication Flow](#-authentication-flow)
- [Payment Integration](#-payment-integration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

</details>

---

## 🎯 Overview

**VibePass** is a modern, AI-enhanced event discovery and booking platform that unifies live entertainment (concerts, comedy, movies, sports) with OTT content exploration. Built on the **Next.js 15 App Router**, it leverages **Server Components** for optimal performance, **Drizzle ORM** for type-safe database access, and **Zustand** for lightweight global state management.

> **Core Philosophy**: *Reduce friction from discovery to attendance.* Whether it's a stadium concert, an indie comedy show, or the latest OTT release — VibePass handles search, selection, payment, and ticketing in a single cohesive flow.

### Why VibePass?

| Problem | Solution |
|---------|----------|
| Fragmented event discovery | Unified browse across categories (Concerts, Comedy, Movies, Trending, Moods) |
| Complex seat selection | 4 specialized seat-map components (Arena, Stadium, Movie Theater, Open Space) |
| Payment failures | Razorpay integration with server-side verification & webhook handling |
| No personalization | Mood-based recommendations + Watchlist + Favorites + Booking history |
| Poor mobile UX | Tailwind CSS v4 + Responsive design + PWA-ready |

---

## ✨ Key Features

### 🎪 Event Discovery & Booking
| Feature | Description |
|---------|-------------|
| **Multi-Category Browsing** | Concerts, Comedy, Movies, Trending, Moods, OTT |
| **Advanced Search** | Full-text search with filters (location, date, category, price) |
| **Interactive Maps** | Leaflet-powered venue location with geolocation support |
| **Real-time Availability** | Optimistic UI updates with server synchronization |
| **Booking Timer** | Session-based reservation countdown (configurable TTL) |

### 🎭 Seat Selection Engine
| Map Type | Use Case | Component |
|----------|----------|-----------|
| **Arena** | Indoor concerts, award shows | `ArenaSeatMap.jsx` |
| **Stadium** | Sports, large outdoor concerts | `StadiumSeatMap.jsx` |
| **Movie Theater** | Cinema halls, screened events | `MovieSeatMap.jsx` |
| **Open Space** | Festivals, general admission | `OpenSpaceSeatMap.jsx` |

- **Visual Legends**: Color-coded availability (Available, Selected, Booked, Reserved, Wheelchair)
- **Pricing Tiers**: Dynamic pricing per section/row
- **Accessibility**: Keyboard navigation + ARIA labels

### 📺 OTT Explorer
- **Content Search**: Cross-platform OTT search (movies, series, new releases)
- **Watchlist**: Persistent save-for-later with sync across devices
- **New Releases**: Curated weekly updates

### 👤 User Experience
- **Authentication**: Google OAuth 2.0 + Email OTP (passwordless)
- **Profile Management**: Editable profile, notification preferences
- **Booking History**: Past/upcoming tickets with QR codes
- **Support Center**: Cancellations, Refunds, Payments, Safety FAQs

### 💳 Payments & Security
- **Razorpay Integration**: Orders, Payments, Refunds, Webhooks
- **Server-side Verification**: Signature validation on `/api/payment/verify`
- **Idempotency**: Safe retries on network failures
- **PCI Compliance**: No sensitive card data touches our servers

---

## 🛠 Tech Stack

### Frontend
```mermaid
graph LR
    A[Next.js 15 App Router] --> B[React 19 Server Components]
    B --> C[Tailwind CSS v4]
    C --> D[Lucide React Icons]
    D --> E[React Leaflet Maps]
    E --> F[Zustand State]
```

### Backend & Database
| Layer | Technology | Purpose |
|-------|------------|---------|
| **Runtime** | Node.js 20+ | Edge-compatible API routes |
| **Framework** | Next.js 15 | Full-stack React framework |
| **Database** | Neon (Serverless PostgreSQL) | Auto-scaling, branchable DB |
| **ORM** | Drizzle ORM | Type-safe SQL, zero-runtime overhead |
| **Migrations** | Drizzle Kit | Schema versioning & migrations |
| **Auth** | NextAuth.js (custom) | Google OAuth + OTP flows |
| **Email** | Nodemailer (SMTP) | Transactional emails (OTP, confirmations) |
| **Payments** | Razorpay Node SDK | Payment gateway integration |

### Developer Experience
- **Language**: TypeScript (strict mode)
- **Linting**: ESLint + Next.js config
- **Formatting**: Prettier (implied)
- **Database UI**: Drizzle Studio (`pnpm db:studio`)
- **API Docs**: Redoc/OpenAPI (`/app/redoc`, `/app/docs`)

---

## 🏗 Architecture

### High-Level Data Flow

```mermaid
flowchart TD
    subgraph Client
        UI[React Components] --> State[Zustand Store]
        UI --> Maps[Leaflet Maps]
        UI --> SeatMaps[Seat Selection]
    end
    
    subgraph "Next.js Server"
        API[API Routes] --> Auth[Auth Handlers]
        API --> Events[Event CRUD]
        API --> Bookings[Booking Engine]
        API --> Payments[Razorpay Integration]
        API --> OTT[OTT Search]
    end
    
    subgraph Infrastructure
        DB[(Neon PostgreSQL)]
        Razorpay[Razorpay API]
        Google[Google OAuth]
        SMTP[Email Provider]
    end
    
    State --> API
    SeatMaps --> Bookings
    Bookings --> Payments
    Payments --> Razorpay
    Auth --> Google
    Auth --> SMTP
    Events --> DB
    Bookings --> DB
    OTT --> ExternalAPI[TMDB/OTT APIs]
```

### Route Group Organization
```
app/(pages)/          # Public marketing & browse pages
app/(auth)/           # Auth-gated pages (bookings, profile)
app/(checkout)/       # Payment flow pages
app/api/              # RESTful API endpoints
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 20.0.0
- **pnpm** ≥ 9.0.0 (recommended) or npm/yarn
- **Neon Account** (or local PostgreSQL)
- **Razorpay Account** (test mode works)
- **Google Cloud Project** (for OAuth)
- **SMTP Provider** (SendGrid, Resend, Gmail, etc.)

### Quick Start

```bash
# 1. Clone & install
git clone https://github.com/dharunkumar-sh/booking-platform.git
cd booking-platform
pnpm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials (see below)

# 3. Set up database
pnpm db:generate   # Generate migrations from schema
pnpm db:migrate    # Apply migrations to Neon
pnpm db:seed       # Optional: seed sample events

# 4. Start development
pnpm dev
```

Visit `http://localhost:3000` 🎉

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run migrations against DB |
| `pnpm db:push` | Push schema directly (dev only) |
| `pnpm db:studio` | Open Drizzle Studio UI |
| `pnpm db:seed` | Seed database with sample data |

---

## 🔐 Environment Variables

Create `.env.local` in the project root:

```env
# ──────────────────────────────────────────────
# DATABASE (Neon Serverless PostgreSQL)
# ──────────────────────────────────────────────
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/db?sslmode=require"
# For local dev with Docker: postgresql://postgres:postgres@localhost:5432/vibepass

# ──────────────────────────────────────────────
# AUTHENTICATION
# ──────────────────────────────────────────────
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Cloud Console → Credentials)
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"

# ──────────────────────────────────────────────
# UPSTASH KAFKA (Event Streaming & Reliable Outbox)
# ──────────────────────────────────────────────
UPSTASH_KAFKA_REST_URL="https://your-kafka-instance.upstash.io"
UPSTASH_KAFKA_REST_USERNAME="your_username"
UPSTASH_KAFKA_REST_PASSWORD="your_password"
```

### 📡 Kafka & Event Management Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/kafka/health` | Healthcheck & queue metrics (Outbox & DLQ stats) |
| `POST` | `/api/kafka/publish` | Publish event messages (Outbox transactional or direct mode) |
| `GET/POST` | `/api/kafka/outbox/process` | Batch outbox processor/dispatcher (cron-friendly) |
| `GET` | `/api/kafka/dlq` | List dead-lettered / failed messages |
| `POST` | `/api/kafka/dlq` | Replay and re-process failed DLQ messages |
