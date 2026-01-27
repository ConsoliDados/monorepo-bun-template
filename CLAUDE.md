# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application

```bash
# Run both backend (Elysia) and frontend (Vite SSR) concurrently
bun dev

# Run backend only (port 3333, blue logs)
bun dev:server

# Run frontend only (port 3000, green logs)
bun dev:web
```

### Code Quality

```bash
# Lint all workspaces
bun lint

# Format code with Biome
bun format

# Type-check all workspaces
bun typecheck
```

### Git Flow

This project uses git-flow. Start new features with:

```bash
git flow feature start <feature-name>
# Work on feature...
git flow feature finish <feature-name>
```

## Architecture Overview

### Monorepo Structure

**Apps:**
- `apps/server` - Elysia backend on Bun runtime (port 3333)
- `apps/web` - React + Vite with SSR using Hono (port 3000)

**Packages:**
- `packages/api` - Shared Zod schemas and TypeScript types
- `packages/config` - Shared Biome and TypeScript configurations
- `packages/ui` - Shared React components with Tailwind v4

**Communication Flow:**
```
Browser → Hono SSR (apps/web) → Server Actions → Elysia API (apps/server)
         ↓
    TanStack Router
         ↓
    TanStack Query
```

### Custom Server Actions System

**Critical:** This project implements a custom server actions pattern using a Vite plugin that is fundamentally different from Next.js or other frameworks.

#### How It Works

1. **File Convention**: Create files with `.server.ts` extension in `apps/web/src/routes/-actions/`
2. **Hash-Based Routing**: Each exported function gets a unique cryptographic hash (SHA-256, 12 chars)
3. **Virtual Modules**: The plugin exposes two virtual modules:
   - `virtual:server-actions-runtime` - Client-side `callServerAction()` function
   - `virtual:server-actions-manifest` - Server-side hash→metadata mapping

#### The Transform Process

**On Client (Browser):**
```typescript
// You write:
import { fetchTodos } from './-actions/todos-actions.server';
fetchTodos();

// Plugin transforms to:
import { callServerAction } from 'virtual:server-actions-runtime';
export async function fetchTodos(...args) {
  return callServerAction('a3f9d2b1c4e5', args); // Hash generated
}
```

**On Server:**
```typescript
// Handler receives:
{ actionHash: 'a3f9d2b1c4e5', args: [...] }

// Resolves via manifest:
manifest.actions['a3f9d2b1c4e5'] → {
  filePath: 'routes/-actions/todos-actions.server',
  functionName: 'fetchTodos'
}

// Dynamically imports and executes
```

#### Implementation Details

**Plugin Location:** `apps/web/plugins/server-actions.ts`

**Key Hooks:**
- `configResolved()` - Generates random salt once per Vite session
- `buildStart()` - Pre-scans all `.server.ts` files to populate manifest
- `transform()` - Transforms client imports to use hashes
- `load()` - Provides virtual module content

**Handler Location:** `apps/web/server/actions-handler.ts`

**Why Pre-Scan in buildStart()?**
The manifest must be fully populated BEFORE the server imports it. Without pre-scanning, the manifest would be empty when `actions-handler.ts` loads, causing "Invalid action hash" errors.

**Hash Generation:**
```typescript
hash = SHA256(filePath + functionName + salt).substring(0, 12)
```

**Security Benefits:**
- Obfuscated endpoints (no file paths exposed)
- Unique hashes prevent naming collisions
- Salt rotates per session/deploy
- Foundation for per-request authentication

### Dynamic API Loading

**Location:** `apps/web/server/api-loader.ts`

The API loader automatically registers routes from the `apps/web/server/api/` directory:

**File to Route Mapping:**
```
server/api/todos.ts         → /api/todos
server/api/users/[id].ts    → /api/users/:id
server/api/posts/index.ts   → /api/posts
```

