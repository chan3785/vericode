import { createConfig, http } from 'wagmi';
import { opencampus } from './lib/opencampus';
import { metaMask } from 'wagmi/connectors';

export const config = createConfig({
  chains: [opencampus],
  connectors: [metaMask()],
  ssr: true,
  multiInjectedProviderDiscovery: false,
  transports: {
    [opencampus.id]: http()
  }
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
