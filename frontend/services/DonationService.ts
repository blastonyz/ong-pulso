import { stellarConfig } from "@/constants/stellar";
import {
  Asset,
  BASE_FEE,
  Horizon,
  Memo,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

export class DonationService {
  private readonly horizon = new Horizon.Server(
    stellarConfig.network === "mainnet"
      ? "https://horizon.stellar.org"
      : "https://horizon-testnet.stellar.org",
  );

  async donateXlm({
    from,
    to,
    amount,
    milestoneId,
    sign,
  }: {
    from: string;
    to: string;
    amount: string;
    milestoneId: number;
    sign: (xdr: string, networkPassphrase: string) => Promise<string>;
  }) {
    const account = await this.horizon.loadAccount(from);
    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase:
        stellarConfig.network === "mainnet" ? Networks.PUBLIC : Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: to,
          asset: Asset.native(),
          amount,
        }),
      )
      .addMemo(Memo.text(`milestone:${milestoneId}`))
      .setTimeout(180)
      .build();

    const signedXdr = await sign(tx.toXDR(), stellarConfig.networkPassphrase);
    const signed = TransactionBuilder.fromXDR(
      signedXdr,
      stellarConfig.networkPassphrase,
    );

    return this.horizon.submitTransaction(signed);
  }
}
