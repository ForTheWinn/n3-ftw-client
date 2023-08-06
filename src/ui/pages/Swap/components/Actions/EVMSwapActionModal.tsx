import React, { useEffect, useState } from "react";
import Modal from "../../../../components/Modal";
import { Steps, Typography } from "antd";
import { ITokenState } from "../../scenes/Swap/interfaces";
import LoadingWithText from "../../../../components/Commons/LoadingWithText";
import { CHAINS } from "../../../../../consts/chains";
import { INetworkType } from "../../../../../packages/neo/network";
import {
  approve,
  getAllowances,
  swap,
} from "../../../../../packages/polygon/contracts/swap";
import {
  calculateSlippage,
  getExplorer,
  parseAmount,
} from "../../../../../common/helpers";
import NFTAds from "../../../../components/Ad";
import { WENT_WRONG } from "../../../../../consts/messages";
import { waitTransactionUntilSubmmited } from "../../../../../common/routers/global";
import { DisplayAd } from "./components/DisplayAd";
import { TxResult } from "./components/TxResult";
import Errors from "./components/Errors";

interface IActionModalProps {
  chain: CHAINS;
  network: INetworkType;
  address: any;
  tokenA: ITokenState;
  tokenB: ITokenState;
  amountA: string;
  amountB: string;
  slippage: number;
  isReverse: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const statusState = {
  isProcessing: false,
  success: false,
  error: "",
};

const initialState = {
  allowlances: statusState,
  tokenA: statusState,
  swap: statusState,
  txid: undefined,
};

const steps = [
  {
    title: "Allowlance checks",
    key: "allowlances",
  },
  {
    key: "tokenA",
  },
  {
    title: "Tranasction Submit",
    key: "swap",
  },
];

const getCurrentStep = (state) => {
  for (let i = steps.length - 1; i >= 0; i--) {
    if (state[steps[i].key].success) return i + 2;
  }
  return 1;
};

const ActionModal = (props: IActionModalProps) => {
  const {
    tokenA,
    tokenB,
    amountA,
    amountB,
    slippage,
    address,
    chain,
    isReverse,
    network,
    onSuccess,
    onCancel,
  } = props;
  const [state, setState] = useState(initialState);
  const parsedAmountA = parseAmount(amountA, tokenA.decimals);
  const parsedAmountB = parseAmount(amountB, tokenB.decimals);
  const maxAmountAIn = parsedAmountA
    .add(calculateSlippage(parsedAmountA, slippage))
    .toString();
  const minAmountBOut = parsedAmountB
    .sub(calculateSlippage(parsedAmountB, slippage))
    .toString();

  const handleTx = async (stepKey: string, txid: any): Promise<boolean> => {
    handleStatus(stepKey, "processing");
    try {
      await waitTransactionUntilSubmmited(chain, network, txid);
      handleStatus(stepKey, "success");
      return true;
    } catch (e: any) {
      console.error(e);
      handleStatus(stepKey, "error", e.message ? e.message : WENT_WRONG);
      return false;
    }
  };

  const handleStatus = (
    stepKey: string,
    status: "processing" | "success" | "error",
    error?: string
  ) => {
    setState((prev) => {
      let updatedStatus = { ...statusState };

      if (status === "processing") {
        updatedStatus.isProcessing = true;
      } else if (status === "success") {
        updatedStatus.success = true;
      } else if (status === "error" && error) {
        updatedStatus.error = error;
      }

      return {
        ...prev,
        [stepKey]: updatedStatus,
      };
    });
  };
  const doInvoke = async () => {
    let allowances: any;
    let tokenApprovalHash: any;
    let swapHash: any;

    handleStatus("allowlances", "processing");

    try {
      allowances = await getAllowances(chain, network, address, [tokenA.hash]);
    } catch (e: any) {
      handleStatus("allowlances", "error", e.message ? e.message : WENT_WRONG);
      return;
    }

    handleStatus("allowlances", "success");

    if (parsedAmountA.gt(allowances[0])) {
      try {
        tokenApprovalHash = await approve(tokenA.hash, address);
      } catch (e: any) {
        handleStatus("tokenA", "error", e.message ? e.message : WENT_WRONG);
        return;
      }

      if (!(await handleTx("tokenA", tokenApprovalHash))) {
        return;
      }
    } else {
      handleStatus("tokenA", "success");
    }

    try {
      swapHash = await swap(chain, network, {
        tokenA: tokenA.hash,
        tokenB: tokenB.hash,
        amountIn: isReverse ? maxAmountAIn : parsedAmountA.toString(),
        amountOut: isReverse ? parsedAmountB.toString() : minAmountBOut,
        isReverse,
      });
    } catch (e: any) {
      handleStatus("swap", "error", e.details ? e.details : WENT_WRONG);
      return;
    }

    if (!(await handleTx("swap", swapHash))) {
      return;
    }

    setState((prev) => ({
      ...prev,
      txid: swapHash,
    }));
  };

  useEffect(() => {
    doInvoke();
  }, [tokenA, tokenB]);

  const currentStep = getCurrentStep(state);

  const errorMessages = [
    state.tokenA.error,
    state.swap.error,
    state.allowlances.error,
  ].filter(Boolean);

  return (
    <Modal onClose={onCancel}>
      <div className="has-text-centered">
        <h3 className="title is-5">Swap</h3>

        <div className="block">
          {state.txid ? (
            <TxResult
              txid={state.txid}
              chain={chain}
              network={network}
              onClose={onSuccess}
            />
          ) : state.swap.isProcessing ? (
            <DisplayAd />
          ) : (
            <Steps
              progressDot={true}
              current={currentStep}
              items={steps.map((step) => {
                return {
                  title: step.title
                    ? step.title
                    : `${props[step.key].symbol} Approval`,
                  description: state[step.key].isProcessing ? (
                    <LoadingWithText title="processing" />
                  ) : state[step.key].success ? (
                    "success"
                  ) : state[step.key].error ? (
                    "error"
                  ) : (
                    ""
                  ),
                };
              })}
            />
          )}
        </div>
        
        {errorMessages.length > 0 && (
          <div className="block">
            <Errors
              errorMessages={errorMessages.join(" ")}
              onClose={onCancel}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ActionModal;
