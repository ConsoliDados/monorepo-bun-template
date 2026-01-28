# Bun Monorepo with React SSR & Server Functions

> Full-stack monorepo with Bun, React, Vite, TanStack Router, Server-Side Rendering, and Server Functions

## 🚀 Features

- ⚡ **Bun** - Fast runtime and package manager
- 🎨 **React 18** with Server-Side Rendering (SSR)
- 🗂️ **Monorepo** architecture with workspaces
- 🔥 **Vite** for blazing fast HMR
- 🛣️ **TanStack Router** with file-based routing
- 🌐 **Server Functions** - Next.js-like server actions pattern
- 🔒 **Middleware** - Route protection and request interception
- 📊 **TanStack Query** for data fetching and caching
- 🎯 **TypeScript** native execution (no build needed in dev)
- 🎨 **Tailwind CSS** + **shadcn/ui** components
- 🔍 **Biome** for linting and formatting
- ✅ **Zod** for environment variable validation
- 🚢 **Deploy ready** - Vercel, Netlify, Cloudflare Workers

## 📦 Project Structure

```
monorepo-bun/
├── apps/
│   ├── server/          # Backend with Hono + Bun
│   └── web/             # Frontend with React + Vite SSR
├── packages/
│   ├── api/             # Shared schemas, types, utils
│   ├── config/          # Shared configs (Biome, TypeScript)
│   └── ui/              # Shared React components
└── package.json         # Root workspace config
```

## 🏃 Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.2.0

### Installation

```bash
# Clone the repository
git clone <your-repo>
cd monorepo-bun

# Install dependencies
bun install
```

### Development

#### Option 1: Run everything together (recommended)

```bash
bun dev
```

This starts both:
- **Backend** (Hono) at `http://localhost:3333` - logs in **blue**
- **Frontend** (React + Vite SSR) at `http://localhost:3000` - logs in **green**

#### Option 2: Run separately

```bash
# Terminal 1 - Backend
bun dev:server

# Terminal 2 - Frontend
bun dev:web
```

### Build for Production

```bash
# Build web app
cd apps/web
bun run build

# Preview production build
bun run preview
```

## 📚 Packages

### @monorepo/config

Shared configurations for Biome and TypeScript.

**Exports:**
- `@monorepo/config/biome` - Biome configuration
- `@monorepo/config/tsconfig-base` - Base TypeScript config
- `@monorepo/config/tsconfig-node` - Config for Node/Bun
- `@monorepo/config/tsconfig-react` - Config for React

### @monorepo/api

Shared backend modules (schemas, types, utils).

**Exports:**
- `@monorepo/api` - Everything
- `@monorepo/api/schemas` - Just schemas
- `@monorepo/api/utils` - Just utils

**Example:**
```typescript
import type { User } from '@monorepo/api/schemas'
import { formatDate } from '@monorepo/api/utils'
```

### @monorepo/ui

Shared React components with Tailwind CSS.

**Exports:**
- `@monorepo/ui` - Everything
- `@monorepo/ui/button` - Button component
- `@monorepo/ui/card` - Card components

**Example:**
```tsx
import { Button } from '@monorepo/ui'
import { Card, CardHeader, CardTitle } from '@monorepo/ui/card'
```

## 🌐 Server Functions

This project implements a Next.js-like server functions pattern using `.server.ts` files.

### How it works

1. Create a file with `.server.ts` extension
2. Export async functions
3. Import and use them in your components

**Example:**

```typescript
// src/routes/-actions/todos.server.ts
export async function fetchTodos() {
  const response = await fetch(`${env.frontendUrl}/api/todos`);
  return response.json();
}

// src/routes/page.tsx
import { fetchTodos } from './-actions/todos.server';

function Page() {
  const { data } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos, // Automatically calls server!
  });
}
```

The Vite plugin automatically:
- Detects `.server.ts` files
- Transforms them to fetch calls on the client
- Executes them on the server

## 🔒 Middleware

Protect routes and intercept requests with Next.js-style middleware.

**Quick Example:**

