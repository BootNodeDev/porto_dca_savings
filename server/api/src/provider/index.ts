import { baseSepolia } from 'porto/Chains'
import { Porto } from 'porto'
import { env } from 'hono/adapter'
import { http } from 'viem'


export const porto = (c: any) => Porto.create({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(env<{ PUBLIC_RPC_BASE_SEPOLIA: string }>(c).PUBLIC_RPC_BASE_SEPOLIA),
  },
})
