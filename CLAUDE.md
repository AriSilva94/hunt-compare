# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server (Next.js on port 3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment
Requires environment variables for Supabase:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Architecture

### Tech Stack
- **Framework**: Next.js 15.4.2 with App Router
- **UI**: React 19, Tailwind CSS 4.1.11
- **Database**: Supabase with PostgreSQL
- **Authentication**: Supabase Auth with custom middleware
- **Forms**: React Hook Form with Zod validation
- **Language**: TypeScript with strict configuration

### Project Structure
```
app/                    # Next.js App Router pages
├── (auth)/            # Auth route group (login/signup)
├── (protected)/       # Protected route group (requires auth)
├── api/               # API routes
├── auth/              # Auth-related pages
├── detalhe-publico/   # Public record details
└── registros-publicos/ # Public records listing

components/
├── auth/              # Authentication components
├── shared/            # Shared components (Header)
└── ui/                # Reusable UI components

lib/supabase/          # Supabase configuration
├── client.ts          # Browser client
├── middleware.ts      # Session management
└── server.ts          # Server client

services/              # Business logic services
types/                 # TypeScript type definitions
utils/                 # Utility functions
```

### Core Features
This is a Tibia hunt analysis application that manages JSON session data:

1. **Authentication System**: Custom Supabase auth with protected/public route groups
2. **Record Management**: CRUD operations for hunt session data stored as JSON
3. **Public/Private Records**: Users can share records publicly or keep them private
4. **Tibia Integration**: Handles creature images and weapon data for the game Tibia

### Database Schema
Single `records` table:
- `id` (UUID primary key)
- `user_id` (foreign key to auth.users)
- `data` (JSONB for hunt session data)
- `is_public` (boolean for sharing)
- `created_at`/`updated_at` (timestamps)

### Authentication Flow
- Middleware handles session management for all routes except `/auth/*`
- Public routes: `/`, `/login`, `/signup`, `/registros-publicos`, `/detalhe-publico/*`
- All other routes require authentication
- Logged-in users accessing `/login` are redirected to `/home`

### Key Files
- `middleware.ts:4-43` - Route protection and session management
- `services/records.service.ts:18-113` - Main business logic for records
- `types/database.types.ts:9-40` - Supabase database types
- `app/layout.tsx:55-83` - Root layout with AuthProvider and Header