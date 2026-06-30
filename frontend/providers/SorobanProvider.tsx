"use client";

import {
  Client as FundingAgreementClient,
  type Client as FundingAgreementClientType,
} from "@/contracts/funding-agreement/src";
import { stellarConfig } from "@/constants/stellar";
import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";

type SorobanContextValue = {
  network: string;
  rpcUrl: string;
  networkPassphrase: string;
  fundingAgreementContractId: string;
  fundingAgreement: FundingAgreementClientType;
};

const SorobanContext = createContext<SorobanContextValue | null>(null);

export function SorobanProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => {
    const fundingAgreement = new FundingAgreementClient({
      contractId: stellarConfig.fundingAgreementContractId,
      networkPassphrase: stellarConfig.networkPassphrase,
      rpcUrl: stellarConfig.rpcUrl,
    });

    return {
      network: stellarConfig.network,
      rpcUrl: stellarConfig.rpcUrl,
      networkPassphrase: stellarConfig.networkPassphrase,
      fundingAgreementContractId: stellarConfig.fundingAgreementContractId,
      fundingAgreement,
    };
  }, []);

  return (
    <SorobanContext.Provider value={value}>{children}</SorobanContext.Provider>
  );
}

export function useSorobanContext() {
  const value = useContext(SorobanContext);
  if (!value) {
    throw new Error("useSorobanContext must be used inside SorobanProvider");
  }
  return value;
}
