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

## Development Workflow

### Branch Management

**Critical Rules:**
- **NEVER develop directly on the `dev` branch**
- Always create a new feature branch for any development work
- Use git-flow for structured branch management

**Moving Changes from dev to New Branch:**
If you accidentally made changes on `dev`:

```bash
# Analyze the changed files to determine appropriate branch name
git status

# Create and switch to new feature branch (keeps changes)
git checkout -b feature/<descriptive-name>

# Verify changes are in the new branch
git status
```

### Commit Guidelines

**Conventional Commits Format:**
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`

**Important:** Only commit when explicitly requested by the user. Never commit automatically after completing a task.

**Examples:**
```bash
git commit -m "feat(server): add user authentication endpoint"
git commit -m "fix(web): resolve hydration mismatch in TodoList"
git commit -m "docs: update CLAUDE.md with workflow guidelines"
```

**When Asked to Commit on dev Branch:**
When the user requests a commit and you detect changes are on the `dev` branch, you MUST:

1. Analyze the changed files to determine an appropriate branch name
2. Inform the user: "Following the directive to never commit directly on `dev`, I will move these changes to a new feature branch."
3. Suggest a descriptive branch name based on the changes (e.g., `feature/update-claude-docs`, `fix/server-action-hash`, `docs/expand-guidelines`)
4. Ask: "Would you like to use this branch name, or would you prefer to suggest a different name?"
5. Wait for confirmation before proceeding
6. Move to the new branch and then commit

**Example:**
```
Following the directive to never commit directly on `dev`, I will move these changes to a new feature branch.

Based on the changes (updates to CLAUDE.md and .gitignore), I suggest: `docs/expand-development-guidelines`

Would you like to use this branch name, or would you prefer to suggest a different name?
```

**DO NOT:**
- Ask "would you like to move to a new branch?" (just do it)
- Commit on dev even if user seems to want it
- Skip the branch name confirmation step

### RPA Methodology (Research, Plan, Act)

This project follows the **RPA pattern** for all development tasks:

1. **Research**: Investigate the codebase, understand context, gather requirements
2. **Plan**: Create a structured plan, break down complex tasks
3. **Act**: Execute the plan step by step

**Critical: ALWAYS Return to Plan Mode**

After completing ANY task (code changes, commits, file operations, research, etc.), you MUST:
1. Summarize what was completed
2. Return to plan mode immediately
3. Wait for user confirmation before proceeding with next steps

This applies to ALL tasks without exception:
- After making code edits
- After running commits
- After file operations
- After research/exploration
- After ANY instruction execution

**DO NOT:**
- Continue with additional work without returning to plan mode
- Assume the user wants you to proceed
- Wait for the user to manually enable plan mode

**Example:**
After completing a commit:
```
✅ Commit completed successfully on branch `docs/expand-development-guidelines`.

[Entering plan mode]

What would you like to do next?
```

**Benefits:**
- Ensures alignment with user expectations
- Prevents scope creep
- Allows for course correction
- Maintains clear communication
- User maintains full control of workflow

## Code Quality Standards

### Design Principles

This project adheres to industry-standard software engineering principles:

**SOLID Principles:**
- Single Responsibility Principle
- Open/Closed Principle
- Liskov Substitution Principle
- Interface Segregation Principle
- Dependency Inversion Principle

**Other Key Principles:**
- **KISS** (Keep It Simple, Stupid) - Favor simplicity over complexity
- **DRY** (Don't Repeat Yourself) - Avoid code duplication
- **YAGNI** (You Aren't Gonna Need It) - Don't add functionality until necessary
- **Separation of Concerns** - Isolate different aspects of functionality

### Design Patterns

Apply appropriate design patterns when they solve real problems:

**Common Patterns in This Project:**
- **Factory Pattern** - Server actions creation, route loading
- **Observer Pattern** - TanStack Query reactive state
- **Adapter Pattern** - Platform-specific deployment adapters
- **Singleton Pattern** - Environment configuration
- **Module Pattern** - Workspace organization

**Note:** Use patterns judiciously. Don't force patterns where they don't fit.

### Task Decomposition

**When to Break Down Tasks:**
- Tasks involving 3+ distinct contexts (e.g., server + client + database)
- Features requiring multiple file changes across packages
- Refactoring that affects shared dependencies
- Any task that feels overwhelming in scope

**How to Decompose:**
1. Identify distinct contexts or domains
2. Create a plan document in `tmp/` directory
3. Break into logical, testable steps
4. Focus on one context at a time
5. Complete and verify before moving to next context

**Example Decomposition:**
```
Feature: Add user profile management
→ Step 1: Database schema and types (packages/api)
→ Step 2: Backend API endpoints (apps/server)
→ Step 3: Server actions (apps/web server-side)
→ Step 4: UI components (packages/ui)
→ Step 5: Route and integration (apps/web client-side)
```

### Language Standards

**Primary Language: English**

All code, documentation, and technical communication must be in English, including:
- Variable names, function names, class names
- Code comments and JSDoc documentation
- Markdown documentation files
- Commit messages
- API endpoint names
- Database schema and field names
- Error messages and user-facing strings (when applicable)

**Exceptions (Keep in Portuguese):**
Brazilian-specific terms that have no English equivalent:
- CPF, CNPJ (tax identification numbers)
- Boleto (payment slip)
- PIX (instant payment system)
- Other domain-specific Brazilian terms

**Examples:**

✅ **Good:**
```typescript
// Get user CPF for validation
function getUserCpf(userId: string): string { ... }

