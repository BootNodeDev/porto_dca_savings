import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Address, Hex, Json, P256, Signature } from 'ox';
import { generateRandomPair } from './keys'
import { db } from './db';
import { porto } from './provider';
import { Chains } from 'porto';
import { calls } from './contracts/calls';

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

app.get('/:address/transfer', async (c) => {
  const address = c.req.param('address') as `0x${string}`

  if (!address || !Address.validate(address)) {
    return c.json({ error: 'Invalid address' }, 400)
  }

  if (!db.has(address)) {
    return c.json({ error: 'Address not found' }, 404)
  }

  const keyPair = db.get(address)!;

  const portoInstance = porto(c);

  const { digest, ...request } = await portoInstance.provider.request({
    method: 'wallet_prepareCalls',
    params: [
      {
        key: {
          type: 'p256', // TODO save type
          publicKey: keyPair.publicKey,
        },
        from: address,
        calls,
        chainId: Hex.fromNumber(Chains.baseSepolia.id), // TODO Change
      },
    ],
  })

  const signature = Signature.toHex(
    P256.sign({
      payload: digest,
      privateKey: keyPair.privateKey,
    }),
  )

  const [sendPreparedCallsResult] = await portoInstance.provider.request({
    method: 'wallet_sendPreparedCalls',
    params: [
      {
        ...request,
        signature,
        key: {
          type: 'p256',
          publicKey: keyPair.publicKey,
        },
      },
    ],
  })

  return c.json({
    address,
    id: sendPreparedCallsResult.id,
  })
})
export default app
