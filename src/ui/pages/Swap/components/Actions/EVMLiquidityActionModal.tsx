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
} from "../../../../../packages/evm/contracts/swap";
import { waitTransactionUntilSubmmited } from "../../../../../common/routers/global";
import { getCurrentStep, parseAmount } from "../../../../../common/helpers";
import { WENT_WRONG } from "../../../../../consts/messages";
import { DisplayAd } from "./components/DisplayAd";
import Errors from "./components/Errors";
import { TxResult } from "./components/TxResult";
import { STATUS_STATE, SWAP } from "../../../../../consts/global";
import { CONTRACT_MAP } from "../../../../../consts/contracts";

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

const initialState = {
  allowlances: STATUS_STATE,
  tokenA: STATUS_STATE,
  tokenB: STATUS_STATE,
  provide: STATUS_STATE,
  txid: undefined,
};

const steps = [
  {
    title: "Allowlance Checks",
    key: "allowlances",
  },
  {
    key: "tokenA",
  },
  {
    key: "tokenB",
  },
  {
    title: "Tranasction Submit",
    key: "provide",
  },
];

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
      let updatedStatus = { ...STATUS_STATE };

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
    const swapContractHash = CONTRACT_MAP[chain][network][SWAP];

    handleStatus("allowlances", "processing");

    try {
      allowances = await getAllowances(
        chain,
        network,
        address,
        [tokenA.hash, tokenB.hash],
        swapContractHash
      );
    } catch (e: any) {
      handleStatus("allowlances", "error", e.message ? e.message : WENT_WRONG);
      return;
    }

    handleStatus("allowlances", "success");

    if (parsedAmountA > allowances[0]) {
      try {
        tokenAApprovalHash = await approve(chain, network, tokenA.hash, swapContractHash);
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
    if (parsedAmountB > allowances[1]) {
      try {
        tokenBApprovalHash = await approve(chain, network, tokenB.hash, swapContractHash);
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

  const currentStep = getCurrentStep(state, steps);

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
