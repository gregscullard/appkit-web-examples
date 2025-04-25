import { defineChain } from '@reown/appkit/networks';

// Define the custom network
export const hederaTestnet = defineChain({
    id: 296,
    caipNetworkId: 'eip155:296',
    chainNamespace: 'eip155',
    name: 'Hedera',
    nativeCurrency: {
        decimals: 8,
        name: 'Hbar',
        symbol: 'HBAR',
    },
    rpcUrls: {
        default: {
            http: ['https://testnet.hashio.io/api'],
            webSocket: ['ws://testnet.hashio.io/api:8546'],
            // http: ['http://localhost:7546'],
            // webSocket: ['ws://localhost:8546'],
        },
    },
    blockExplorers: {
        default: { name: 'Explorer', url: 'https://hashscan.io' },
    },
    contracts: {
        // Add the contracts here
    }
})
