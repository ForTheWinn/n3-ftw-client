import React, { useEffect, useState } from "react";
import {
  readContract,
  erc20ABI,
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";
import { Steps } from "antd";

import { ethers } from "ethers";
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
} from "../../../../../packages/polygon/contracts/bridge";
import { getExplorer } from "../../../../../common/helpers";
import { getScriptHashFromAddressWithPrefix } from "../../../../../packages/neo/utils";
import { GLOBAL_NEP_CONTRACT_ADDRESS } from "../../../../../consts/contracts";

const statusState = {
  isProcessing: false,
  success: false,
  error: "",
};

const initialState = {
  token: statusState,
  feeToken: statusState,
  burn: statusState,
  mint: statusState,
};

const steps = [
  {
    title: "Token Approval",
    key: "token",
  },
  {
    title: "Fee Approval",
    key: "feeToken",
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
  onSuccess: () => void;
  onCancel: () => void;
}

const ActionModal = ({
  token,
  amount,
  address,
  chain,
  originChain,
  destChain,
  receiver,
  network,
  onSuccess,
  onCancel,
}: IActionModalProps) => {
  const bridgeAmount = ethers.utils.parseUnits(amount, token.decimals);
  const chainId = CONFIGS[network][chain].chainId;
  const evmBridgeContractHash =
    BRIDGE_CONTRACTS[network][chainId][destChain.chainId];
  const neoBridgeContractHash =
    BRIDGE_CONTRACTS[network][destChain.chainId][originChain.chainId];
  const nepTokenContractHash = GLOBAL_NEP_CONTRACT_ADDRESS[chain][network];

  const [state, setState] = useState(initialState);

  const approveContract = async (contractAddress: any, spenderAddress: any) => {
    const approvedAmount: any = await readContract({
      address: contractAddress,
      abi: erc20ABI,
      functionName: "allowance",
      args: [address, spenderAddress],
      chainId,
    });
    if (bridgeAmount.gt(approvedAmount)) {
      const script = await prepareWriteContract({
        address: contractAddress,
        abi: erc20ABI,
        functionName: "approve",
        args: [spenderAddress, ethers.constants.MaxUint256.toBigInt()],
      });
      const { hash } = await writeContract(script);
      await waitForTransaction({ hash });
    }
  };

  const handleProcess = async (
    stepKey: string,
    processFunction: any
  ): Promise<string | undefined> => {
    setState((prev) => ({
      ...prev,
      [stepKey]: { ...statusState, isProcessing: true },
    }));

    try {
      const res = await processFunction();
      setState((prev) => ({
        ...prev,
        [stepKey]: { ...statusState, success: true },
      }));
      return res;
    } catch (e: any) {
      console.error(e);
      setState((prev) => ({
        ...prev,
        [stepKey]: { ...statusState, error: e.message },
      }));
      return undefined;
    }
  };

  useEffect(() => {
    async function startBridging() {
      if (
        !(await handleProcess("token", () =>
          approveContract(token.hash, evmBridgeContractHash)
        ))
      ) {
        return;
      }

      if (
        !(await handleProcess("feeToken", () =>
          approveContract(nepTokenContractHash, evmBridgeContractHash)
        ))
      ) {
        return;
      }

      const burnNo = await handleProcess("burn", async () => {
        // ... your logic for token burn ...
        const data = await burn(
          chainId,
          evmBridgeContractHash,
          token.hash,
          getScriptHashFromAddressWithPrefix(receiver.address),
          bridgeAmount.toString()
        );
        return getMintoNoFromLogs(data.logs);
      });

      if (burnNo === undefined) return;

      // Handle token mint
      await handleProcess("mint", async () => {
        // ... your logic for token mint ...
        await isBurned(destChain.rpc, neoBridgeContractHash, burnNo);
      });
    }

    startBridging();
  }, [token]);

  const currentStep = steps.findIndex((step) => !state[step.key].success);
  return (
    <Modal onClose={onCancel}>
      <>
        <div className="block">
          <h3 className="title is-5 has-text-centered">Bridging</h3>
        </div>

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

        {state.burn.success && state.mint.success && (
          <>
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
          </>
        )}

        {(state.token.error ||
          state.feeToken.error ||
          state.burn.error ||
          state.mint.error) && (
          <div className="has-text-centered">
            <div
              className="message is-danger"
              style={{ wordBreak: "break-word" }}
            >
              {state.token.error}
              {state.feeToken.error}
              {state.burn.error}
              {state.mint.error}
            </div>
            <button onClick={onCancel} className="button is-black">
              Close
            </button>
          </div>
        )}
      </>
    </Modal>
  );
};

export default ActionModal;
