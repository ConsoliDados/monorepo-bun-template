import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { createSSRHandler } from './hono-base'

const port = Number(process.env.FRONTEND_PORT) || 3000

async function startProductionServer() {
  const app = new Hono()

  // Compression middleware
  app.use('*', compress())

  // Serve static files from dist/client
  app.use('/assets/*', serveStatic({ root: './dist/client' }))
  app.use('/favicon.ico', serveStatic({ path: './dist/client/favicon.ico' }))

  // Create SSR handler
  const ssrApp = await createSSRHandler({
    isProduction: true,
  })

  // Mount SSR handler
  app.route('/', ssrApp)

  console.log(`🚀 Production server running at http://localhost:${port}`)

  serve({
    fetch: app.fetch,
    port,
  })
}

startProductionServer().catch(console.error)
