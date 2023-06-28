import { useAccount } from "wagmi";
import { CHAINS } from "../../consts/chains";
import { useNeoWallets } from "./use-neo-wallets";
import { NEO_CHAIN } from "../../consts/global";

interface IWalletRouter {
  isConnected: boolean;
  address: string;
}
export const useWalletRouter = (chain: CHAINS): IWalletRouter => {
  const { connectedWallet } = useNeoWallets();
  const { isConnected, address } = useAccount();
  if (chain === NEO_CHAIN) {
    return {
      isConnected: !!connectedWallet,
      address: connectedWallet ? connectedWallet.account.address : ""
    };
  } else {
    return {
      isConnected,
      address: address as string
    };
  }
};
