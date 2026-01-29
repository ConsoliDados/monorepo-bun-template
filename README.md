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

### Git Hooks Setup

This project uses [Lefthook](https://github.com/evilmartians/lefthook) for managing git hooks.

**Automatic Installation:**
Lefthook is automatically installed when you run `bun install` via the `prepare` script.

**Current Hooks:**
- `pre-commit`: Blocks direct commits to `dev` branch (enforces feature branch workflow)

**Manual Installation (if needed):**

```bash
# Install Lefthook
bun add -D lefthook

# Install hooks
bunx lefthook install
```

**Platform Notes:**

- ✅ **Linux**: Works out of the box
- ✅ **macOS**: Works out of the box (if issues, see troubleshooting below)
- ⚠️ **Windows**: Use WSL (Windows Subsystem for Linux). Native Windows support exists but WSL is recommended for best compatibility with this template.

**Troubleshooting macOS:**

If you encounter permission issues with the Lefthook binary:
```bash
xattr -d com.apple.quarantine $(which lefthook)
lefthook install -f
```

**Bypass hook (emergency only):**
```bash
git commit --no-verify -m "hotfix: critical bug"
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

## 🏭 Extending for Production Projects

This template provides a solid foundation for monorepo development. When using this template in production projects, consider implementing these additional safeguards and workflows:

### Test Coverage Enforcement

Add test coverage requirements by updating `lefthook.yml`:

```yaml
# lefthook.yml
pre-commit:
  commands:
    block-dev-branch:
      # ... existing config ...

    test-coverage:
      run: |
        echo "🧪 Running tests with coverage..."
        bun test --coverage

        COVERAGE=$(bun test --coverage --silent | grep "All files" | awk '{print $10}' | sed 's/%//')

        if [ "$COVERAGE" -lt 80 ]; then
          echo "❌ Test coverage below 80% (current: ${COVERAGE}%)"
          echo "Please add tests before committing."
          exit 1
        fi

        echo "✅ Test coverage: ${COVERAGE}%"
```

**Recommended Configuration:**
- Use **Vitest** with coverage plugin (Bun's test runner also supports coverage)
- Adjust threshold based on project needs (70%, 80%, 90%)
- Consider different thresholds for different packages
- Allow bypass with `--no-verify` for urgent hotfixes (use sparingly)

**Example prompt for Claude Code:**
```
Add Vitest with coverage to this project. Configure lefthook.yml to enforce 80% test coverage. Block commits if coverage is below threshold.
```

---

### Branch Protection Rules

Protect critical branches (`dev`, `main`) using GitHub's branch protection:

**GitHub Settings → Branches → Add rule:**

1. **Branch name pattern:** `dev` (repeat for `main`)
2. **✅ Require pull request before merging**
3. **Require approvals:** 1+ (adjust based on team size)
4. **✅ Require status checks to pass:**
   - `ci/tests` (if you add test workflow)
   - `ci/typecheck` (TypeScript validation)
   - `ci/lint` (Biome linting)
5. **✅ Require conversation resolution before merging**
6. **Restrict who can push to matching branches:**
   - Add team leads, senior developers, or DevOps engineers only
   - Regular developers submit PRs instead

**Why this matters:**
- Prevents accidental commits to protected branches (backup to Lefthook hook)
- Ensures code review process is followed
- Validates CI/CD checks before merging
- Maintains clean git history

---

### Code Owners (CODEOWNERS)

Automatically assign reviewers based on file paths:

```bash
# .github/CODEOWNERS

# Default owners for everything
* @team-leads @senior-devs

# Documentation requires docs team approval
/docs/ @documentation-guardians
README.md @documentation-guardians
CLAUDE.md @ai-workflow-specialist

# Architecture changes require architecture team
/packages/ @architecture-team
apps/web/plugins/ @architecture-team
apps/web/server/ @architecture-team

# UI components require design approval
packages/ui/ @design-team @frontend-leads

# CI/CD changes require DevOps
.github/workflows/ @devops-team
lefthook.yml @devops-team
```

**Benefits:**
- Automatic reviewer assignment on PRs
- Domain experts review relevant changes
- Distributes review workload
- Ensures documentation updates are validated

---

### CI/CD Workflows

Add comprehensive GitHub Actions workflows for automated testing:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [dev, main]
  push:
    branches: [dev, main]

jobs:
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run typecheck

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun test --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: cd apps/web && bun run build
```

**Recommended Checks:**
- **Typecheck** - Validates TypeScript across all packages
- **Lint** - Ensures code style consistency with Biome
- **Test** - Runs unit and integration tests with coverage
- **Build** - Validates production builds succeed

---

### Documentation Guardians

Assign team members as documentation maintainers:

| Documentation Area | Responsible Team | Review Scope |
|-------------------|------------------|--------------|
| **Architecture Docs** (`docs/architecture/`) | Senior Developers, Architects | System design, technical decisions |
| **Development Guides** (`docs/development/`) | Tech Leads | Workflows, best practices |
| **CLAUDE.md** | AI Workflow Specialist | Claude Code directives, conventions |
| **App-Specific Docs** (`apps/*/docs/`) | Feature Teams | Business logic, APIs |
| **Package Docs** (`packages/*/docs/`) | Package Maintainers | Component APIs, usage guides |

**Documentation Review Process:**
1. PRs touching docs require approval from documentation guardian (use CODEOWNERS)
2. Monthly documentation review meetings to identify outdated content
3. Quarterly cleanup of deprecated patterns and obsolete guides
4. Documentation updates as acceptance criteria for features

**Example CODEOWNERS entry:**
```bash
/docs/architecture/ @senior-dev @tech-architect
/docs/development/ @tech-lead
CLAUDE.md @ai-specialist
apps/web/docs/ @frontend-team
packages/ui/docs/ @design-system-team
```

---

### Additional Recommendations

**1. Commit Message Validation**
Use [commitlint](https://commitlint.js.org/) to enforce conventional commits:

```yaml
# lefthook.yml
commit-msg:
  commands:
    commitlint:
      run: bunx commitlint --edit {1}
```

**2. Dependency Security**
Add automated dependency scanning:

```yaml
# .github/workflows/security.yml
- uses: actions/dependency-review-action@v3
```

**3. Pre-Push Hooks**
Run full test suite before pushing:

```yaml
# lefthook.yml
pre-push:
  commands:
    test:
      run: bun test
```

**4. Release Management**
Use [changesets](https://github.com/changesets/changesets) for package versioning:

```bash
bun add -D @changesets/cli
bunx changeset init
```

---

### Quick Setup Checklist

When starting a new project with this template:

- [ ] Configure branch protection on GitHub (dev, main)
- [ ] Create CODEOWNERS file with team assignments
- [ ] Add CI/CD workflows (typecheck, lint, test, build)
- [ ] Configure test coverage enforcement in pre-commit hook
- [ ] Set up documentation guardians and review process
- [ ] Add commitlint for commit message validation
- [ ] Configure dependency security scanning
- [ ] Set up release management (if publishing packages)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
