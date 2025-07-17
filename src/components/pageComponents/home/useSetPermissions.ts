import { env } from '@/src/env'
import type { WagmiPortoConfig } from '@/src/lib/wallets/connectkit.config'
import type { P256Key } from 'porto/viem/Key'
import { Actions } from 'porto/wagmi'
import { useCallback, useState } from 'react'
import { parseEther } from 'viem'
import { useAccount, useChainId, useConfig } from 'wagmi'

const SERVER_URL = env.PUBLIC_SERVER_URL

type Key = Omit<P256Key, 'privateKey'>
type Permissions = Key['permissions']

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
      period: 'minute',
      limit: parseEther('10'),
      token: GAS_TOKEN,
    },
  ],
} as const satisfies Permissions

export const useSetPermissions = () => {
  const chainId = useChainId<WagmiPortoConfig>()
  const { address } = useAccount<WagmiPortoConfig>()
  const config = useConfig<WagmiPortoConfig>()
  const [key, setKey] = useState<Key | null>(null)

  const getNewKey = useCallback(() => {
    fetch(`${SERVER_URL}/keys/${address}`)
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
      const permission = await Actions.grantPermissions(config, {
        address,
        expiry: key.expiry,
        key: {
          publicKey: key.publicKey,
          type: key.type,
        },
        permissions,
      })

      console.log({ permission })
    },
    [address, config],
  )

  return { grantPermissionToKey, getNewKey, key, callMethods }
}
