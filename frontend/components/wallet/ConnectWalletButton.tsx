"use client";

import { Button } from "@/components/ui/Button";
import { useWallet } from "@/hooks/useWallet";
import { shortAddress } from "@/utils/format";

export function ConnectWalletButton() {
  const { address, connect, disconnect, isConnecting, isConnected } =
    useWallet();

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-outline bg-surface-high px-3 py-1 font-mono text-sm text-muted">
          {shortAddress(address)}
        </span>
        <Button variant="secondary" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={connect} disabled={isConnecting}>
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
