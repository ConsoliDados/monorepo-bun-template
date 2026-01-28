# @monorepo/navigation

Navigation utilities for server-side navigation in SSR applications with middleware authentication.

## Overview

This package provides a **navigation interceptor** that forces all internal navigation to use server-side page reloads instead of client-side SPA navigation. This ensures that:

- All requests pass through server middleware (authentication, authorization, etc.)
- HTTP-only cookies are properly validated on every navigation
- Protected routes cannot be bypassed via client-side routing

## Installation

```bash
# Already included in the monorepo
# No installation needed if you're in this workspace
```

## Quick Start

### 1. Setup the Interceptor

Call `setupAnchorInterceptor()` once in your client entry point (after hydration):

```typescript
// apps/web/src/entry-client.tsx
import { setupAnchorInterceptor } from '@monorepo/navigation';
import { hydrateRoot } from 'react-dom/client';

// ... your hydration code ...

hydrateRoot(document, <App />);

// Setup navigation interceptor
setupAnchorInterceptor({
  debug: import.meta.env.DEV, // Enable logging in development
});
```

### 2. Use Normal HTML

After setup, you can use standard HTML navigation:

```tsx
// ✅ This will be intercepted and force server-side navigation
<a href="/dashboard">Go to Dashboard</a>

// ✅ Forms with GET method also intercepted
<form method="get" action="/search">
  <input name="q" />
  <button type="submit">Search</button>
</form>

// ✅ Even nested elements work
<a href="/profile">
  <div className="card">
    <h3>View Profile</h3>
  </div>
</a>
```

## What Gets Intercepted?

### ✅ Intercepted (Server-Side Navigation)

The following elements/events are intercepted and forced to reload the page:

1. **`<a href="/internal">`** - Internal anchor tags
2. **`<form method="get">`** - GET forms (redirects with query params)
3. **`<area href="/internal">`** - Image map areas

### ❌ Not Intercepted (Default Browser Behavior)

The following are **NOT** intercepted and behave normally:

1. **External URLs** - `<a href="https://example.com">`
2. **Email links** - `<a href="mailto:test@example.com">`
3. **Phone links** - `<a href="tel:+1234567890">`
4. **Hash links** - `<a href="#section">` (same-page anchors)
5. **Download links** - `<a href="/file.pdf" download>`
6. **New tab links** - `<a href="/page" target="_blank">`
7. **Data URIs** - `<a href="data:text/plain,...">`
8. **Blob URLs** - `<a href="blob:...">`
9. **Modified clicks** - Cmd+Click, Ctrl+Click, Middle-click, Shift+Click
10. **Opt-out attribute** - `<a href="/page" data-no-intercept>`
11. **POST forms** - `<form method="post">` (submit normally)

## API Reference

### `setupAnchorInterceptor(options?)`

Sets up the navigation interceptor. Call once in your client entry point.

**Parameters:**

```typescript
interface InterceptorOptions {
  /**
   * Enable debug logging to console
   * @default false
   */
  debug?: boolean;

  /**
   * Callback when navigation is intercepted
   */
  onIntercept?: (
    type: 'anchor' | 'form' | 'area',
    href: string,
    element: HTMLElement
  ) => void;

  /**
   * Custom function to determine if a URL should be intercepted
   * Return true to intercept, false to allow default behavior
   */
  shouldIntercept?: (href: string, element: HTMLElement) => boolean;
}
```

**Example:**

```typescript
setupAnchorInterceptor({
  debug: true,
  onIntercept: (type, href, element) => {
    console.log(`Intercepting ${type}:`, href);
    // Track analytics, etc.
  },
  shouldIntercept: (href, element) => {
    // Custom logic
    if (href.startsWith('/admin')) {
      return true; // Force server-side for admin routes
    }
    return false; // Allow client-side for other routes
  },
});
```

### `navigate(href: string)`

Helper function to navigate programmatically with server-side reload.

```typescript
import { navigate } from '@monorepo/navigation';

function handleLogout() {
  // Clear client state
  localStorage.clear();

  // Navigate to home (server-side)
  navigate('/');
}
```

**Note:** This is just an alias for `window.location.href = href`. Use it for clarity and consistency.

### `isNavigationSupported()`

Check if the current environment supports navigation interception.

```typescript
import { isNavigationSupported } from '@monorepo/navigation';

if (isNavigationSupported()) {
  setupAnchorInterceptor();
} else {
  console.warn('Navigation interception not supported in this environment');
}
```

Returns `false` in environments without `window`, `document`, or `location` (e.g., server-side rendering, Node.js tests).

## Advanced Usage

### Opt-out of Interception

To allow client-side navigation for specific links:

```tsx
// This link will NOT be intercepted
<a href="/dashboard" data-no-intercept>
  Client-side navigation
</a>

// Or use a class
<a href="/dashboard" className="external-link">
  Client-side navigation
</a>
```

### Custom Interception Logic

```typescript
setupAnchorInterceptor({
  shouldIntercept: (href, element) => {
    // Only intercept links in the sidebar
    if (element.closest('.sidebar')) {
      return true;
    }

    // Allow client-side navigation for everything else
    return false;
  },
});
```

