import { wallet as neonWallet } from "@cityofzion/neon-core";
import { CHAINS } from "../../../consts/chains";
import { getNEP17TransferScript } from "../../../packages/neo/utils";
import { IConnectedWallet } from "../../../packages/neo/wallets/interfaces";
import { INetworkType } from "../../../packages/neo/network";
import { getDefaultWitnessScope } from "../../../packages/neo/utils";
import { IMassTransaferList } from "./interfaces";
import { NEO_CHAIN } from "../../../consts/global";
import { WalletAPI } from "../../../packages/neo/wallets";

export interface IExcelData {
  type: any;
  value: any;
}

export const generatePrivatekeys = (
  chain: CHAINS,
  amount: number
): IExcelData[][] => {
  switch (chain) {
    case NEO_CHAIN:
      const list: IExcelData[][] = [];
      for (var i = 0; i < amount; i++) {
        const row: IExcelData[] = [];
        const p = neonWallet.generatePrivateKey();
        const account = new neonWallet.Account(p);
        row.push({
          type: String,
          value: account.address,
        });
        row.push({
          type: String,
          value: p,
        });
        list.push(row);
      }
      return list;
    default:
      return [];
  }
};

export const massTransfers = async (
  chain: CHAINS,
  network: INetworkType,
  list: IMassTransaferList[],
  connectedWallet?: IConnectedWallet
): Promise<string> => {
  switch (chain) {
    case NEO_CHAIN:
      if (connectedWallet) {
        const senderHash = neonWallet.getScriptHashFromAddress(
          connectedWallet.account.address
        );
        const batch: any[] = [];

        list.forEach((item) => {
          const script = getNEP17TransferScript(
            item.hash,
            senderHash,
            neonWallet.isAddress(item.address)
              ? neonWallet.getScriptHashFromAddress(item.address)
              : item.address,
            item.amount
          );
          batch.push(script);
        });

        const signers = [getDefaultWitnessScope(senderHash)];

        return WalletAPI.invokeMulti(
          connectedWallet,
          network,
          batch,
          signers
        );
      } else {
        throw new Error("Connect wallet.");
      }
    default:
      return "";
  }
};
