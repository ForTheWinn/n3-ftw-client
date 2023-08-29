import React, { useEffect, useState } from "react";
import Modal from "../../../../components/Modal";
import { Steps } from "antd";
import { waitForTransaction, writeContract } from "@wagmi/core";
import LoadingWithText from "../../../../components/Commons/LoadingWithText";
import { CHAINS } from "../../../../../consts/chains";
import { INetworkType } from "../../../../../packages/neo/network";
import { swapRouter } from "../../../../../common/routers";
import {
  isApprovedForAll,
  setApprovalForAll,
} from "../../../../../packages/polygon/contracts/swap";
import { NEO_CHAIN, STATUS_STATE, SWAP } from "../../../../../consts/global";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { waitTransactionUntilSubmmited } from "../../../../../common/routers/global";
import { CONTRACT_MAP } from "../../../../../consts/contracts";
import { getCurrentStep, getExplorer } from "../../../../../common/helpers";
import Errors from "../../components/Actions/components/Errors";
import { WENT_WRONG } from "../../../../../consts/messages";

interface IActionModalProps {
  chain: CHAINS;
  network: INetworkType;
  address: string;
  tokenId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const initialState = {
  allowlances: STATUS_STATE,
  approve: STATUS_STATE,
  withdraw: STATUS_STATE,
  txid: undefined,
};

const steps = [
  {
    title: "Allowlance Checks",
    key: "allowlances",
  },
  {
    title: "Token Approval",
    key: "approve",
  },
  {
    title: "Tranasction Submit",
    key: "withdraw",
  },
];

const EVMRemoveLiquidityActionModal = ({
  chain,
  network,
  address,
  tokenId,
  onSuccess,
  onCancel,
}: IActionModalProps) => {
  const [state, setState] = useState(initialState);

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

  useEffect(() => {
    const diInvoke = async () => {
      const swapContractAddress = CONTRACT_MAP[chain][network][SWAP];
      let isApproved: any = false;
      let approveHash;
      let withdrawHash;

      handleStatus("allowlances", "processing");

      try {
        isApproved = await isApprovedForAll(
          network,
          address,
          swapContractAddress
        );
        handleStatus("allowlances", "success");
      } catch (e: any) {
        handleStatus(
          "allowlances",
          "error",
          e.message ? e.message : WENT_WRONG
        );
        return;
      }

      if (!isApproved) {
        try {
          approveHash = await setApprovalForAll(network, swapContractAddress);

          if (!(await handleTx("approve", approveHash)) === false) {
            return;
          }
        } catch (e: any) {
          handleStatus("approve", "error", e.message ? e.message : WENT_WRONG);
          return;
        }
      } else {
        handleStatus("approve", "success");
      }

      try {
        withdrawHash = await swapRouter.removeLiquidity(
          chain,
          network,
          tokenId
        );

        await handleTx("withdraw", withdrawHash);
        
        setState((prev) => {
          return {
            ...prev,
            txid: withdrawHash,
          };
        });
      } catch (e: any) {
        handleStatus("withdraw", "error", e.message ? e.message : WENT_WRONG);
        return;
      }
    };

    diInvoke();
  }, []);

  const currentStep = getCurrentStep(state, steps);

  const errorMessages = [
    state.allowlances.error,
    state.approve.error,
    state.withdraw.error,
  ].filter(Boolean);

  return (
    <Modal onClose={onCancel}>
      <div className="has-text-centered">
        <h3 className="title is-5">Withdraw LP Tokens</h3>
        <div className="block">
          <Steps
            progressDot={true}
            current={currentStep}
            items={steps.map((step) => {
              return {
                title: step.title,
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
        </div>

        {state.withdraw.success && (
          <div className="block">
            <div className="buttons" style={{ justifyContent: "center" }}>
              <a
                className="button is-primary"
                target="_blank"
                href={`${getExplorer(chain, network, "tx")}/${state.txid}`}
                rel="noreferrer"
              >
                View txid on explorer
              </a>
              <button onClick={onSuccess} className="button is-black">
                Close
              </button>
            </div>
          </div>
        )}

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

export default EVMRemoveLiquidityActionModal;
