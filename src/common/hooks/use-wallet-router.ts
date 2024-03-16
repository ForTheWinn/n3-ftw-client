import { useAccount } from "wagmi";
import { CHAINS } from "../../consts/chains";
import { useNeoWallets } from "./use-neo-wallets";
import { NEO_CHAIN } from "../../consts/global";
import { useMemo } from "react";

interface IWalletRouter {
  isConnected: boolean;
  address: string;
  client: any;
}
export const useWalletRouter = (chain: CHAINS): IWalletRouter => {
  const { connectedWallet } = useNeoWallets();
  const { isConnected, address } = useAccount();

  return useMemo(() => {
    if (chain === NEO_CHAIN) {
      return {
        isConnected: !!connectedWallet,
        address: connectedWallet ? connectedWallet.account.address : "",
        client: connectedWallet,
      };
    } else {
      return {
        isConnected,
        address: address as string,
        client: null,
      };
    }
  }, [chain, connectedWallet, isConnected, address]); // Dependencies
};
