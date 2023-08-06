import React, { useEffect, useState } from "react";
import Modal from "../../../../components/Modal";
import { Steps } from "antd";
import { ITokenState } from "../../scenes/Swap/interfaces";
import LoadingWithText from "../../../../components/Commons/LoadingWithText";
import { CHAINS } from "../../../../../consts/chains";
import { INetworkType } from "../../../../../packages/neo/network";
import {
  approve,
  getAllowances,
  provide,
} from "../../../../../packages/polygon/contracts/swap";
import { waitTransactionUntilSubmmited } from "../../../../../common/routers/global";
import { parseAmount } from "../../../../../common/helpers";
import { WENT_WRONG } from "../../../../../consts/messages";
import { DisplayAd } from "./components/DisplayAd";
import Errors from "./components/Errors";
import { TxResult } from "./components/TxResult";

interface IActionModalProps {
  chain: CHAINS;
  network: INetworkType;
  address: any;
  tokenA: ITokenState;
  tokenB: ITokenState;
  amountA: string;
  amountB: string;
  slippage: number;
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
  tokenB: statusState,
  provide: statusState,
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
    key: "tokenB",
  },
  {
    title: "Tranasction submit",
    key: "provide",
  },
];

const getCurrentStep = (state) => {
  if (state.provide.success) return 5;
  if (state.tokenB.success) return 4;
  if (state.tokenA.success) return 3;
  if (state.allowlances.success) return 2;
  return 1;
};

const EVMLiquidityActionModal = (props: IActionModalProps) => {
  const {
    tokenA,
    tokenB,
    amountA,
    amountB,
    slippage,
    address,
    onSuccess,
    onCancel,
    chain,
    network,
  } = props;
  const [state, setState] = useState(initialState);

  const parsedAmountA = parseAmount(amountA, tokenA.decimals);
  const parsedAmountB = parseAmount(amountB, tokenB.decimals);

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
    let tokenAApprovalHash: any;
    let tokenBApprovalHash: any;
    let provideHash: any;

    handleStatus("allowlances", "processing");

    try {
      allowances = await getAllowances(chain, network, address, [
        tokenA.hash,
        tokenB.hash,
      ]);
    } catch (e: any) {
      handleStatus("allowlances", "error", e.message ? e.message : WENT_WRONG);
      return;
    }

    handleStatus("allowlances", "success");

    if (parsedAmountA.gt(allowances[0])) {
      try {
        tokenAApprovalHash = await approve(tokenA.hash, address);
      } catch (e: any) {
        handleStatus("tokenA", "error", e.message ? e.message : WENT_WRONG);
        return;
      }

      if (!(await handleTx("tokenA", tokenAApprovalHash))) {
        return;
      }
    } else {
      handleStatus("tokenA", "success");
    }

    if (parsedAmountB.gt(allowances[1])) {
      try {
        tokenBApprovalHash = await approve(tokenB.hash, address);
      } catch (e: any) {
        handleStatus("tokenB", "error", e.message ? e.message : WENT_WRONG);
        return;
      }

      if (!(await handleTx("tokenB", tokenBApprovalHash))) {
        return;
      }
    } else {
      handleStatus("tokenB", "success");
    }

    try {
      provideHash = await provide(chain, network, {
        tokenA: tokenA.hash,
        tokenB: tokenB.hash,
        amountA: parsedAmountA.toString(),
        amountB: parsedAmountB.toString(),
        slippage: slippage * 100, // BPS
      });
    } catch (e: any) {
      handleStatus("provide", "error", e.message ? e.message : WENT_WRONG);
      return;
    }

    if (!(await handleTx("provide", provideHash))) {
      return;
    }

    setState((prev) => ({
      ...prev,
      txid: provideHash,
    }));
  };

  useEffect(() => {
    doInvoke();
  }, [tokenA, tokenB]);

  const currentStep = getCurrentStep(state);

  const errorMessages = [
    state.tokenA.error,
    state.tokenB.error,
    state.provide.error,
    state.allowlances.error,
  ].filter(Boolean);

  return (
    <Modal onClose={onCancel}>
      <div className="has-text-centered">
        <h3 className="title is-5">Add Liquidity</h3>
        <div className="block">
          {state.txid ? (
            <TxResult
              txid={state.txid}
              chain={chain}
              network={network}
              onClose={onSuccess}
            />
          ) : state.provide.isProcessing ? (
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

export default EVMLiquidityActionModal;