```typescript
// apps/web/src/middleware.ts
import { getCookie } from "hono/cookie";
import type { MiddlewareConfig, MiddlewareHandler } from "../server/middleware/types";

export const config: MiddlewareConfig = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};

export const middleware: MiddlewareHandler = async (c, next) => {
  const authSession = getCookie(c, "auth-session");

  if (!authSession) {
    return c.redirect("/");
  }

  await next();
};
```

**Features:**
- File-based middleware (`src/middleware.ts`)
- Flexible pattern matching (glob, regex, arrays)
- Lazy loading for optimal performance
- Full TypeScript support

**Learn More:** See [apps/web/server/middleware/docs](apps/web/server/middleware/docs/README.md) for complete documentation.

## 🔧 Environment Variables

This project uses two separate environment systems, both validated with Zod for type-safety and runtime validation.

### `env` - Server-Only Variables

**Use ONLY in server-side code** (API routes, server actions, loaders on server). These variables are **NOT exposed to the browser**.

```typescript
import { env } from './lib/env';

// ✅ Use in server-side code
export async function fetchData() {
  const response = await fetch(`${env.backendUrl}/api/data`);
  return response.json();
}
```

**Configure in `.env`:**
```bash
FRONTEND_PORT=3000
BACKEND_PORT=3333
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3333
```

**Examples:** Database URLs, API secrets, server ports

### `env.public` - Public Variables (Client-Safe)

**Safe to expose to the browser**. Use in client components, pages, or anywhere that runs in the browser.

**Can be used on server?** Yes, but **NOT recommended** - use `env` instead for server-side code.

```typescript
import { publicEnv } from './lib/env.public';

// ✅ Use in client components
function MyComponent() {
  const apiUrl = publicEnv.backendUrl;
  return <div>API: {apiUrl}</div>;
}
```

**Configure in `.env` with `VITE_` prefix:**
```bash
VITE_FRONTEND_URL=http://localhost:3000
VITE_BACKEND_URL=http://localhost:3333
VITE_API_VERSION=v1
```

Variables are automatically converted: `VITE_API_VERSION` → `publicEnv.apiVersion` (camelCase)

**Examples:** Public API endpoints, feature flags, client-safe configuration

### Quick Decision Guide

| Use Case | Use This | Import From |
|----------|----------|-------------|
| Server actions, API routes, SSR loaders | `env` | `./lib/env` |
| Client components, browser code | `env.public` | `./lib/env.public` |
| Secrets (database, API keys) | `env` | `./lib/env` |
| Public configuration | `env.public` | `./lib/env.public` |

### Learn More

- **[ENV_USAGE.md](apps/web/lib/ENV_USAGE.md)** - Complete usage guide
- **[ADDING_ENV_VARS.md](apps/web/lib/ADDING_ENV_VARS.md)** - How to add new variables

## 🛠️ Commands

```bash
# Development
bun dev              # Run all apps
bun dev:server       # Run backend only
bun dev:web          # Run frontend only

# Code Quality
bun lint             # Lint all packages
bun format           # Format code with Biome
bun typecheck        # Type-check all packages

# Build
cd apps/web && bun run build    # Build web app
```

## 📝 Adding shadcn/ui Components

1. Go to https://ui.shadcn.com/
2. Choose a component
3. Copy code to `packages/ui/src/components/[name].tsx`
4. Add export to `packages/ui/src/index.ts`
5. Add export to `packages/ui/package.json`:

```json
"exports": {
  "./[name]": "./src/components/[name].tsx"
}
```

## 🚢 Deployment

### Vercel

```bash
cd apps/web
bun run build:vercel
```

### Netlify

```bash
cd apps/web
bun run build:netlify
```

### Cloudflare Workers

```bash
cd apps/web
bun run build:cloudflare
```

## 🐛 Troubleshooting

### Port already in use

```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9
lsof -ti:3333 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### TypeScript errors

```bash
# Clean and reinstall
rm -rf node_modules bun.lock
bun install

# Type-check all packages
bun typecheck
```

### Hot reload not working

Make sure you're using Bun >= 1.2.0:

```bash
bun --version
```

## 🎯 Next Steps

- [ ] Add more shadcn/ui components
- [ ] Create Zod validation schemas in `packages/api`
- [ ] Add database (Drizzle ORM + PostgreSQL)
- [ ] Implement authentication
- [ ] Add tests (Bun test)

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