**How It Works:**
1. Scans `server/api/` for `.ts` files
2. Converts file paths to route patterns (`[param]` → `:param`)
3. Dynamically imports each module
4. Mounts as Hono sub-router

**Adding New Endpoints:**
Simply create a new file in `server/api/` that exports a Hono app:

```typescript
// server/api/todos.ts
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.json({ todos: [] }));
app.post('/', (c) => c.json({ created: true }));

export default app;
```

### Environment Variables

This project uses TWO separate environment systems, both validated with Zod.

#### Server-Only (`env`)

**Import:** `import { env } from './lib/env'`
**Use:** Server actions, API routes, loaders (server-side only)
**Config:** `.env` without `VITE_` prefix

```typescript
// ✅ In server actions or API routes
import { env } from '../lib/env';
const data = await fetch(`${env.backendUrl}/api/data`);
```

**Available:**
- `env.frontendPort` (FRONTEND_PORT)
- `env.backendPort` (BACKEND_PORT)
- `env.frontendUrl` (FRONTEND_URL)
- `env.backendUrl` (BACKEND_URL)

#### Public/Client-Safe (`env.public`)

**Import:** `import { publicEnv } from './lib/env.public'`
**Use:** Client components, browser code
**Config:** `.env` with `VITE_` prefix

```typescript
// ✅ In client components
import { publicEnv } from '../lib/env.public';
const apiUrl = publicEnv.backendUrl; // From VITE_BACKEND_URL
```

**Key Point:** Variable names are auto-converted from `SNAKE_CASE` to `camelCase`.

**Router Context:**
Public env is also available via router context:

```typescript
const { env } = useRouteContext({ from: rootRouteId });
// env.backendUrl, env.frontendUrl, etc.
```

### SSR Architecture

**Build Strategy:** Dual-build approach (client + server bundles)

**Client Build:**
```bash
vite build --mode client
→ dist/client/ (static assets)
```

**Server Build:**
```bash
vite build --ssr
→ dist/server/ (Node-compatible bundle)
```

**Runtime:** Hono serves SSR'd HTML + hydrates with client bundle

**Entry Points:**
- `src/entry-client.tsx` - Browser entry (hydration)
- `src/entry-server.tsx` - Server entry (SSR rendering)

**Server Location:** `apps/web/server/node.ts` (production) or Vite dev server (development)

### Styling: Tailwind CSS v4

This project uses Tailwind v4 with CSS-first configuration (no `tailwind.config.js`).

**Global Styles:** `packages/ui/src/styles/globals.css`

**Key Directives:**
```css
@import "tailwindcss";
@source "../**/*.{ts,tsx}";  /* Scans for classes */
@theme inline { /* Design tokens */ }
```

**CSS Variables:**
- Defined in `:root` and `.dark` classes
- Mapped to Tailwind via `@theme inline`
- Used by shadcn/ui components

**PostCSS:** Uses `@tailwindcss/postcss` plugin (v4 only)

**shadcn/ui Integration:**
- Components in `packages/ui/src/components/`
- Can use CLI: `cd apps/web && bun dlx shadcn@latest add [component]`
- Components.json configured for monorepo structure

## Important Patterns

### Adding Server Actions

1. Create file in `apps/web/src/routes/-actions/[name]-actions.server.ts`
2. Export async functions
3. Use server-only `env` (not `publicEnv`)
4. Import and use in components with TanStack Query

```typescript
// -actions/users-actions.server.ts
import { env } from '../../../lib/env';

export async function fetchUsers() {
  const res = await fetch(`${env.backendUrl}/api/users`);
  return res.json();
}

// In component:
import { fetchUsers } from './-actions/users-actions.server';

const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers, // Calls server automatically
});
```

### Adding API Endpoints

1. Create file in `apps/web/server/api/[route].ts`
2. Export a Hono app
3. Routes auto-register (file path → URL path)

