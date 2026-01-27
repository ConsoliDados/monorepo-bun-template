# Environment Variables Usage Guide

This project uses a multi-layered approach with **Zod validation** to handle environment variables safely and efficiently across server and client contexts.

## Overview

We have two environment configuration files, both validated with Zod:

1. **`lib/env.ts`** - Server-only environment variables (validated with Zod)
2. **`lib/env.public.ts`** - Public environment variables (validated with Zod, safe for browser)

## Server-Only Variables (`lib/env.ts`)

Use these **only in server-side code** (loaders, server actions, API routes):

```typescript
import { env } from "../lib/env";

// Access validated, type-safe environment variables
const port = env.frontendPort;
const backendUrl = env.backendUrl;
```

### Available server variables:
- `env.frontendUrl` - Frontend URL
- `env.backendUrl` - Backend URL
- `env.frontendPort` - Frontend port
- `env.backendPort` - Backend port
- `env.nodeEnv` - Node environment (development/production/test)

## Public Variables (`lib/env.public.ts`)

**Validated with Zod schema** - Type-safe and runtime validated!

Use these **in any code** (client components, loaders, server actions):

### Available public variables:
- `publicEnv.frontendUrl` - Frontend URL (validated as URL)
- `publicEnv.backendUrl` - Backend URL (validated as URL)
- `publicEnv.nodeEnv` - Node environment (enum: development/production/test)

### Method 1: Direct Import (Server & Client)

```typescript
import { publicEnv } from "../lib/env.public";

export async function fetchData() {
  // Type-safe and validated at runtime
  const response = await fetch(`${publicEnv.backendUrl}/api/data`);
  return response.json();
}
```

### Method 2: Router Context (Components Only)

Access via TanStack Router context in components:

```typescript
import { rootRouteId, useRouteContext } from "@tanstack/react-router";

function MyComponent() {
  const { env } = useRouteContext({ from: rootRouteId });

  return <div>Backend: {env.backendUrl}</div>;
}
```

### Method 3: Vite Environment Variables

Use Vite's built-in env vars (prefix with `VITE_`):

```typescript
// Access in client code
const backendUrl = import.meta.env.VITE_BACKEND_URL;
```

## Configuration Files

### `.env` file:

```bash
# Server-side only
BACKEND_PORT=3333
FRONTEND_PORT=3000
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3333

# Client-side accessible (prefixed with VITE_)
VITE_FRONTEND_URL=http://localhost:3000
VITE_BACKEND_URL=http://localhost:3333
```

### `vite.config.ts`:

Environment variables are injected at build time using Vite's `define` option:

```typescript
define: {
  __BACKEND_URL__: JSON.stringify(env.backendUrl),
  __FRONTEND_URL__: JSON.stringify(env.frontendUrl),
  __NODE_ENV__: JSON.stringify(env.nodeEnv),
}
```

## How It Works

### Build Time Injection

1. **Vite `define`**: Replaces global constants like `__BACKEND_URL__` with actual values
2. **VITE_ prefix**: Vite automatically injects `VITE_*` variables into `import.meta.env`

### Runtime Resolution

The `getPublicEnv()` function tries multiple sources in order:

1. `import.meta.env.VITE_*` (Vite injected)
2. `__*__` global constants (vite.config define)
3. `process.env.*` (SSR only)
4. Fallback defaults

### SSR vs CSR

- **Server (SSR)**: Has access to `process.env`
- **Client (CSR)**: Only has access to injected variables

## Best Practices

### ✅ DO

```typescript
// ✅ Use publicEnv in server actions
import { publicEnv } from "../lib/env.public";
export async function myServerAction() {
  fetch(`${publicEnv.backendUrl}/api/data`);
}

// ✅ Use router context in components
import { rootRouteId, useRouteContext } from "@tanstack/react-router";
function Component() {
  const { env } = useRouteContext({ from: rootRouteId });
  return <div>{env.backendUrl}</div>;
}

// ✅ Use env.ts in API routes
import { env } from "./lib/env";
export function createServer() {
  return serve({ port: env.frontendPort });
}
```

### ❌ DON'T

```typescript
// ❌ Don't use process.env in client code
function Component() {
  const url = process.env.BACKEND_URL; // undefined in browser!
}

// ❌ Don't use env.ts in client code
import { env } from "./lib/env"; // May cause errors in browser

// ❌ Don't expose secrets via VITE_ prefix
VITE_DATABASE_PASSWORD=secret123 // Exposed to browser!
```

## Adding New Environment Variables

### For Server-Only:

1. Add to `.env`:
   ```bash
   MY_SECRET=value123
   ```

2. Add to `lib/env.ts` schema:
   ```typescript
   const envSchema = z.object({
     mySecret: z.string(),
     // ...
   });
   ```

### For Public (Client-Accessible):

**With Automatic Conversion** (Recommended):

1. Add to `.env` with `VITE_` prefix:
   ```bash
   VITE_API_KEY=public-key-123
   ```

2. **That's it!** The variable is automatically:
   - Filtered (only `VITE_*` variables)
   - Converted to camelCase: `apiKey`
   - Available as `publicEnv.apiKey`
   - Allowed via `.passthrough()` in schema

**Optional: Add Custom Validation**

If you want stricter validation (URL, enum, etc.):

1. Add validation to `lib/env.public.ts` schema:
   ```typescript
   const publicEnvSchema = z.object({
     // ... existing fields
     apiKey: z.string().min(10), // Add validation
   }).passthrough();
   ```

**See [`ADDING_ENV_VARS.md`](./ADDING_ENV_VARS.md) for complete guide on adding variables.**

## Debugging

Use the `<EnvDebug />` component to see current environment values:

```typescript
import { EnvDebug } from "../components/EnvDebug";

function Page() {
  return (
    <div>
      <EnvDebug />
    </div>
  );
}
```

## Summary

- **Server-only**: Use `env` from `lib/env.ts`
- **Universal**: Use `publicEnv` from `lib/env.public.ts`
- **Components**: Use `useRouterContext().env`
- **Never**: Use `process.env` in client code
- **Secrets**: Never prefix with `VITE_`
