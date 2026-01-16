# Todo App

A modern, Todoist-inspired todo application built with Next.js 15 and Supabase.

## Tech Stack

- **Next.js 15** - App Router with React Server Components
- **Supabase** - PostgreSQL database with Row Level Security
- **TypeScript** - Full type safety with generated database types
- **Tailwind CSS 4** - Utility-first styling
- **Radix UI** - Accessible component primitives

## Features

- Create, edit, and delete todos
- Organize todos into projects
- Priority levels (P1-P4)
- Due dates with calendar picker
- Today and Upcoming views
- Inbox for quick capture

## Important Notice

> **Demo Database Expiration**: The included Supabase demo database key will expire on **January 23rd, 2026**. After this date, you will need to set up your own Supabase project to use this application. See the Setup section below.

## Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/todo-app.git
   cd todo-app
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Configure your Supabase credentials in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### Setting Up Your Own Supabase Project

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run the migrations in `supabase/migrations/` against your database
4. Copy your project URL and anon key from Settings > API

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
todo-app/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   └── lib/
│       └── supabase/     # Supabase client & types
├── supabase/
│   └── migrations/       # Database migrations
└── public/               # Static assets
```

## License

MIT
