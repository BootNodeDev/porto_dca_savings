import { env } from '@/src/env'
import type { WagmiPortoConfig } from '@/src/lib/wallets/connectkit.config'
import { Hooks } from 'porto/wagmi'
import { useCallback, useState } from 'react'
import { type Hex, parseEther } from 'viem'
import { useAccount, useChainId } from 'wagmi'

const CONTRACT = '0x16b2ea479ad9f1bc07507202c03e735447966585'
const TOKEN_ADDRESS = '0xb2F63284AAfAB9f8E422eae4edD5069CcDE435e9'

const SERVER_URL = env.PUBLIC_SERVER_URL

interface Key {
  type: 'p256'
  expiry: number
  publicKey: Hex
  role: 'session' | 'admin'
}

type KeyPermission = {
  chainId: number
} & Key

export const permissions = ({ chainId }: { chainId: number }) => {
  console.log({ chainId })

  return {
    expiry: Math.floor(Date.now() / 1_000) + 60 * 60 * 24 * 30, // 1 month
    chainId,
    permissions: {
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
          limit: BigInt(parseEther('10')),
          token: TOKEN_ADDRESS,
        },
      ],
    },
  } as const
}

export const useSetPermissions = () => {
  const chainId = useChainId<WagmiPortoConfig>()
  const { address } = useAccount<WagmiPortoConfig>()
  const grantPermissions = Hooks.useGrantPermissions<WagmiPortoConfig>()
  const _permissions = Hooks.usePermissions()
  const [keys, setKeys] = useState<KeyPermission[]>([])

  console.log({ keys })
  console.log({ permissions: _permissions.data })
  const getNewKey = useCallback(() => {
    fetch(`${SERVER_URL}/${address}`)
      .then((response) => response.json())
      .then((json) => {
        setKeys((keys) => [
          ...keys,
          {
            chainId,
            type: 'p256',
            expiry: Date.now() + 1000 * 60 * 60 * 24 * 30,
            publicKey: json.publicKey,
            role: 'session',
          },
        ])
      })
      .catch((error) => {
        console.error(error)
      })
  }, [address, chainId])

  const callMethods = useCallback(() => {
    fetch(`${SERVER_URL}/${address}/transfer`)
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
      const { expiry } = permissions({ chainId })

      await grantPermissions.mutateAsync({
        key,
        expiry, // permission's expiry, not key expiry
        address,
        chainId,
        permissions: permissions({ chainId }).permissions,
      })
    },
    [address, chainId, grantPermissions],
  )

  return { grantPermissionToKey, getNewKey, keys, callMethods }
}
