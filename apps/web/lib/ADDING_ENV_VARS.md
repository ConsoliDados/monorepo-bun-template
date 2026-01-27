# How to Add New Environment Variables

This guide explains how to add new public environment variables to the project with automatic type-safety and validation.

## Quick Start

### Adding a Simple Variable (No Validation)

1. **Add to `.env` with `VITE_` prefix**:
   ```bash
   VITE_API_VERSION=v1.0.0
   ```

2. **That's it!** The variable is automatically:
   - ✅ Converted to camelCase: `apiVersion`
   - ✅ Available in `publicEnv.apiVersion`
   - ✅ Shown in `<EnvDebug />` component
   - ✅ Type-safe (as `string`)

### Adding a Variable with Custom Validation

If you want stricter validation, recomended,(URL, enum, number, etc.):

1. **Add to `.env`**:
   ```bash
   VITE_API_URL=https://api.example.com
   ```

2. **Add validation to schema** in `lib/env.public.ts`:
   ```typescript
   const publicEnvSchema = z
     .object({
       frontendUrl: z.string().url().default("http://localhost:3000"),
       backendUrl: z.string().url().default("http://localhost:3333"),
       nodeEnv: z.enum(["development", "production", "test"]).default("development"),

       // Add your new field with validation
       apiUrl: z.string().url(), // Validates it's a proper URL
     })
     .passthrough();
   ```

3. **Done!** Now `publicEnv.apiUrl` is validated as a URL.

## How It Works

### 1. Automatic Conversion

The `envToObject()` function automatically:
- Filters only `VITE_*` prefixed variables
- Converts to camelCase: `VITE_API_VERSION` → `apiVersion`
- Makes them available in the `publicEnv` object

### 2. Zod Validation

The schema validates defined fields and allows extras via `.passthrough()`:

```typescript
const publicEnvSchema = z
  .object({
    // Explicitly defined with validation
    frontendUrl: z.string().url(),
    // ... other validated fields
  })
  .passthrough(); // Allows extra VITE_* variables
```

### 3. Type Safety

TypeScript infers types from the schema:
```typescript
export type PublicEnv = z.infer<typeof publicEnvSchema>;

// Result:
// publicEnv.frontendUrl: string (validated URL)
// publicEnv.apiVersion: string (passthrough)
```

## Examples

### Example 1: Feature Flag (No Validation Needed)

**.env**:
```bash
VITE_FEATURE_NEW_UI=true
```

**Usage**:
```typescript
import { publicEnv } from "./lib/env.public";

if (publicEnv.featureNewUi === "true") {
  // Show new UI
}
```

### Example 2: API Version with Enum Validation

**.env**:
```bash
VITE_API_VERSION=v2
```

**lib/env.public.ts**:
```typescript
const publicEnvSchema = z
  .object({
    // ... existing fields
    apiVersion: z.enum(["v1", "v2", "v3"]).default("v1"),
  })
  .passthrough();
```

**Usage**:
```typescript
import { publicEnv } from "./lib/env.public";

// Type: "v1" | "v2" | "v3"
const version = publicEnv.apiVersion;
```

### Example 3: Multiple Related Variables

**.env**:
```bash
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
VITE_STRIPE_WEBHOOK_URL=https://example.com/webhook
```

**Usage** (no schema changes needed):
```typescript
import { publicEnv } from "./lib/env.public";

const stripe = Stripe(publicEnv.stripePublicKey);
```

## Variable Naming Convention

### Environment Variable (in .env)
- Use `VITE_` prefix (required for client exposure)
- Use SCREAMING_SNAKE_CASE: `VITE_MY_VARIABLE`

### Resulting Property (in code)
- Automatically converted to camelCase: `myVariable`
- Access via: `publicEnv.myVariable`

## Examples of Conversion

| .env Variable | Resulting Property |
|--------------|-------------------|
| `VITE_API_URL` | `publicEnv.apiUrl` |
| `VITE_FEATURE_FLAG` | `publicEnv.featureFlag` |
| `VITE_MAX_RETRIES` | `publicEnv.maxRetries` |
| `VITE_IS_PRODUCTION` | `publicEnv.isProduction` |

## Debugging

Use the `<EnvDebug />` component to see all available variables:

```tsx
import { EnvDebug } from "../components/EnvDebug";

function Page() {
  return (
    <div>
      <EnvDebug />
    </div>
  );
}
```

This component automatically shows all environment variables without needing updates.

## Advanced: Custom Type Definitions

If you need stronger TypeScript types for passthrough variables, extend the type:

```typescript
// In your code file
import type { PublicEnv } from "./lib/env.public";

interface ExtendedEnv extends PublicEnv {
  apiVersion: "v1" | "v2" | "v3";
  featureFlag: boolean;
}

const env = publicEnv as ExtendedEnv;
```

## Best Practices

### ✅ DO
- Use `VITE_` prefix for client-safe variables
- Use camelCase when accessing: `publicEnv.apiUrl`
- Add validation for URLs, enums, numbers
- Use defaults in schema for optional vars

### ❌ DON'T
- Don't expose secrets via `VITE_` prefix
- Don't use `process.env` directly in client code
- Don't hardcode env values in code
- Don't skip validation for critical values

## Summary

**To add a new variable:**
1. Add `VITE_YOUR_VAR=value` to `.env`
2. (Optional) Add validation to schema if needed
3. Use `publicEnv.yourVar` in your code

**The component and types update automatically!** 🎉
