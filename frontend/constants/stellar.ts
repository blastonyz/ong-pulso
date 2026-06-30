import { Networks } from "@stellar/stellar-sdk";

const network = process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "testnet";

export const stellarConfig = {
  network,
  rpcUrl:
    process.env.NEXT_PUBLIC_STELLAR_RPC_URL ??
    "https://soroban-testnet.stellar.org",
  networkPassphrase:
    network === "mainnet" ? Networks.PUBLIC : Networks.TESTNET,
  fundingAgreementContractId:
    process.env.NEXT_PUBLIC_FUNDING_AGREEMENT_CONTRACT_ID ??
    "CCZBRUVFYUBH7DMWCQFL7LYO2V5UNVPSI2HAK7HCJA3IWCEE2QGFO5ZA",
};
