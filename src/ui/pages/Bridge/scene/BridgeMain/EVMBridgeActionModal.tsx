import React, { useEffect, useState } from "react";
import { waitForTransactionReceipt } from "@wagmi/core";
import { Steps } from "antd";

import { INetworkType } from "../../../../../packages/neo/network";
import { CHAINS, CONFIGS } from "../../../../../consts/chains";
import { isBurned } from "../../../../../packages/neo/contracts/ftw/bridge";
import { IBridgeReceiver, IBridgeSelectedtoken } from "../../interfaces";
import Modal from "../../../../components/Modal";
import LoadingWithText from "../../../../components/Commons/LoadingWithText";
import { IBridgeChain } from "../../../../../common/routers/bridge/interfaces";
import { BRIDGE_CONTRACTS } from "../../../../../consts/bridge";
import {
  burn,
  getMintoNoFromLogs,
} from "../../../../../packages/evm/contracts/bridge";
import { getCurrentStep, getExplorer } from "../../../../../common/helpers";
import { getScriptHashFromAddressWithPrefix } from "../../../../../packages/neo/utils";
import { GLOBAL_NEP_CONTRACT_ADDRESS } from "../../../../../consts/contracts";
import { waitTransactionUntilSubmmited } from "../../../../../common/routers/global";
import { WENT_WRONG } from "../../../../../consts/messages";
import { STATUS_STATE } from "../../../../../consts/global";
import {
  approve,
  getAllowances,
} from "../../../../../packages/evm/contracts/swap";
import Errors from "../../../Swap/components/Actions/components/Errors";
import { ethers } from "ethers";
import { wagmiConfig } from "../../../../../wagmi-config";

const initialState = {
  allowlances: STATUS_STATE,
  token: STATUS_STATE,
  fee: STATUS_STATE,
  burn: STATUS_STATE,
  mint: STATUS_STATE,
  txid: undefined,
};

const steps = [
  {
    title: "Fee Allowlance Check",
    key: "allowlances",
  },
  {
    title: "Token Approval",
    key: "token",
  },
  {
    title: "Fee Approval",
    key: "fee",
  },
  {
    title: "Token Burn",
    key: "burn",
  },
  {
    title: "Token Mint",
    key: "mint",
  },
];

interface IActionModalProps {
  chain: CHAINS;
  originChain: IBridgeChain;
  destChain: IBridgeChain;
  network: INetworkType;
  address: any;
  token: IBridgeSelectedtoken;
  amount: string;
  receiver: IBridgeReceiver;
  fee: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const EVMBridgeActionModal = ({
  token,
  amount,
  address,
  chain,
  originChain,
  destChain,
  receiver,
  network,
  fee,
  onSuccess,
  onCancel,
}: IActionModalProps) => {
  const bridgeAmount = ethers.parseUnits(amount, token.decimals);
  const chainId = CONFIGS[network][chain].chainId;
  const evmBridgeContractHash =
    BRIDGE_CONTRACTS[network][chainId][destChain.chainId];
  const neoBridgeContractHash =
    BRIDGE_CONTRACTS[network][destChain.chainId][originChain.chainId];
  const nepTokenContractHash = GLOBAL_NEP_CONTRACT_ADDRESS[chain][network];

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
    async function doInvoke() {
      let allowances: any;
      let tokenApprovalHash: any;
      let feeApprovalHash: any;
      let burnHash: any;
      let burnNo: any;

      handleStatus("allowlances", "processing");

      try {
        allowances = await getAllowances(
          chain,
          network,
          address,
          [token.hash, nepTokenContractHash],
          evmBridgeContractHash
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

      if (allowances[0] < bridgeAmount) {
        try {
          tokenApprovalHash = await approve(
            chain,
            network,
            token.hash,
            evmBridgeContractHash
          );
        } catch (e: any) {
          handleStatus("token", "error", e.message ? e.message : WENT_WRONG);
          return;
        }

        if (!(await handleTx("token", tokenApprovalHash))) {
          return;
        }
      } else {
        handleStatus("token", "success");
      }

      if (allowances[1] < ethers.parseUnits(fee, 8)) {
        try {
          feeApprovalHash = await approve(
            chain,
            network,
            nepTokenContractHash,
            evmBridgeContractHash
          );
        } catch (e: any) {
          handleStatus("fee", "error", e.message ? e.message : WENT_WRONG);
          return;
        }

        if (!(await handleTx("fee", feeApprovalHash))) {
          return;
        }
      } else {
        handleStatus("fee", "success");
      }

      try {
        burnHash = await burn(
          chainId,
          evmBridgeContractHash,
          token.hash,
          getScriptHashFromAddressWithPrefix(receiver.address),
          bridgeAmount.toString()
        );

        handleStatus("burn", "processing");

        const data = await waitForTransactionReceipt(wagmiConfig, {
          hash: burnHash,
        });

        burnNo = getMintoNoFromLogs(data.logs);

        handleStatus("burn", "success");
      } catch (e: any) {
        console.error(e);
        handleStatus("burn", "error", e.details ? e.details : WENT_WRONG);
        return;
      }

      try {
        handleStatus("mint", "processing");
        await isBurned(destChain.rpc, neoBridgeContractHash, burnNo);
        handleStatus("mint", "success");
      } catch (e: any) {
        console.error(e);
        handleStatus("mint", "error", e.details ? e.details : WENT_WRONG);
        return;
      }
    }

    doInvoke();
  }, [token]);

  const currentStep = getCurrentStep(state, steps);

  const errorMessages = [
    state.allowlances.error,
    state.token.error,
    state.fee.error,
    state.burn.error,
    state.mint.error,
  ].filter(Boolean);

  return (
    <Modal onClose={onCancel}>
      <div className="has-text-centered">
        <h3 className="title is-5">Bridging</h3>

        <div className="block">
          <Steps
            direction="vertical"
            size="small"
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

        {state.burn.success && state.mint.success && (
          <div className="block">
            <div className="buttons" style={{ justifyContent: "center" }}>
              <a
                className="button is-primary"
                target="_blank"
                href={`${getExplorer(
                  destChain.type as CHAINS,
                  network,
                  "account"
                )}/${receiver.address}`}
                rel="noreferrer"
              >
                Check balance
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

export default EVMBridgeActionModal;
