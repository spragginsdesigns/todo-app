# Supabase Integration Context for Claude Code

This document provides context for AI assistants working on this project. Read this before making any database-related changes.

---

## Project Overview

This is a Todoist-inspired todo app using:
- **Next.js 15** (App Router)
- **Supabase** (PostgreSQL database)
- **TypeScript** with generated types

---

## Supabase Client Setup

### Two Clients (IMPORTANT)

This project uses the `@supabase/ssr` package with **two separate clients**:

1. **Browser Client** (`src/lib/supabase/client.ts`)
   - Use in Client Components (`'use client'`)
   - Import: `import { createClient } from '@/lib/supabase/client'`

2. **Server Client** (`src/lib/supabase/server.ts`)
   - Use in Server Components, Server Actions, Route Handlers
   - Import: `import { createClient } from '@/lib/supabase/server'`
   - **MUST be awaited**: `const supabase = await createClient()`

### Usage Examples

**Server Component:**
```typescript
import { createClient } from '@/lib/supabase/server'

export default async function TodosPage() {
  const supabase = await createClient()

  const { data: todos, error } = await supabase
    .from('todos')
    .select('*, projects(*)')
    .order('created_at', { ascending: false })

  if (error) throw error

  return <TodoList todos={todos} />
}
```

**Client Component:**
```typescript
'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { Todo } from '@/lib/supabase/types'

export function TodoList() {
  const supabase = createClient()
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    async function loadTodos() {
      const { data } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })

      setTodos(data || [])
    }
    loadTodos()
  }, [supabase])

  return <div>{/* render todos */}</div>
}
```

**Server Action:**
```typescript
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { TodoInsert } from '@/lib/supabase/types'

export async function createTodo(todo: TodoInsert) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('todos')
    .insert(todo)

  if (error) throw error

  revalidatePath('/')
}
```

---

## Database Schema

### Tables

**projects**
| Column | Type | Default | Notes |
|--------|------|---------|-------|
| id | UUID | gen_random_uuid() | Primary key |
| name | TEXT | - | Required |
| color | TEXT | '#6b7280' | Hex color |
| is_default | BOOLEAN | FALSE | TRUE = Inbox (cannot delete) |
| created_at | TIMESTAMPTZ | NOW() | |
| updated_at | TIMESTAMPTZ | NOW() | |

**todos**
| Column | Type | Default | Notes |
|--------|------|---------|-------|
| id | UUID | gen_random_uuid() | Primary key |
| title | TEXT | - | Required |
| description | TEXT | NULL | Optional |
| completed | BOOLEAN | FALSE | |
| priority | INTEGER | 4 | 1-4 (1=highest, 4=lowest) |
| due_date | DATE | NULL | Optional |
| project_id | UUID | NULL | FK → projects.id (ON DELETE SET NULL) |
| created_at | TIMESTAMPTZ | NOW() | |
| updated_at | TIMESTAMPTZ | NOW() | |

### Indexes
- `idx_todos_project` on todos(project_id)
- `idx_todos_due_date` on todos(due_date)
- `idx_todos_completed` on todos(completed)

### Row Level Security (RLS)
- RLS is **enabled** on both tables
- Policies allow **full access for anon role** (single-user app, no auth)
- The `anon` key in `.env.local` has full CRUD access

---

## TypeScript Types

Types are auto-generated from the database. Located at: `src/lib/supabase/types.ts`

**Convenience types available:**
```typescript
import type {
  Project, ProjectInsert, ProjectUpdate,
  Todo, TodoInsert, TodoUpdate,
  TodoWithProject
} from '@/lib/supabase/types'
```

---

## Supabase CLI Commands

The Supabase CLI is installed and configured. **Use PowerShell for CLI commands on Windows.**

### Common Commands

