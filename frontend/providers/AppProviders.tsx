"use client";

import { type ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { SorobanProvider } from "./SorobanProvider";
import { WalletProvider } from "./WalletProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <WalletProvider>
        <SorobanProvider>{children}</SorobanProvider>
      </WalletProvider>
    </QueryProvider>
  );
}
