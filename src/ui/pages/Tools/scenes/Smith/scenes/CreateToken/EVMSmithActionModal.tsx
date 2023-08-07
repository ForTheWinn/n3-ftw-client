import React, { useEffect, useState } from "react";
import { waitForTransaction } from "@wagmi/core";
import { Button, Result, Steps } from "antd";
import { CHAINS } from "../../../../../../../consts/chains";
import { ITokenMetadata } from "./EVM";
import Modal from "../../../../../../components/Modal";
import LoadingWithText from "../../../../../../components/Commons/LoadingWithText";
import {
  CONTRACT_MAP,
  GLOBAL_NEP_CONTRACT_ADDRESS,
} from "../../../../../../../consts/contracts";
import { INetworkType } from "../../../../../../../packages/neo/network";
import { SMITH, STATUS_STATE } from "../../../../../../../consts/global";
import { SMITH_FEE } from "../../../../../../../consts/smith";
import {
  createTokenContract,
  getContractHashFromLogs,
} from "../../../../../../../packages/polygon/contracts/smith";
import {
  getCurrentStep,
  getExplorer,
} from "../../../../../../../common/helpers";
import { waitTransactionUntilSubmmited } from "../../../../../../../common/routers/global";
import { WENT_WRONG } from "../../../../../../../consts/messages";
import {
  approve,
  getAllowances,
} from "../../../../../../../packages/polygon/contracts/swap";
import Errors from "../../../../../Swap/components/Actions/components/Errors";

interface IActionModalProps extends ITokenMetadata {
  chain: CHAINS;
  network: INetworkType;
  address: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const initialState = {
  allowlances: STATUS_STATE,
  fee: STATUS_STATE,
  deploy: STATUS_STATE,
  contractHash: undefined,
};

const steps = [
  {
    title: "Fee Allowlance Check",
    key: "allowlances",
  },
  {
    title: "Fee Token Approval",
    key: "fee",
  },
  {
    title: "Tranasction Submit",
    key: "deploy",
  },
];

const EVMSmithActionModal = ({
  chain,
  network,
  address,
  name,
  symbol,
  totalSupply,
  decimals,
  website,
  icon,
  onSuccess,
  onCancel,
}: IActionModalProps) => {
  const feeTokenContractHash = GLOBAL_NEP_CONTRACT_ADDRESS[chain][network];
  const smithTokenContractHash = CONTRACT_MAP[chain][network][SMITH];
  const fee = SMITH_FEE[chain][network];

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
    async function start() {
      let allowances: any;
      let feeTokenApprovalHash: any;
      let deployHash: any;

      handleStatus("allowlances", "processing");
      try {
        allowances = await getAllowances(chain, network, address, [
          feeTokenContractHash,
        ]);
      } catch (e: any) {
        handleStatus(
          "allowlances",
          "error",
          e.message ? e.message : WENT_WRONG
        );
        return;
      }

      handleStatus("allowlances", "success");

      if (allowances[0] < fee) {
        try {
          feeTokenApprovalHash = await approve(smithTokenContractHash, address);
        } catch (e: any) {
          handleStatus("fee", "error", e.message ? e.message : WENT_WRONG);
          return;
        }

        if (!(await handleTx("fee", feeTokenApprovalHash))) {
          return;
        }
      } else {
        handleStatus("fee", "success");
      }

      try {
        deployHash = await createTokenContract(
          chain,
          network,
          name,
          symbol,
          totalSupply,
          decimals,
          website,
          icon
        );

        handleStatus("deploy", "processing");

        const data = await waitForTransaction({ hash: deployHash });
        const contractHash = getContractHashFromLogs(data.logs);
        setState((prev) => ({
          ...prev,
          contractHash,
        }));
      } catch (e: any) {
        console.error(e);
        handleStatus("deploy", "error", e.details ? e.details : WENT_WRONG);
        return;
      }
    }

    start();
  }, []);

  const currentStep = getCurrentStep(state, steps);

  const errorMessages = [
    state.allowlances.error,
    state.fee.error,
    state.deploy.error,
  ].filter(Boolean);

  return (
    <Modal onClose={onCancel}>
      <div className="has-text-centered">
        {state.contractHash ? (
          <Result
            status="success"
            title="Successfully deployed your token contract!"
            subTitle={`contract hash: ${state.contractHash}`}
            extra={[
              <Button
                target="_blank"
                href={`${getExplorer(chain, network, "contract")}/${
                  state.contractHash
                }`}
                type="primary"
                key="console"
              >
                Details
              </Button>,
              <Button onClick={onSuccess} key="close">
                Close
              </Button>,
            ]}
          />
        ) : (
          <div className="block">
            <h3 className="title is-5">New token contract</h3>
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

export default EVMSmithActionModal;