### Analytics Tracking

```typescript
setupAnchorInterceptor({
  onIntercept: (type, href, element) => {
    // Track intercepted navigations
    analytics.track('Server-side Navigation', {
      type,
      href,
      from: window.location.pathname,
    });
  },
});
```

## How It Works

The interceptor uses **event delegation** with the capture phase to intercept navigation events before they reach other handlers (including TanStack Router):

```typescript
document.addEventListener('click', (event) => {
  const anchor = event.target.closest('a[href]');

  if (shouldInterceptThisLink(anchor)) {
    event.preventDefault();
    window.location.href = anchor.href; // Force full page reload
  }
}, true); // ← Capture phase (runs before bubble phase)
```

### Why Capture Phase?

Using `{ capture: true }` ensures the interceptor runs **before** any other click handlers, including:
- TanStack Router's SPA navigation
- React's synthetic event system
- Other application event listeners

This guarantees that we can override client-side routing frameworks.

## Testing

Visit `/navigation-test` in your application to see a comprehensive test page with:

- ✅ Links that should be intercepted
- ❌ Links that should NOT be intercepted
- 🔧 Special cases (opt-out, modified clicks, etc.)
- Debug console showing intercepted events

## Use Cases

### 1. Middleware Authentication

Ensure all navigation passes through authentication middleware:

```typescript
// src/middleware.ts
export const middleware = async (c, next) => {
  const authSession = getCookie(c, 'auth-session');

  if (!authSession) {
    return c.redirect('/login'); // ← Interceptor ensures this always runs
  }

  await next();
};
```

### 2. Role-Based Access Control

```typescript
// src/middleware.ts
export const config = { matcher: '/admin/:path*' };

export const middleware = async (c, next) => {
  const userRole = getCookie(c, 'user-role');

  if (userRole !== 'admin') {
    return c.text('Forbidden', 403); // ← Always executed on navigation
  }

  await next();
};
```

### 3. Request Logging

```typescript
// src/middleware.ts
export const middleware = async (c, next) => {
  const start = Date.now();

  console.log(`[${new Date().toISOString()}] → ${c.req.method} ${c.req.path}`);

  await next();

  const duration = Date.now() - start;
  console.log(`[${new Date().toISOString()}] ← Completed in ${duration}ms`);
};
```

## Comparison with TanStack Router

| Feature | TanStack Router Link | Intercepted `<a>` Tag |
|---------|----------------------|----------------------|
| Navigation Type | Client-side (SPA) | Server-side (Full reload) |
| Middleware Execution | ❌ Bypassed | ✅ Always runs |
| HTTP-only Cookies | ❌ Not sent | ✅ Sent with request |
| Page State | ✅ Preserved | ❌ Reset |
| Load Time | ⚡ Instant | 🐢 Slower (full page) |
| Use Case | Public routes, fast UX | Protected routes, security |

## Best Practices

### 1. Use for Protected Routes

```tsx
// ✅ Good: Protected routes use intercepted links
<a href="/dashboard">Dashboard</a>
<a href="/admin">Admin Panel</a>

// ❌ Bad: Don't bypass interceptor for protected routes
<Link to="/dashboard" data-no-intercept>Dashboard</Link>
```

### 2. External Links Always Explicit

```tsx
// ✅ Good: Clear that it's external
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  External Link
</a>

// ❌ Bad: Internal link with full URL (might be intercepted)
<a href="http://myapp.com/dashboard">Dashboard</a>
```

### 3. Debug in Development

```typescript
// ✅ Good: Debug logs in development
setupAnchorInterceptor({
  debug: import.meta.env.DEV,
});

// ❌ Bad: Always debugging (pollutes production console)
setupAnchorInterceptor({
  debug: true,
});
```

## Troubleshooting

### Links not being intercepted

1. Check that `setupAnchorInterceptor()` is called **after** hydration
2. Open DevTools Console and enable debug mode
3. Verify the link doesn't have `data-no-intercept` or `target="_blank"`
4. Check if the href is being treated as external

### Interceptor conflicts with other libraries

```typescript
// Try running interceptor BEFORE other libraries
setupAnchorInterceptor(); // First
someOtherLibrary.init();  // Second
```

### Forms not submitting

1. Ensure the form has `method="get"` (POST forms are not intercepted)
2. Check that the action URL is internal (not external)
3. Verify no JavaScript is calling `event.preventDefault()` before the interceptor

## Framework Compatibility

This package is **framework-agnostic** but designed for SSR applications with:

- ✅ React + TanStack Router
- ✅ React + React Router (untested)
- ✅ Vue + Vue Router (untested)
- ✅ Svelte + SvelteKit (untested)
- ✅ Any framework with client-side routing

## License

MIT

## Questions?

For more information, see:
- [Root README.md](../../../README.md) - Project overview
- [apps/web README.md](../../apps/web/README.md) - Web app documentation
- [CLAUDE.md](../../../CLAUDE.md) - Development guidelines
- `/navigation-test` - Interactive test page