```powershell
# Check migration status
npx supabase migration list

# Create a new migration
npx supabase migration new <migration_name>

# Push migrations to remote database
npx supabase db push

# Regenerate TypeScript types after schema changes
npx supabase gen types typescript --project-id kabgcmozfxmezmgoyzzq > src/lib/supabase/types.ts

# Pull remote schema changes (if made in dashboard)
npx supabase db pull
```

### Workflow for Schema Changes

1. **Create migration:**
   ```powershell
   npx supabase migration new add_labels_table
   ```

2. **Edit the generated SQL file** in `supabase/migrations/`

3. **Push to remote:**
   ```powershell
   npx supabase db push
   ```

4. **Regenerate types:**
   ```powershell
   npx supabase gen types typescript --project-id kabgcmozfxmezmgoyzzq > src/lib/supabase/types.ts
   ```

5. **Verify build:**
   ```bash
   pnpm build
   ```

---

## Environment Variables

Located in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://kabgcmozfxmezmgoyzzq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable_key>
```

The `NEXT_PUBLIC_` prefix exposes these to the browser (required for client-side queries).

---

## Project Structure

```
todo-app/
├── .env.local                    # Supabase credentials
├── supabase/
│   ├── config.toml               # CLI config (Postgres 17)
│   └── migrations/
│       └── 20260116090650_initial_schema.sql
├── src/
│   ├── app/                      # Next.js App Router pages
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser client
│   │   │   ├── server.ts         # Server client
│   │   │   └── types.ts          # Generated DB types
│   │   └── utils.ts              # cn() helper
│   └── middleware.ts             # SSR session handling
```

---

## Common Query Patterns

### Fetch todos with project relation
```typescript
const { data } = await supabase
  .from('todos')
  .select('*, projects(*)')
  .order('created_at', { ascending: false })
```

### Fetch todos for Today view
```typescript
const today = new Date().toISOString().split('T')[0]
const { data } = await supabase
  .from('todos')
  .select('*, projects(*)')
  .eq('due_date', today)
  .eq('completed', false)
```

### Fetch todos for a specific project
```typescript
const { data } = await supabase
  .from('todos')
  .select('*')
  .eq('project_id', projectId)
  .order('created_at', { ascending: false })
```

### Fetch Inbox (default project)
```typescript
const { data: inbox } = await supabase
  .from('projects')
  .select('*')
  .eq('is_default', true)
  .single()
```

### Insert a todo
```typescript
const { error } = await supabase
  .from('todos')
  .insert({
    title: 'Buy groceries',
    priority: 2,
    project_id: inboxId
  })
```

### Update a todo
```typescript
const { error } = await supabase
  .from('todos')
  .update({ completed: true, updated_at: new Date().toISOString() })
  .eq('id', todoId)
```

### Delete a todo
```typescript
const { error } = await supabase
  .from('todos')
  .delete()
  .eq('id', todoId)
```

---

## Important Notes

1. **Server client must be awaited** - `await createClient()` not `createClient()`

2. **No authentication** - This is a single-user app. RLS policies allow anon access.

3. **Inbox project** - There's a default project with `is_default = true`. Tasks without a project go here. It cannot be deleted.

4. **Priority values** - 1 = P1 (highest/red), 2 = P2 (orange), 3 = P3 (blue), 4 = P4 (gray/default)

5. **After schema changes** - Always regenerate types and run `pnpm build` to verify

6. **Windows CLI** - Use `powershell.exe -Command "npx supabase ..."` or run directly in PowerShell terminal

---

## Quick Reference

| Task | Command/Import |
|------|----------------|
| Browser client | `import { createClient } from '@/lib/supabase/client'` |
| Server client | `import { createClient } from '@/lib/supabase/server'` |
| Types | `import type { Todo, Project } from '@/lib/supabase/types'` |
| New migration | `npx supabase migration new <name>` |
| Push migrations | `npx supabase db push` |
| Regenerate types | `npx supabase gen types typescript --project-id kabgcmozfxmezmgoyzzq > src/lib/supabase/types.ts` |
