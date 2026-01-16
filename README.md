<div align="center">
  <img src="public/logo.png" alt="TodoIt Logo" width="400" />

  <h1>TodoIt</h1>

  <p><strong>A clean, Todoist-inspired task management app built with Next.js 15 and Supabase.</strong></p>

  <p>
    <a href="https://todoit-ecru.vercel.app">Live Demo</a> •
    <a href="#features">Features</a> •
    <a href="#setup">Setup</a> •
    <a href="#tech-stack">Tech Stack</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js 15" />
    <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk" alt="Clerk Auth" />
    <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase" alt="Supabase" />
    <img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwindcss" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript" alt="TypeScript" />
  </p>
</div>

---

## Features

- **User Authentication** - Sign up/sign in with Clerk (email, Google, GitHub)
- **Per-User Data** - Each user has their own private todos and projects
- **Task Management** - Create, edit, complete, and delete tasks
- **Projects** - Organize tasks into color-coded projects with icons
- **Smart Views** - Inbox, Today, and Upcoming views
- **Priority Levels** - P1-P4 with color coding
- **Due Dates** - Calendar picker for scheduling
- **Mobile Responsive** - Bottom navigation for app-like mobile experience
- **Dark Mode** - Beautiful dark theme by default

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router, Server Components) |
| Authentication | Clerk |
| Database | Supabase (PostgreSQL) |
| Styling | Tailwind CSS 4 |
| Components | Radix UI / shadcn/ui |
| Language | TypeScript |
| Deployment | Vercel |

## Screenshots

<div align="center">
  <p><em>Desktop and mobile views coming soon</em></p>
</div>

## Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account
- Clerk account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/spragginsdesigns/todo-app.git
   cd todo-app
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure credentials in `.env.local`:**
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

   # Clerk (from clerk.com dashboard)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

### Database Setup

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run the SQL migrations from `supabase/migrations/` in the SQL Editor
4. Copy your project URL and anon key from **Settings > API**

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
todo-app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (dashboard)/     # Dashboard route group (protected)
│   │   │   ├── inbox/       # Inbox page
│   │   │   ├── today/       # Today view
│   │   │   ├── upcoming/    # Upcoming view
│   │   │   ├── projects/    # Projects list
│   │   │   └── project/     # Individual project view
│   │   ├── sign-in/         # Clerk sign-in page
│   │   ├── sign-up/         # Clerk sign-up page
│   │   └── actions/         # Server actions
│   ├── components/
│   │   ├── layout/          # Sidebar, bottom nav, headers
│   │   ├── todos/           # Todo list and item components
│   │   ├── projects/        # Project components
│   │   └── ui/              # shadcn/ui components
│   ├── lib/
│   │   ├── auth/            # Clerk auth utilities
│   │   ├── actions/         # Server actions (projects, user-init)
│   │   └── supabase/        # Supabase client & types
│   └── middleware.ts        # Clerk auth middleware
├── supabase/
│   └── migrations/          # Database migrations
└── public/                  # Static assets & favicons
```

## License

MIT © [Austin Spraggins](https://github.com/spragginsdesigns)
