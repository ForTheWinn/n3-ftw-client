import React, { useEffect, useState } from "react";
import { Steps } from "antd";

import { ethers } from "ethers";
import { INetworkType, Network } from "../../../../../packages/neo/network";
import { CHAINS, CONFIGS } from "../../../../../consts/chains";
import {
  bridgeMint,
  getMintNoFromNotifications,
} from "../../../../../packages/neo/contracts/ftw/bridge";
import { IBridgeReceiver, IBridgeSelectedtoken } from "../../interfaces";
import Modal from "../../../../components/Modal";
import LoadingWithText from "../../../../components/Commons/LoadingWithText";
import { IBridgeChain } from "../../../../../common/routers/bridge/interfaces";
import { IConnectedWallet } from "../../../../../packages/neo/wallets/interfaces";
import { getIsMinted } from "../../../../../packages/evm/contracts/bridge";
import { BRIDGE_CONTRACTS } from "../../../../../consts/bridge";
import { getExplorer } from "../../../../../common/helpers";

const statusState = {
  isProcessing: false,
  success: false,
  error: "",
};

const initialState = {
  lock: statusState,
  mint: statusState,
};

const steps = [
  {
    title: "Token Lock",
    key: "lock",
  },
  {
    title: "Token Mint",
    key: "mint",
  },
];

interface IActionModalProps {
  chain: CHAINS;
  destChain: IBridgeChain;
  network: INetworkType;
  token: IBridgeSelectedtoken;
  amount: string;
  receiver: IBridgeReceiver;
  connectedNeoWallet: IConnectedWallet;
  onSuccess: () => void;
  onCancel: () => void;
}

const ActionModal = ({
  token,
  amount,
  chain,
  destChain,
  receiver,
  network,
  connectedNeoWallet,
  onSuccess,
  onCancel,
}: IActionModalProps) => {
  const originChainId = CONFIGS[network][chain].chainId;
  const destChainId = destChain.chainId;
  const originBridgeContractHash =
    BRIDGE_CONTRACTS[network][originChainId][destChainId];

  const destBridgeContractHash =
    BRIDGE_CONTRACTS[network][destChainId][originChainId];

  const bridgeAmount = ethers.parseUnits(amount, token.decimals).toString();

  const [state, setState] = useState(initialState);

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
      const lockNo = await handleProcess("lock", async () => {
        // ... your logic for token burn ...
        const txid = await bridgeMint(
          connectedNeoWallet,
          originBridgeContractHash,
          network,
          token.hash,
          receiver.address,
          bridgeAmount
        );

        const res = await Network.getRawTx(txid, network);
        return getMintNoFromNotifications(res);
      });

      if (lockNo === undefined) return;

      // Handle token mint
      await handleProcess("mint", async () => {
        // ... your logic for token mint ...
        await getIsMinted(destChain.chainId, destBridgeContractHash, lockNo);
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

        {state.lock.success && state.mint.success && (
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
              <button onClick={onSuccess} className="button is-light">
                Close
              </button>
            </div>
          </>
        )}

        {(state.lock.error || state.mint.error) && (
          <div className="has-text-centered">
            <div
              className="message is-danger"
              style={{ wordBreak: "break-word" }}
            >
              {state.lock.error}
              {state.mint.error}
            </div>
            <button onClick={onCancel} className="button is-light">
              Close
            </button>
          </div>
        )}
      </>
    </Modal>
  );
};

export default ActionModal;
