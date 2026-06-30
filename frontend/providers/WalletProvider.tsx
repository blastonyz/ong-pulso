"use client";

import {
  getAddress,
  getNetwork,
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type WalletContextValue = {
  address: string | null;
  network: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<string>;
  disconnect: () => void;
  refresh: () => Promise<void>;
  sign: (xdr: string, networkPassphrase: string) => Promise<string>;
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const refresh = useCallback(async () => {
    const { isConnected: installed, error } = await isConnected();
    if (error || !installed) return;

    const { address: walletAddress, error: addressError } = await getAddress();
    if (addressError || !walletAddress) return;

    const { network: walletNetwork, error: networkError } = await getNetwork();
    if (networkError) return;

    setAddress(walletAddress);
    setNetwork(walletNetwork);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const { isConnected: installed, error } = await isConnected();
      if (error || !installed) {
        throw new Error("Freighter extension is not installed");
      }

      const { address: walletAddress, error: accessError } =
        await requestAccess();
      if (accessError || !walletAddress) {
        throw new Error(accessError?.message ?? "Wallet access was rejected");
      }

      const { network: walletNetwork, error: networkError } =
        await getNetwork();
      if (networkError) throw new Error(networkError.message);

      setAddress(walletAddress);
      setNetwork(walletNetwork);
      return walletAddress;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setNetwork(null);
  }, []);

  const sign = useCallback(
    async (xdr: string, networkPassphrase: string) => {
      if (!address) throw new Error("Wallet not connected");

      const { signedTxXdr, error } = await signTransaction(xdr, {
        networkPassphrase,
      });
      if (error || !signedTxXdr) {
        throw new Error(error?.message ?? "Transaction signing failed");
      }

      return signedTxXdr;
    },
    [address],
  );

  const value = useMemo(
    () => ({
      address,
      network,
      isConnected: Boolean(address),
      isConnecting,
      connect,
      disconnect,
      refresh,
      sign,
    }),
    [address, connect, disconnect, isConnecting, network, refresh, sign],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWalletContext() {
  const value = useContext(WalletContext);
  if (!value) throw new Error("useWalletContext must be used inside WalletProvider");
  return value;
}
