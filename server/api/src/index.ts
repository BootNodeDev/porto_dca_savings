import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Address } from 'ox';
import { generateRandomPair } from './keys'
import { db } from './db';

const app = new Hono()

app.use('*', cors())

app.get('/:address', (c) => {
  const address = c.req.param('address') as `0x${string}`

  if (!address || !Address.validate(address)) {
    return c.json({ error: 'Invalid address' }, 400)
  }


  const keypair = generateRandomPair()
  db.set(address, keypair)


  // TODO role, expiry, type
  return c.json({
    address,
    publicKey: keypair.publicKey,
  })
})
export default app
