import { defineChain } from 'viem'

export const opencampus = defineChain({
  id: 656476,
  name: 'Open Campus Codex',
  nativeCurrency: { name: 'EDU', symbol: 'EDU', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.open-campus-codex.gelato.digital'] },
  },
  blockExplorers: {
    default: { name: 'EDU Chain Testnet explorer', url: 'https://edu-chain-testnet.blockscout.com/' },
  },
})
