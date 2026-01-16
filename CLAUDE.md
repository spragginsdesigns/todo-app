# Project: Todo App

@~/.claude/CLAUDE.md

---

## Project Context

**Stack:** Next.js 15 (App Router) + Supabase (PostgreSQL) + TypeScript + Tailwind CSS 4
**Repo:** https://github.com/spragginsdesigns/todo-app
**Year:** 2026

## Terminology

| Term | Meaning | Location |
|------|---------|----------|
| Inbox | Default project for uncategorized todos | `projects.is_default = true` |
| Priority | 1-4 scale (1=P1 highest, 4=P4 lowest) | `todos.priority` |
| Server Client | Async Supabase client for RSC/Actions | `src/lib/supabase/server.ts` |
| Browser Client | Sync Supabase client for Client Components | `src/lib/supabase/client.ts` |

## Project Structure

```
todo-app/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (dashboard)/  # Main app routes (inbox, today, upcoming, project)
│   │   └── actions/      # Server Actions
│   ├── components/       # React components
│   │   ├── layout/       # Sidebar, nav items
│   │   ├── projects/     # Project-related components
│   │   ├── todos/        # Todo CRUD components
│   │   └── ui/           # Radix UI primitives
│   ├── lib/
│   │   ├── supabase/     # Supabase clients & generated types
│   │   └── actions/      # Additional server actions
│   └── types/            # TypeScript types
├── supabase/
│   ├── config.toml       # CLI config
│   └── migrations/       # Database migrations
└── public/               # Static assets
```

## Development Commands

```bash
# Start dev server (Claude should NOT run this - assume it's running)
pnpm dev

# Type check / lint
pnpm lint

# Build for production
pnpm build

# Supabase CLI (run in PowerShell)
npx supabase migration new <name>       # Create migration
npx supabase db push                    # Push migrations
npx supabase gen types typescript --project-id kabgcmozfxmezmgoyzzq > src/lib/supabase/types.ts
```

## Project-Specific Rules

- **Server client MUST be awaited**: `const supabase = await createClient()`
- **Browser client is sync**: `const supabase = createClient()`
- **No authentication** - Single-user app with anon RLS policies
- **Inbox cannot be deleted** - Check `is_default` before delete
- **Always regenerate types after schema changes**
- **Use Server Actions for mutations** - Located in `src/app/actions/`

## Key Files

| Purpose | Path |
|---------|------|
| Main layout | `src/app/(dashboard)/layout.tsx` |
| Server Actions | `src/app/actions/todos.ts`, `src/lib/actions/projects.ts` |
| Database types | `src/lib/supabase/types.ts` |
| Supabase server | `src/lib/supabase/server.ts` |
| Supabase browser | `src/lib/supabase/client.ts` |
| Initial schema | `supabase/migrations/20260116090650_initial_schema.sql` |

## Supabase Details

See `SUPABASE_CONTEXT.md` for comprehensive Supabase integration docs including:
- Client setup patterns
- Database schema
- Query examples
- Migration workflow
