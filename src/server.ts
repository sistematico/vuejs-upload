import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()
app.use(cors())

app.get('/', (c) => c.text('Hello Bun!'))

export default { fetch: app.fetch, port: 3000 }