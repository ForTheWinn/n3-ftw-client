import { wallet as neonWallet } from "@cityofzion/neon-core";
import { CHAINS, NEO_CHAIN, POLYGON_CHAIN } from "../../../consts/chains";
import { ITokenState } from "../../../ui/pages/Swap/scenes/Swap/interfaces";
import { getNEP17TransferScript } from "../../../packages/neo/utils";
import { IConnectedWallet } from "../../../packages/neo/wallets/interfaces";
import { ethers } from "ethers";
import { INetworkType } from "../../../packages/neo/network";
import { wallet } from "../../../packages/neo";
import { DEFAULT_WITNESS_SCOPE } from "../../../packages/neo/consts";

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
          value: account.address
        });
        row.push({
          type: String,
          value: p
        });
        list.push(row);
      }
      return list;
    case POLYGON_CHAIN:
      return [];
  }
};

export const massTransfers = async (
  chain: CHAINS,
  network: INetworkType,
  token: ITokenState,
  amount: number,
  list: string[],
  connectedWallet?: IConnectedWallet
): Promise<string> => {
  console.log(connectedWallet);
  switch (chain) {
    case NEO_CHAIN:
      if (connectedWallet) {
        const senderHash = neonWallet.getScriptHashFromAddress(
          connectedWallet.account.address
        );
        const batch: any[] = [];

        list.forEach((address) => {
          const script = getNEP17TransferScript(
            token.hash,
            senderHash,
            neonWallet.getScriptHashFromAddress(address),
            ethers.utils
              .parseUnits(amount.toString(), token.decimals)
              .toString()
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
