import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors())

app.post('/upload', async (c) => {
  const body = await c.req.parseBody({ all: true })
  const files = body['files']
  // const { name } = c.req.header()

  
  // let loaded = 0
  const total = Number(c.req.header('Content-Length')) || 0    
  
  console.log(total)

  
  Array.from(Object.values(files)).forEach((chunk) => {
    console.log(chunk)
  //   console.log('Bateu')
  //   console.log('File:', chunk.size)
  //   console.log('Header:', name)

  //   // loaded += chunk.byteLength
  //   loaded += chunk.size
  //   console.log(`Received: (${Math.round((loaded / total) * 100)} %)`)
  //   console.log(`Received: (${Math.round((loaded / total) * 100)} %)`)
  })


  // for await (const chunk of files) {
    // loaded += chunk.byteLength
    // console.log(`Received: (${Math.round((loaded / total) * 100)} %)`)
    // console.log(`Received: (${Math.round((loaded / total) * 100)} %)`)
  // }  
  
  return c.text('Done!')
})

export default { fetch: app.fetch, port: 3000 }