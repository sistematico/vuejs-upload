import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { appendFileSync } from 'node:fs'

const app = new Hono()

app.use('*', cors())

app.post('/upload/:file', async (c) => {
  const filename = c.req.param('file')
  const body = await c.req.raw.body
  let loaded = 0
  
  if (!body) return c.text(`Falta o corpo da requisição`)
  const files = await Bun.readableStreamToArray(body);
  const total = Number(c.req.header('Content-Length')) || 0    
  
  for await (const chunk of files) {
    if (loaded >= total) break
    loaded += chunk.byteLength
    console.log(`${filename}: (${Math.round((loaded / total) * 100)} %)`)    
    appendFileSync(filename, chunk); // append to a file on the disk    
  }
  
  return c.text(`${filename} done`)
})

export default { fetch: app.fetch, port: 3000 }