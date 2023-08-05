import React, { useEffect, useState } from "react";
import {
  readContract,
  erc20ABI,
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";
import { Steps, Typography } from "antd";

import { ethers } from "ethers";
import { INetworkType } from "../../../../../packages/neo/network";
import { CHAINS, CONFIGS } from "../../../../../consts/chains";
import { isBurned } from "../../../../../packages/neo/contracts/ftw/bridge";
import { IBridgeReceiver, IBridgeSelectedtoken } from "../../interfaces";
import Modal from "../../../../components/Modal";
import LoadingWithText from "../../../../components/Commons/LoadingWithText";
import { IBridgeChain } from "../../../../../common/routers/bridge/interfaces";
import { BRIDGE_CONTRACTS, BRIDGE_NEP_FEE } from "../../../../../consts/bridge";
import {
  burn,
  getMintoNoFromLogs,
} from "../../../../../packages/polygon/contracts/bridge";
import { getExplorer } from "../../../../../common/helpers";
import { getScriptHashFromAddressWithPrefix } from "../../../../../packages/neo/utils";
import { GLOBAL_NEP_CONTRACT_ADDRESS } from "../../../../../consts/contracts";

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
  onCancel,
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
      const requiredAmount = ethers.utils.parseUnits(amount, token.decimals);

      const chainId = CONFIGS[network][chain].chainId;
      const evmBridgeContractHash =
        BRIDGE_CONTRACTS[network][chainId][destChain.chainId];

      const neoBirdgeContractHash =
        BRIDGE_CONTRACTS[network][destChain.chainId][originChain.chainId];

      const nepTokenContractHash = GLOBAL_NEP_CONTRACT_ADDRESS[chain][network];

      try {
        setTokenApproving(true);
        const approvedAmount: any = await readContract({
          address: token.hash as any,
          abi: erc20ABI,
          functionName: "allowance",
          args: [address as any, evmBridgeContractHash as any],
          chainId,
        });

        console.log(approvedAmount);

        if (requiredAmount.lt(approvedAmount)) {
          setTokenApproved(true);
          setTokenApproving(false);
        } else {
          const script = await prepareWriteContract({
            address: token.hash as any,
            abi: erc20ABI,
            functionName: "approve",
            args: [
              evmBridgeContractHash as any,
              ethers.constants.MaxUint256 as any,
            ],
          });

          const { hash } = await writeContract(script);
          await waitForTransaction({ hash });
          setTokenApproving(false);
        }
      } catch (e) {
        console.error(e);
        setTokenApproving(false);
        setTokenApproveError(true);
      }

      try {
        setFeeTokenApproving(true);

        const requiredFeeAmount = ethers.utils.parseUnits(
          BRIDGE_NEP_FEE[network].toString(),
          8
        );
        const approvedAmount = await readContract({
          address: nepTokenContractHash as any,
          abi: erc20ABI,
          functionName: "allowance",
          args: [address as any, evmBridgeContractHash as any],
          chainId,
        });

        if (requiredFeeAmount.lt(approvedAmount)) {
          setFeeTokenApproved(true);
          setFeeTokenApproving(false);
        } else {
          const script = await prepareWriteContract({
            address: nepTokenContractHash as any,
            abi: erc20ABI,
            functionName: "approve",
            args: [
              evmBridgeContractHash as any,
              ethers.constants.MaxUint256 as any,
            ],
          });

          const { hash } = await writeContract(script);
          await waitForTransaction({ hash });
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
          getScriptHashFromAddressWithPrefix(receiver.address),
          requiredAmount.toString()
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
                title: "Token Approval",
                description: (
                  <>
                    {isTokenApproving && <LoadingWithText title="Processing" />}
                    {isTokenApproved && (
                      <Typography.Text type="success">Success</Typography.Text>
                    )}
                    {hasTokenApproveError && (
                      <Typography.Text type="danger">Error</Typography.Text>
                    )}
                  </>
                ),
              },
              {
                title: "Fee Token Approval",
                description: (
                  <>
                    {isFeeTokenApproving && (
                      <LoadingWithText title="Processing" />
                    )}
                    {isFeeTokenApproved && (
                      <Typography.Text type="success">Success</Typography.Text>
                    )}
                    {hasFeeTokenApproveError && (
                      <Typography.Text type="danger">Error</Typography.Text>
                    )}
                  </>
                ),
              },
              {
                title: `Token Burn on ${originChain.name}`,
                description: (
                  <>
                    {isLocking && <LoadingWithText title="Processing" />}
                    {isLocked && (
                      <Typography.Text type="success">Success</Typography.Text>
                    )}
                    {hasLockError && (
                      <Typography.Text type="danger">Error</Typography.Text>
                    )}
                  </>
                ),
              },
              {
                title: `Token Mint on ${destChain.name}`,
                description: (
                  <>
                    {isMinting && <LoadingWithText title="Processing" />}
                    {isMinted && (
                      <Typography.Text type="success">Success</Typography.Text>
                    )}
                    {hasMintError && (
                      <Typography.Text type="danger">Error</Typography.Text>
                    )}
                  </>
                ),
              },
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
