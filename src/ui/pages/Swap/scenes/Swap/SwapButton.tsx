import { useWeb3React } from "@web3-react/core";
import React from "react";
import { useApp } from "../../../../../common/hooks/use-app";
import {
  NEO_CHAIN,
  POLYGON_CHAIN,
} from "../../../../../packages/chains/consts";
import { IConnectedWallet } from "../../../../../packages/neo/wallet/interfaces";
import { useWallet } from "../../../../../packages/provider";

interface ISwapButtonProps {
  data?: any;
  tokenA?: any;
  amountA?: any;
  amountB?: any;
  isLoading: boolean;
}
const SwapButton = ({
  data,
  tokenA,
  amountA,
  amountB,
  isLoading,
}: ISwapButtonProps) => {
  const { chain } = useApp();
  const { connectedWallet } = useWallet();
  const { isActive } = useWeb3React();
  let isWalletConnected = false;
  if (chain === NEO_CHAIN) {
    isWalletConnected = !!connectedWallet;
  } else if (chain === POLYGON_CHAIN) {
    isWalletConnected = isActive;
  }
  return (
    <button
      disabled={
        !amountA ||
        !amountB ||
        (tokenA && data && data.userBalances[tokenA.hash] < amountA)
      }
      //   onClick={connectedWallet ? onSwap : toggleWalletSidebar}
      className={`button is-fullwidth is-primary ${
        isLoading ? "is-loading" : ""
      }`}
    >
      {isWalletConnected ? "Swap" : "Connect wallet"}
    </button>
  );
};

export default SwapButton;
