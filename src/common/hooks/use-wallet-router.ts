import { useAccount } from "wagmi";
import { CHAINS, NEO_CHAIN } from "../../consts/chains";
import { useWallet } from "../../packages/neo/provider";

interface IWalletRouter {
  isConnected: boolean;
  address: string;
}
export const useWalletRouter = (chain: CHAINS): IWalletRouter => {
  const { connectedWallet } = useWallet();
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
