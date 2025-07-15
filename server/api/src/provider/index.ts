import { baseSepolia } from 'porto/Chains'
import { createClient, http } from 'viem'


export const client = createClient({
  chain: baseSepolia,
  transport: http(),
})
