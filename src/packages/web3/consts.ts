/* Wallets */
import {IETHWalletType} from "../neo/wallet/interfaces";

export const META_MASK = "META_MASK";
export const COINBASE_WALLET = "COINBASE_WALLET";
export const ETH_WALLET_LIST: {
  label: string;
  key: IETHWalletType;
}[] = [
  {
    label: "Meta Mask",
    key: META_MASK,
  },
	{
		label: "Coinbase",
		key: COINBASE_WALLET,
	},
];
