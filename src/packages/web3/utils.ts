import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { MetaMask } from "@web3-react/metamask";
import type { Connector } from "@web3-react/types";
import { COINBASE_WALLET, META_MASK } from "./consts";
import { IETHWalletType } from "../neo/wallet/interfaces";

export function getKey(connector: Connector): IETHWalletType | undefined {
  if (connector instanceof MetaMask) return META_MASK;
  if (connector instanceof CoinbaseWallet) return COINBASE_WALLET;
  return undefined;
}
