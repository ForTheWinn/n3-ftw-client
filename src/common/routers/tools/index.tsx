import { wallet as neonWallet } from "@cityofzion/neon-core";
import { CHAINS } from "../../../consts/chains";
import { getNEP17TransferScript } from "../../../packages/neo/utils";
import { IConnectedWallet } from "../../../packages/neo/wallets/interfaces";
import { INetworkType } from "../../../packages/neo/network";
import { wallet } from "../../../packages/neo";
import { DEFAULT_WITNESS_SCOPE } from "../../../packages/neo/consts";
import { IMassTransaferList } from "./interfaces";
import { ETH_CHAIN, NEO_CHAIN, POLYGON_CHAIN } from "../../../consts/global";

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
    case POLYGON_CHAIN || ETH_CHAIN:
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

        const signers = [DEFAULT_WITNESS_SCOPE(senderHash)];

        return wallet.WalletAPI.invokeMulti(
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
