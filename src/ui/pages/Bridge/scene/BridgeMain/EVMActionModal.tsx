import React, { useEffect, useState } from "react";
import {
  readContract,
  erc20ABI,
  prepareWriteContract,
  writeContract,
  waitForTransaction
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
import { BRIDGE_CONTRACTS, BRIDGE_NEP_FEE } from "../../../../../consts/bridge";
import { getExplolerForWallet } from "../../../../../helpers";
import {
  burn,
  getMintoNoFromLogs
} from "../../../../../packages/polygon/contracts/bridge";
import { wallet } from "@cityofzion/neon-core";
import { NEP_SCRIPT_HASHES } from "../../../../../packages/polygon/consts";

interface IActionModalProps {
  chain: CHAINS;
  originChain: IBridgeChain;
  destChain: IBridgeChain;
  network: INetworkType;
  address: string;
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
  onCancel
}: IActionModalProps) => {
  const [isTokenApproved, setTokenApproved] = useState(false);
  const [isTokenApproving, setTokenApproving] = useState(false);
  const [hasTokenApproveError, setTokenApproveError] = useState(false);

  const [isFeeTokenApproved, setFeeTokenApproved] = useState(false);
  const [isFeeTokenApproving, setFeeTokenApproving] = useState(false);
  const [hasFeeTokenApproveError, setFeeTokenApproveError] = useState(false);

  const [isLocking, setLocking] = useState(false);
  const [isLocked, setLocked] = useState(false);
  const [hasLockError, setLockError] = useState(false);
  const [lockTxid, setLockTxid] = useState<string | undefined>();

  const [isMinting, setMinting] = useState(false);
  const [isMinted, setMinted] = useState(false);
  const [hasMintError, setMintError] = useState(false);
  const [mintTxid, setMintTxid] = useState<string | undefined>();

  let currentStep = 0;
  if (isTokenApproved) {
    currentStep = 1;
  }
  if (isFeeTokenApproved) {
    currentStep = 2;
  }
  if (isLocked) {
    currentStep = 3;
  }

  useEffect(() => {
    async function startBridging() {
      const parsedAmount = ethers.utils
        .parseUnits(amount, token.decimals)
        .toString();
      const chainId = CONFIGS[network][chain].chainId;
      const evmBridgeContractHash =
        BRIDGE_CONTRACTS[network][chainId][destChain.chainId];

      const neoBirdgeContractHash =
        BRIDGE_CONTRACTS[network][destChain.chainId][originChain.chainId];

      const nepTokenContractHash = NEP_SCRIPT_HASHES[network];

      try {
        setTokenApproving(true);
        const approvedAmount: any = await readContract({
          address: token.hash as any,
          abi: erc20ABI,
          functionName: "allowance",
          args: [address as any, evmBridgeContractHash as any],
          chainId
        });
        if (approvedAmount.gte(parsedAmount)) {
          setTokenApproved(true);
          setTokenApproving(false);
        } else {
          const script = await prepareWriteContract({
            address: token.hash as any,
            abi: erc20ABI,
            functionName: "approve",
            args: [evmBridgeContractHash as any, ethers.constants.MaxUint256]
          });

          const res = await writeContract(script);
          await res.wait();
        }
      } catch (e) {
        console.error(e);
        setTokenApproving(false);
        setTokenApproveError(true);
      }

      try {
        setFeeTokenApproving(true);
        const approvedAmount: any = await readContract({
          address: nepTokenContractHash as any,
          abi: erc20ABI,
          functionName: "allowance",
          args: [address as any, evmBridgeContractHash as any],
          chainId
        });
        console.log(approvedAmount.toString());
        if (approvedAmount.gte(BRIDGE_NEP_FEE[network])) {
          setFeeTokenApproved(true);
          setFeeTokenApproving(false);
        } else {
          const script = await prepareWriteContract({
            address: nepTokenContractHash as any,
            abi: erc20ABI,
            functionName: "approve",
            args: [evmBridgeContractHash as any, ethers.constants.MaxUint256]
          });

          const res = await writeContract(script);
          await res.wait();
          setFeeTokenApproved(true);
          setFeeTokenApproving(false);
        }
      } catch (e) {
        console.error(e);
        setFeeTokenApproving(false);
        setFeeTokenApproveError(true);
      }

      let burnNo;
      try {
        setLocking(true);
        const burnScript = await burn(
          chainId,
          evmBridgeContractHash,
          token.hash,
          wallet.getScriptHashFromAddress(receiver.address),
          parsedAmount
        );

        const txid = await writeContract(burnScript);

        const data = await waitForTransaction(txid);

        burnNo = getMintoNoFromLogs(data.logs);

        setLocked(true);
        setLocking(false);
      } catch (e: any) {
        console.error(e);
        setLockError(true);
        setLocking(false);
      }

      if (burnNo) {
        try {
          setMinting(true);
          await isBurned(destChain.rpc, neoBirdgeContractHash, burnNo);
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
                title: "Token approval",
                description: (
                  <>
                    {isTokenApproving ? (
                      <LoadingWithText title="Approving" />
                    ) : (
                      <></>
                    )}
                    {isTokenApproved ? "Approved" : ""}
                    {hasTokenApproveError ? (
                      <span className="has-text-danger">Error</span>
                    ) : (
                      ""
                    )}
                  </>
                )
              },
              {
                title: "Fee token approval",
                description: (
                  <>
                    {isFeeTokenApproving ? (
                      <LoadingWithText title="Approving" />
                    ) : (
                      <></>
                    )}
                    {isFeeTokenApproved ? "Approved" : ""}
                    {hasFeeTokenApproveError ? (
                      <span className="has-text-danger">Error</span>
                    ) : (
                      ""
                    )}
                  </>
                )
              },
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
                href={`${getExplolerForWallet(destChain.type as CHAINS, network)}/${
                  receiver.address
                }`}
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

        {/* {hasError ||
        hasSwappingError ||
        hasTokenAApproveError ||
        hasTokenBApproveError ? (
          <div className="has-text-centered">
            <hr />
            <button onClick={onCancel} className="button is-black">
              Close
            </button>
          </div>
        ) : (
          <></>
        )} */}
      </>
    </Modal>
  );
};

export default ActionModal;
