import { IConnectedWallet } from "../wallets/interfaces";

export const validateConnectedWallet = (connectedWallet?: IConnectedWallet) => {
  if (
    !connectedWallet ||
    !connectedWallet.account ||
    !connectedWallet.network
  ) {
    return undefined;
  }
  return connectedWallet;
};
