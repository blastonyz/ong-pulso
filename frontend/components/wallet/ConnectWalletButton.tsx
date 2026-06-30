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
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
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
      {isConnecting ? "Connecting..." : "Connect Freighter"}
    </Button>
  );
}
