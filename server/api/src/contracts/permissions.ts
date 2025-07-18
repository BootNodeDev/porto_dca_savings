import { Permissions } from "porto/viem/Key"
import { parseEther } from "viem"

export const CONTRACT = '0x16b2ea479ad9f1bc07507202c03e735447966585'
export const TOKEN_ADDRESS = '0xb2f63284aafab9f8e422eae4edd5069ccde435e9'
export const GAS_TOKEN = '0x29f45fc3ed1d0ffafb5e2af9cc6c3ab1555cd5a2'


export const DEFAULT_PERMISSIONS = {
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
} satisfies Permissions
