# Web App

React application with Server-Side Rendering (SSR) using Vite, TanStack Router, and Hono.

## Features

- ⚡ **Vite** - Fast HMR and build tool
- 🎨 **React 18** with SSR
- 🛣️ **TanStack Router** - Type-safe file-based routing
- 🌐 **Server Functions** - Custom server actions with hash-based security
- 🔒 **Middleware** - Route protection and request interception
- 📊 **TanStack Query** - Data fetching and caching
- 🎨 **Tailwind CSS v4** - Utility-first styling
- 🧩 **shadcn/ui** - Beautiful, accessible components

## Quick Start

```bash
# Development
bun dev

# Build
bun run build

# Preview production build
bun run preview
```

## Middleware

Protect routes and intercept requests with file-based middleware.

### Basic Usage

Create `src/middleware.ts`:

```typescript
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

### Configuration

The `config` object specifies which routes the middleware should run on:

```typescript
export const config: MiddlewareConfig = {
  matcher: [
    "/dashboard",           // Exact match
    "/dashboard/:path*",    // Wildcard match
    "/api/admin/:path*",    // Multiple patterns
  ],
};
```

### Pattern Matching

**Simple paths:**
```typescript
matcher: "/dashboard"  // Matches /dashboard only
```

**Wildcard segments:**
```typescript
matcher: "/dashboard/:path*"  // Matches /dashboard/anything
```

**Multiple patterns:**
```typescript
matcher: ["/dashboard/:path*", "/profile/:path*"]
```

**Regular expressions:**
```typescript
matcher: /^\/api\/(?!public).*/  // All /api/* except /api/public/*
```

**Negation:**
```typescript
matcher: "!/api/:path*"  // All routes EXCEPT /api/*
```

### Advanced Examples

**Role-based access:**

```typescript
export const middleware: MiddlewareHandler = async (c, next) => {
  const userRole = getCookie(c, "user-role");

  if (userRole !== "admin") {
    return c.text("Forbidden", 403);
  }

  await next();
};
```

**Custom headers:**

```typescript
export const middleware: MiddlewareHandler = async (c, next) => {
  c.header("X-Custom-Header", "value");
  await next();
};
```

**Request logging:**

```typescript
export const middleware: MiddlewareHandler = async (c, next) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.path}`);
  await next();
};
```

### Documentation

For complete documentation, see [server/middleware/docs/README.md](./server/middleware/docs/README.md).

## Server Functions

Create server-only functions with `.server.ts` files:

```typescript
// src/routes/-actions/todos-actions.server.ts
import { env } from "../../../lib/env";

export async function fetchTodos() {
  const response = await fetch(`${env.backendUrl}/api/todos`);
  return response.json();
}

// Use in components
import { fetchTodos } from "./-actions/todos-actions.server";

const { data } = useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,  // Automatically runs on server
});
```

## Environment Variables

See the [root README.md](../../README.md#-environment-variables) for the complete guide on environment variables.

**Quick Reference:**

- **Server-only:** Import from `./lib/env` (no `VITE_` prefix)
- **Client-safe:** Import from `./lib/env.public` (with `VITE_` prefix)

## Project Structure

```
apps/web/
├── src/
│   ├── routes/              # TanStack Router routes
│   │   ├── __root.tsx       # Root layout
│   │   ├── index.tsx        # Home page
│   │   └── -actions/        # Server actions
│   ├── components/          # React components
│   ├── middleware.ts        # Route middleware
│   ├── entry-client.tsx     # Client entry point
│   └── entry-server.tsx     # Server entry point (SSR)
├── server/
│   ├── api/                 # API routes (auto-loaded)
│   ├── middleware/          # Middleware system
│   ├── actions-handler.ts   # Server actions handler
│   ├── api-loader.ts        # Dynamic API loader
│   ├── hono-base.ts         # Base Hono app
│   ├── node.ts              # Node.js adapter
│   └── cloudflare.ts        # Cloudflare Workers adapter
├── plugins/
│   └── server-actions.ts    # Vite plugin for server actions
└── lib/
    ├── env.ts               # Server-only environment
    └── env.public.ts        # Public environment
```

## Deployment

### Vercel

```bash
bun run build:vercel
```

### Netlify

```bash
bun run build:netlify
```

### Cloudflare Workers

```bash
bun run build:cloudflare
```

### Docker

```bash
bun run build:docker
docker build -t web-app .
docker run -p 3000:3000 web-app
```

## Learn More

- [TanStack Router Docs](https://tanstack.com/router)
- [TanStack Query Docs](https://tanstack.com/query)
- [Hono Docs](https://hono.dev)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
