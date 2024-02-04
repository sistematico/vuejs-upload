import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors())

app.post('/upload/:file', async (c) => {
  const filename = c.req.param('file')
  const body = await c.req.parseBody({ all: true })
  const files = body['files']
  let loaded = 0

  if (files) {
    const total = Number(c.req.header('Content-Length')) || 0    
    for await (const chunk of Array.from(Object.values(files))) {
      loaded += chunk.size // chunk.byteLength
      console.log(`${filename}: (${Math.round((loaded / total) * 100)} %)`)
    }
  }

  return c.text(`${filename} done`)
})

export default { fetch: app.fetch, port: 3000 }