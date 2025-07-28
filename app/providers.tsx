import React from "react";
import { type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import getDefaultConfig from "@/app/rainbowKitConfig";
function Providers(props: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={getDefaultConfig}>
      <RainbowKitProvider>{props.children}</RainbowKitProvider>
    </WagmiProvider>
  );
}

export default Providers;
