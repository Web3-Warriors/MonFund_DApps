import React from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { foundry } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";

// Configure Anvil (Foundry) chain with proper config
const config = createConfig({
  chains: [foundry],
  transports: {
    [foundry.id]: http("http://127.0.0.1:8545"),
  },
});

// Create a client
const queryClient = new QueryClient();

interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
