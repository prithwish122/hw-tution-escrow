
// context/index.tsx
'use client'

import { wagmiAdapter, projectId } from '../config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react' 
import { mainnet, arbitrum, avalanche, base, optimism, polygon, defineChain } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'Plan Dao',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png']
}
const customNetwork = defineChain({
  id: 656476,
  caipNetworkId: 'eip155:123456789',
  chainNamespace: 'eip155',
  name: 'EDU Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'EDU CHAIN',
    symbol: 'EDU',
  },
  rpcUrls: {
    default: {
      http: ['https://open-campus-codex-sepolia.drpc.org'],
      webSocket: ['WS_RPC_URL'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://opencampus-codex.blockscout.com' },
  },
  contracts: {
    // Add the contracts here
  }
})
// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter], // Add valid adapter objects here if needed
  networks: [customNetwork],
  chainImages: {
    123456789: '/custom-network-logo.png',
  },
  projectId: '94379dd8c21ff5441b0eb5f2c1007ea0'
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider
    