"use client";
import React, { useState } from "react";
import { type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import getDefaultConfig from "@/app/rainbowKitConfig";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";
function Providers(props: { children: React.ReactNode }) {
  const [queryClient] = useState<any>(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={getDefaultConfig}>
        <RainbowKitProvider>
          {props.children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default Providers;