// Process boleto payment
async function processBoletoPayment(boleto: BoletoData) { ... }
```

❌ **Bad:**
```typescript
// Pega o CPF do usuário
function pegarCpfUsuario(idUsuario: string): string { ... }

// Processa pagamento de boleto
async function processarPagamentoBoleto(boleto: DadosBoleto) { ... }
```

**Rationale:**
- Facilitates international collaboration
- Industry-standard practice
- Better tooling and IDE support
- Easier integration with external libraries
- Clearer separation of domain terms from technical implementation

## Project Organization

### tmp/ Directory

**Purpose:** Store planning documents, context notes, and temporary development artifacts that should NOT be committed.

**Location:** `/tmp/` in project root (gitignored)

**Use Cases:**
- Task breakdown plans for complex features
- Context summaries for multi-step implementations
- TODO lists and progress tracking
- Research notes and API exploration
- Draft documentation before finalization

**Structure Example:**
```
tmp/
├── feature-auth-system/
│   ├── plan.md           # Overall implementation plan
│   ├── context.md        # Technical context and decisions
│   ├── api-research.md   # Third-party API investigation
│   └── todos.md          # Task checklist
├── refactor-server-actions/
│   ├── current-state.md
│   └── migration-plan.md
└── notes/
    └── meeting-2025-01-27.md
```

**Benefits:**
- Focus on one context at a time
- Maintain continuity across sessions
- Document decisions without cluttering git history
- Easy cleanup when tasks complete

## Architecture Overview

### Monorepo Structure

**Apps:**
- `apps/server` - Elysia backend on Bun runtime (port 3333)
- `apps/web` - React + Vite with SSR using Hono (port 3000)

**Packages:**
- `packages/api` - Shared Zod schemas and TypeScript types
- `packages/config` - Shared Biome and TypeScript configurations
- `packages/navigation` - Navigation interceptor for server-side routing
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

### Navigation: Server-Side Interceptor

This project uses `@monorepo/navigation` to intercept all internal navigation and force server-side page reloads.

**Why:** Ensures all requests pass through server middleware (authentication, authorization, etc.) and HTTP-only cookies are properly validated.

**Location:** `packages/navigation`

**Setup:** Interceptor is initialized in `apps/web/src/entry-client.tsx`

```typescript
import { setupAnchorInterceptor } from '@monorepo/navigation';

hydrateRoot(document, <App />);

setupAnchorInterceptor({ debug: import.meta.env.DEV });
```

**How It Works:**
- Uses event delegation (capture phase) to intercept clicks on `<a>`, `<area>`, and form submissions
- Prevents default behavior and forces `window.location.href` (full page reload)
- Runs **before** TanStack Router's client-side navigation
- Only intercepts internal links (external, mailto, tel, etc. are ignored)

**What Gets Intercepted:**
- ✅ `<a href="/internal">` - Anchor tags
- ✅ `<form method="get">` - GET forms
- ✅ `<area href="/internal">` - Image maps
- ✅ Even when wrapped in TanStack Router `<Link>` (without `reloadDocument`)

**What's NOT Intercepted:**
- ❌ External URLs (`https://...`)
- ❌ Special protocols (`mailto:`, `tel:`, `sms:`)
- ❌ Hash links (`#section`)
- ❌ Downloads (`<a download>`)
- ❌ New tabs (`target="_blank"`)
- ❌ Modified clicks (Cmd+Click, Ctrl+Click)
- ❌ Opt-out (`data-no-intercept` attribute)

**Usage Patterns:**

```typescript
// ✅ Recommended: Use normal HTML (interceptor handles it)
<a href="/dashboard">Dashboard</a>

// ✅ Also works: Custom Link wrapper (explicit reloadDocument)
import { Link } from '../components/Link';
<Link to="/dashboard">Dashboard</Link>

// ⚠️ Intercepted: TanStack Link without reloadDocument
import { Link } from '@tanstack/react-router';
<Link to="/dashboard">Dashboard</Link> // ← Still forces server-side!

// ❌ Opt-out: Explicit client-side navigation
<a href="/dashboard" data-no-intercept>Client-side</a>
```

