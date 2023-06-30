import React, { useEffect, useState } from "react";
import { Steps } from "antd";

import { ethers } from "ethers";
import { INetworkType, Network } from "../../../../../packages/neo/network";
import { CHAINS, CONFIGS } from "../../../../../consts/chains";
import {
  bridgeMint,
  getMintNoFromNotifications
} from "../../../../../packages/neo/contracts/ftw/bridge";
import { IBridgeReceiver, IBridgeSelectedtoken } from "../../interfaces";
import Modal from "../../../../components/Modal";
import LoadingWithText from "../../../../components/Commons/LoadingWithText";
import { IBridgeChain } from "../../../../../common/routers/bridge/interfaces";
import { IConnectedWallet } from "../../../../../packages/neo/wallets/interfaces";
import { getIsMinted } from "../../../../../packages/polygon/contracts/bridge";
import { BRIDGE_CONTRACTS } from "../../../../../consts/bridge";
import { getExplorer } from "../../../../../helpers/helpers";

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
  onCancel
}: IActionModalProps) => {
  const [isLocking, setLocking] = useState(false);
  const [isLocked, setLocked] = useState(false);
  const [hasLockError, setLockError] = useState(false);
  const [lockTxid, setLockTxid] = useState<string | undefined>();

  const [isMinting, setMinting] = useState(false);
  const [isMinted, setMinted] = useState(false);
  const [hasMintError, setMintError] = useState(false);
  const [mintTxid, setMintTxid] = useState<string | undefined>();

  let currentStep = 0;

  if (isLocked) {
    currentStep = 1;
  }

  useEffect(() => {
    async function startBridging() {
      const parsedAmount = ethers.utils
        .parseUnits(amount, token.decimals)
        .toString();

      const originChainId = CONFIGS[network][chain].chainId;
      const destChainId = destChain.chainId;
      const originBridgeContractHash =
        BRIDGE_CONTRACTS[network][originChainId][destChainId];

      const destBridgeContractHash =
        BRIDGE_CONTRACTS[network][destChainId][originChainId];

      let mintNo;

      try {
        setLocking(true);
        const txid = await bridgeMint(
          connectedNeoWallet,
          originBridgeContractHash,
          network,
          token.hash,
          receiver.address,
          parsedAmount
        );

        const res = await Network.getRawTx(txid, network);
        mintNo = getMintNoFromNotifications(res);
        setLocked(true);
        setLocking(false);
      } catch (e: any) {
        console.error(e);
        setLockError(true);
        setLocking(false);
      }

      if (mintNo) {
        try {
          setMinting(true);
          await getIsMinted(destChain.chainId, destBridgeContractHash, mintNo);
          setMinted(true);
          setMinting(false);
        } catch (e: any) {
          console.error(e);
          setMintError(true);
          setMinting(false);
        }
      } else {
        setMintError(true);
      }
    }

    startBridging();
  }, [token]);

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
            items={[
              {
                title: "Lock",
                description: (
                  <>
                    {isLocking ? <LoadingWithText title="Locking" /> : <></>}
                    {isLocked ? "Locked" : ""}
                    {hasLockError ? (
                      <span className="has-text-danger">Error</span>
                    ) : (
                      ""
                    )}
                  </>
                )
              },
              {
                title: "Mint",
                description: (
                  <>
                    {isMinting ? <LoadingWithText title="Minting" /> : <></>}
                    {isMinted ? "Minted" : ""}
                    {hasMintError ? (
                      <span className="has-text-danger">Error</span>
                    ) : (
                      ""
                    )}
                  </>
                )
              }
            ]}
          />
        </div>

        {isLocked && isMinted ? (
          <>
            <hr />
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
        ) : (
          <></>
        )}
      </>
    </Modal>
  );
};

export default ActionModal;
