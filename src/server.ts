import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors())

app.post('/upload', async (c) => {
  const body = await c.req.parseBody({ all: true })
  const files = body['files']
  let loaded = 0

  if (files) {
    const total = Number(c.req.header('Content-Length')) || 0
    
    for await (const chunk of Array.from(Object.values(files))) {
      // loaded += chunk.byteLength
      loaded += chunk.size
      // console.log(`Received: (${Math.round((loaded / total) * 100)} %)`)
      const percent = Math.round((loaded / total) * 100)
      c.text(String(percent))
    }
  }

  return c.text('Done!')
})

export default { fetch: app.fetch, port: 3000 }