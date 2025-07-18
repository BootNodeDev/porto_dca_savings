import { env } from '@/src/env'
import { type WagmiPortoConfig, porto } from '@/src/lib/wallets/connectkit.config'
import type { P256Key } from 'porto/viem/Key'
import { useCallback, useState } from 'react'
import { parseEther, toHex } from 'viem'
import { useAccount } from 'wagmi'

const SERVER_URL = env.PUBLIC_SERVER_URL

type Key = Omit<P256Key, 'privateKey'>

const CONTRACT = '0x16b2ea479ad9f1bc07507202c03e735447966585'
const TOKEN_ADDRESS = '0xb2F63284AAfAB9f8E422eae4edD5069CcDE435e9'
const GAS_TOKEN = '0x29F45fc3eD1d0ffaFb5e2af9Cc6C3AB1555cd5a2'

// TODO Receive from server
export const permissions = {
  calls: [
    {
      signature: 'approve(address,uint256)',
      to: TOKEN_ADDRESS,
    },
    {
      signature: 'transfer(address,uint256)',
      to: CONTRACT,
    },
  ],
  spend: [
    {
      period: 'month',
      limit: toHex(parseEther('10')),
      token: GAS_TOKEN,
    },
  ],
} as const

export const useSetPermissions = () => {
  const { address } = useAccount<WagmiPortoConfig>()
  const config = porto.config
  const [key, setKey] = useState<Key | null>(null)

  const getNewKey = useCallback(() => {
    const ONE_MONTH = 30 * 24 * 60 * 60
    fetch(`${SERVER_URL}/keys/${address}?expiry=${Math.floor(Date.now() / 1000 + ONE_MONTH)}`)
      .then((response) => response.json())
      .then((newKey) => {
        console.log({ newKey })
        setKey(newKey as Key)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [address])

  const callMethods = useCallback(() => {
    fetch(`${SERVER_URL}/${address}/transfer`, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [address])

  const grantPermissionToKey = useCallback(
    async (key: Key) => {
      const pre = await porto.provider.request({
        method: 'wallet_getPermissions',
        params: [
          {
            address,
          },
        ],
      })

      const permission = await porto.provider.request({
        method: 'wallet_grantPermissions',
        params: [
          {
            address,
            expiry: key.expiry,
            key: {
              publicKey: key.publicKey,
              type: key.type,
            },
            permissions,
          },
        ],
      })

      const post = await porto.provider.request({
        method: 'wallet_getPermissions',
        params: [
          {
            address,
          },
        ],
      })

      console.log({ config: porto.config, permission, pre, post })
    },
    [address],
  )

  return { grantPermissionToKey, getNewKey, key, callMethods }
}
