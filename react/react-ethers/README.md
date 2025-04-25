# Reown AppKit Example using ethers (Vite + React)

This is a [Vite](https://vitejs.dev) project together with React.

## Configuration and tweaks

This project is a fork of [this](https://github.com/reown-com/appkit-web-examples).

The project has been modified to include buttons to deploy and invoke a smart contract (bytecode and abi in src/config/contract.ts)

I have also added a `hedera.ts` file under `src/config` to setup the connection to Hedera's testnet.

This is reflected in ./src/config/index.tsx

```javascript
export const networks = [hederaTestnet] as [AppKitNetwork, ...AppKitNetwork[]]
```

## Usage

1. Go to [Reown Cloud](https://cloud.reown.com) and create a new project.
2. Copy your `Project ID`
3. Copy `.env.test` to `.env` and paste your `Project ID` as the value for `VITE_PROJECT_ID`
4. Run `pnpm install` to install dependencies
5. Run `pnpm run dev` to start the development server

## Resources

- [Reown — Docs](https://docs.reown.com)
- [Vite — GitHub](https://github.com/vitejs/vite)
- [Vite — Docs](https://vitejs.dev/guide/)
