# Bun Monorepo with React SSR & Server Functions

> Full-stack monorepo with Bun, React, Vite, TanStack Router, Server-Side Rendering, and Server Functions

## 🚀 Features

- ⚡ **Bun** - Fast runtime and package manager
- 🎨 **React 18** with Server-Side Rendering (SSR)
- 🗂️ **Monorepo** architecture with workspaces
- 🔥 **Vite** for blazing fast HMR
- 🛣️ **TanStack Router** with file-based routing
- 🌐 **Server Functions** - Next.js-like server actions pattern
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

## 🔧 Environment Variables

Environment variables are validated using Zod. Configure them in `.env`:

```bash
# Server Ports
FRONTEND_PORT=3000
BACKEND_PORT=3333

# API URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3333
```

Access them type-safely:

```typescript
import { env } from './lib/env';

console.log(env.frontendUrl);  // Type-safe and validated!
```

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
