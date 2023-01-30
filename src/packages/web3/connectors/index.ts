import { Web3ReactHooks } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { Network } from "@web3-react/network";
import { hooks as metaMaskHooks, metaMask } from "./metaMask";
import { hooks as coinbaseWalletHooks, coinbaseWallet } from "./coinbaseWallet";
import { hooks as networkHooks, network } from "./network";

export const connectors: [
  MetaMask | CoinbaseWallet | Network,
  Web3ReactHooks
][] = [
  [metaMask, metaMaskHooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [network, networkHooks],
];