**Best Practices:**
1. **Use `<a href>` for internal navigation** - The interceptor makes it server-side automatically
2. **Never use `<a>` for external links without protocol** - Always use `https://` or `target="_blank"`
3. **Test navigation behavior** - Visit `/navigation-test` to see all cases
4. **Keep `packages/ui` framework-agnostic** - UI components use `<a>` tags, not routing frameworks

**Testing:** Visit `/navigation-test` for comprehensive test page showing all navigation scenarios.

**Documentation:** See `packages/navigation/README.md` for complete API reference.

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

## Documentation Strategy

### Documentation Structure

This project maintains a **hierarchical documentation system** to separate concerns:

```
/
├── docs/                    # Monorepo/template documentation
│   ├── architecture/        # System design, technical decisions
│   ├── development/         # Setup, workflows, contribution guides
│   ├── infrastructure/      # Deployment, CI/CD, DevOps
│   └── frameworks/          # Framework-specific guides (Vite, Elysia, etc.)
│
├── apps/
│   ├── server/
│   │   └── docs/           # Backend API-specific docs
│   │       ├── api/        # API endpoint documentation
│   │       └── guides/     # Server development guides
│   └── web/
│       └── docs/           # Frontend app-specific docs
│           ├── components/ # Component usage docs
│           ├── routing/    # TanStack Router guides
│           └── guides/     # Web development guides
│
└── packages/
    ├── api/
    │   └── docs/           # Shared types and schemas docs
    ├── ui/
    │   └── docs/           # UI component library docs
    └── config/
        └── docs/           # Configuration guides
```

### Documentation Principles

**Separation of Concerns:**
- **Root `/docs/`**: Infrastructure, monorepo setup, framework configuration, deployment
  - Example: "How to add a new workspace", "Bun workspace configuration", "Vite plugin system"
- **App/Package `docs/`**: Application-specific features, business logic, usage guides
  - Example: "User authentication flow", "Todo component API", "Form validation patterns"

**When This Matters:**
- Template users can understand the monorepo infrastructure without application-specific noise
- Application developers focus on business logic without infrastructure complexity
- Documentation can be extracted or replaced independently

### Documentation Workflow

**During Development:**
1. Create draft documentation in `tmp/` directory as you work
2. Document architectural decisions and technical rationale
3. Note any gotchas or non-obvious patterns

**Before Committing:**
When asked to commit changes, Claude should:
1. Review changes made during the session
2. Suggest documentation updates if applicable:
   - New features → Usage guides
   - Architectural changes → Architecture docs
   - New patterns → Development guides
   - API changes → API documentation
3. Ask: "Would you like me to create/update documentation for these changes?"

**Documentation Triggers:**
- New framework integration or plugin
- Custom architectural patterns (like hash-based server actions)
- Environment configuration changes
- New deployment targets or infrastructure
- Shared component additions to packages
- Complex business logic or algorithms

### Documentation Formats

**Markdown Standards:**
- Use GitHub-flavored markdown
- Include code examples with syntax highlighting
- Add file path references: `src/file.ts:42`
- Use diagrams (mermaid) for complex flows
- Keep TOC for documents >200 lines

**Code Documentation:**
- TSDoc comments for public APIs
- Inline comments for complex logic only
- README.md in each package/app explaining purpose
- CHANGELOG.md for packages with external consumers

### Documentation Best Practices

**For Template/Infrastructure Docs (`/docs/`):**
- Focus on "how to maintain and extend the monorepo"
- Explain framework choices and alternatives considered
- Document custom tooling and plugin systems
- Provide migration guides for future updates

**For Application Docs (`apps/*/docs/`, `packages/*/docs/`):**
- Focus on "how to use and build features"
- Document component APIs and usage patterns
- Explain business logic and domain models
- Provide integration guides

**Avoid:**
- Documenting obvious code (self-documenting code is preferred)
- Duplicating framework documentation (link to official docs)
- Over-documenting implementation details that change frequently
- Creating documentation "just because"

### Living Documentation

Documentation should evolve with the codebase:
- Review and update docs during refactoring
- Remove outdated documentation immediately
- Use `tmp/` for temporary notes that don't need permanence
- Archive old approaches rather than deleting (helps future decisions)

### Example: Adding a New Feature

```markdown
Task: Add user authentication system

Claude suggests before commit:
"I've implemented the authentication system. Would you like me to document:
1. Architecture decision (why JWT + HTTP-only cookies) → /docs/architecture/
2. API endpoints (/auth/login, /auth/logout) → apps/server/docs/api/
3. Client usage (useAuth hook) → apps/web/docs/guides/
4. Environment variables (JWT_SECRET) → Root README.md

Shall I create these docs or would you prefer to do it manually?"
```

This approach ensures documentation is:
- Timely (created when context is fresh)
- Relevant (user decides what to document)
- Organized (correct location from the start)
- Maintainable (users develop documentation habits)
