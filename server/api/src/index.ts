import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { Address as AddressAction, Hex, Json, P256, Signature } from 'ox';
import { ServerActions, Key } from 'porto/viem';
import { Address } from 'viem'
import { generateKey } from './keys'
import { db } from './db';
import { client } from './provider';
import { calls } from './contracts/calls';

const app = new Hono()

app.use('*', cors())
app.use(logger())

app.get('keys/:address', (c) => {
  const address = c.req.param('address').toLowerCase() as Address

  if (!address || !AddressAction.validate(address)) {
    return c.json({ error: 'Invalid address' }, 400)
  }


  const key = generateKey({ address, type: 'p256', timeFromNow: 60 * 5, role: 'session' })
  db.set(address.toLowerCase() as Address, key)


  const { privateKey, ...keyResponse } = key;
  return c.json(keyResponse)
})

app.post(':address/transfer', async (c) => {
  const address = c.req.param('address').toLowerCase() as Address

  if (!address || !AddressAction.validate(address)) {
    return c.json({ error: 'Invalid address' }, 400)
  }

  if (!db.has(address)) {
    return c.json({ error: 'Address not found' }, 404)
  }

  const key = db.get(address)!;


  const request = await ServerActions.prepareCalls(client, {
    account: address,
    key,
    calls,
  })

  // const signature = Signature.toHex(
  //   P256.sign({
  //     payload: request.digest,
  //     privateKey: key.privateKey,
  //   }),
  // )

  // const [sendPreparedCallsResult] = await portoInstance.provider.request({
  //   method: 'wallet_sendPreparedCalls',
  //   params: [
  //     {
  //       ...request,
  //       signature,
  //       key: {
  //         type: 'p256',
  //         publicKey: keyPair.publicKey,
  //       },
  //     },
  //   ],
  // })

  return c.json({
    address,
    request
  })
})
export default app
