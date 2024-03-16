import React, { useEffect, useState } from "react";
import Modal from "../../../../components/Modal";
import { Typography } from "antd";
import { IToken } from "../../../../../consts/tokens";
import { CHAINS } from "../../../../../consts/chains";
import { INetworkType } from "../../../../../packages/neo/network";
import { waitTransactionUntilSubmmited } from "../../../../../common/routers/global";
import { calculateSlippage } from "../../../../../common/helpers";
import { WENT_WRONG } from "../../../../../consts/messages";
import { IConnectedWallet } from "../../../../../packages/neo/wallets/interfaces";
import { DisplayAd } from "./components/DisplayAd";
import { TxResult } from "../../../../components/TxResult";
import Errors from "./components/Errors";
import { SwapContract } from "../../../../../packages/neo/contracts/ftw/swap";
import { ethers } from "ethers";

interface IActionModalProps {
  chain: CHAINS;
  network: INetworkType;
  tokenA: IToken;
  tokenB: IToken;
  amountA: string;
  amountB: string;
  slippage: number;
  type: "swap" | "liquidity";
  isReverse: boolean;
  connectedWallet: IConnectedWallet;
  isWrapping: boolean;
  isUnWrapping: boolean;
  isSwapWithWrapping: boolean;
  isSwapWithUnWrapping: boolean;
  lockUntil: Date | undefined;
  onSuccess: () => void;
  onCancel: () => void;
}

const initialState = {
  isProcessing: false,
  success: false,
  error: "",
  txid: undefined,
};

const NeoActionModal = (props: IActionModalProps) => {
  const {
    tokenA,
    tokenB,
    amountA,
    amountB,
    slippage,
    type,
    chain,
    isReverse,
    network,
    connectedWallet,
    isWrapping,
    isUnWrapping,
    isSwapWithWrapping,
    isSwapWithUnWrapping,
    lockUntil,
    onSuccess,
    onCancel,
  } = props;
  const [state, setState] = useState(initialState);

  const parsedAmountA = ethers.parseUnits(amountA, tokenA.decimals);
  const parsedAmountB = ethers.parseUnits(amountB, tokenB.decimals);

  const maxAmountAIn =
    parsedAmountA + calculateSlippage(parsedAmountA, slippage);
  const minAmountBOut =
    parsedAmountB - calculateSlippage(parsedAmountB, slippage);

  const actionHandler = async () => {
    if (type === "swap") {
      if (isWrapping || isUnWrapping) {
        if (isWrapping) {
          return await new SwapContract(network).mintBNEO(
            connectedWallet,
            parsedAmountA.toString()
          );
        } else {
          return await new SwapContract(network).burnBNEO(
            connectedWallet,
            parsedAmountB.toString()
          );
        }
      } else {
        if (isReverse) {
          if (isSwapWithUnWrapping) {
            return await new SwapContract(network).swapBWithNEO(
              connectedWallet,
              tokenA.hash,
              parsedAmountB.toString(),
              maxAmountAIn.toString()
            );
          } else {
            return await new SwapContract(network).swapBtoA(
              connectedWallet,
              tokenA.hash,
              tokenB.hash,
              parsedAmountB.toString(),
              maxAmountAIn
            );
          }
        } else {
          if (isSwapWithWrapping) {
            return await new SwapContract(network).swapWithNEO(
              connectedWallet,
              parsedAmountA.toString(),
              tokenB.hash,
              minAmountBOut.toString()
            );
          } else {
            return await new SwapContract(network).swap(
              connectedWallet,
              tokenA.hash,
              parsedAmountA.toString(),
              tokenB.hash,
              minAmountBOut.toString()
            );
          }
        }
      }
    } else if (type === "liquidity") {
      return await new SwapContract(network).provide(
        connectedWallet,
        isReverse ? tokenB.hash : tokenA.hash,
        isReverse ? parsedAmountB.toString() : parsedAmountA.toString(),
        isReverse ? tokenA.hash : tokenB.hash,
        isReverse ? parsedAmountA.toString() : parsedAmountB.toString(),
        lockUntil, // Deprecated LP lock
        slippage * 100 // BPS
      );
    }
  };

  const doInvoke = async () => {
    let txid;
    try {
      txid = await actionHandler();
    } catch (e: any) {
      setState((prev) => ({
        ...prev,
        error: e.message
          ? e.message
          : e.description
          ? e.description
          : WENT_WRONG,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isProcessing: true }));

    try {
      await waitTransactionUntilSubmmited(chain, network, txid as string);
      setState((prev) => ({
        ...prev,
        isProcessing: false,
      }));
    } catch (e: any) {
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        error: e.message
          ? e.message
          : e.description
          ? e.description
          : WENT_WRONG,
      }));
      return;
    }

    setState((prev) => ({ ...prev, txid }));
  };

  useEffect(() => {
    doInvoke();
  }, [tokenA, tokenB]);

  return (
    <Modal onClose={onCancel}>
      <div className="has-text-centered">
        <h3 className="title is-5 has-text-centered">
          {type === "swap" ? "Swap" : "Add Liquidity"}
        </h3>

        <div className="block">
          {!state.isProcessing &&
            !state.txid &&
            !state.error &&
            !state.success && (
              <Typography.Text>
                Approve this transaction in your wallet to continue
              </Typography.Text>
            )}

          {state.isProcessing && <DisplayAd />}

          {state.txid && (
            <TxResult
              txid={state.txid}
              chain={chain}
              network={network}
              onClose={onSuccess}
            />
          )}

          {state.error && (
            <Errors errorMessages={state.error} onClose={onCancel} />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default NeoActionModal;
