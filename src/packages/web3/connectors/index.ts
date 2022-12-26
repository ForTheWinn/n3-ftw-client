import {
  Web3ReactHooks,
} from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { hooks as metaMaskHooks, metaMask } from "./metaMask";
import { hooks as coinbaseWalletHooks, coinbaseWallet } from './coinbaseWallet'

export const connectors: [MetaMask | CoinbaseWallet, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [coinbaseWallet, coinbaseWalletHooks],
];