```typescript
// server/api/todos.ts
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.json({ todos: [] }));

export default app;
// → Available at /api/todos
```

### Adding Environment Variables

**Server-only:**
1. Add to `.env`: `NEW_VAR=value`
2. Add to `.env.example`: `NEW_VAR=`
3. Update `apps/web/lib/env.ts` schema:
```typescript
const envSchema = z.object({
  // ...
  newVar: z.string(),
});
```

**Public/client-safe:**
1. Add to `.env`: `VITE_NEW_VAR=value`
2. Add to `.env.example`: `VITE_NEW_VAR=`
3. Schema auto-updates (uses `import.meta.env`)

### Working with the UI Package

**Exports are granular:**
```typescript
import { Button } from '@monorepo/ui/components/button';
import { Card } from '@monorepo/ui/components/card';
import { cn } from '@monorepo/ui/lib/utils';
```

**Adding Components:**
1. Create in `packages/ui/src/components/[name].tsx`
2. Add export to `packages/ui/package.json`:
```json
"exports": {
  "./components/*": "./src/components/*.tsx"
}
```

## Key Technical Decisions

### Why Hash-Based Server Actions?

**Problem:** Function name collisions across files, security (exposed paths)

**Solution:** Cryptographic hashes with manifest

**Benefits:**
- Collision-free (same function name in different files works)
- Security layer (obfuscated endpoints)
- Foundation for per-client hashing (future)

### Why Dual Environment Systems?

**Problem:** Accidentally exposing secrets to browser

**Solution:** Separate `env` (server) and `env.public` (client) with Zod validation

**Benefits:**
- Type-safe at compile time
- Runtime validated with Zod
- Clear separation prevents leaks

### Why Elysia AND Hono?

**Elysia:** Backend API server (apps/server)
- Built for Bun runtime
- Type-safe routes and schemas
- Lightweight and fast

**Hono:** SSR runtime (apps/web)
- Universal (works in Node, Bun, Cloudflare Workers, etc.)
- Handles React SSR
- Serves static assets and API routes

They complement each other: Hono for SSR/frontend, Elysia for backend services.

### Why Bun Workspaces Over Turborepo?

**Simplicity:** Bun's native workspace support is sufficient for this scale

**Performance:** Bun is already fast; Turborepo caching less critical

**Native TypeScript:** No build step needed in development

**Note:** Can migrate to Turborepo if caching/orchestration becomes critical.

## Virtual Modules

This project uses Vite virtual modules for runtime-generated code:

### `virtual:server-actions-runtime`

**Provides:** `callServerAction(actionHash, args)` function

**Used by:** Client-side transformed `.server.ts` imports

**Type declarations:** `apps/web/src/vite-env.d.ts`

### `virtual:server-actions-manifest`

**Provides:** Hash-to-metadata mapping

**Used by:** `apps/web/server/actions-handler.ts`

**Structure:**
```typescript
{
  salt: string,
  actions: {
    [hash: string]: { filePath: string, functionName: string }
  }
}
```

**Important:** Manifest is populated in `buildStart()` hook before any imports.

## Critical Files

- `apps/web/plugins/server-actions.ts` - Server actions Vite plugin
- `apps/web/server/actions-handler.ts` - Server actions HTTP handler
- `apps/web/server/api-loader.ts` - Dynamic API route loader
- `apps/web/lib/env.ts` - Server-only environment (Zod validated)
- `apps/web/lib/env.public.ts` - Public environment (Zod validated)
- `apps/web/src/vite-env.d.ts` - Virtual module type declarations
- `packages/ui/src/styles/globals.css` - Tailwind v4 configuration

## Deployment Targets

The web app supports multiple platforms via adapters:

```bash
bun run build:vercel      # Vercel
bun run build:netlify     # Netlify Functions
bun run build:cloudflare  # Cloudflare Workers
bun run build:docker      # Docker container
```

Each uses the same SSR architecture with platform-specific server files.
