import React, { useEffect, useState } from "react";
import { writeContract, waitForTransaction } from "@wagmi/core";
import Modal from "../../../../../components/Modal";
import { Steps } from "antd";
import { ITokenState } from "../../Swap/interfaces";
import LoadingWithText from "../../../../../components/Commons/LoadingWithText";
import { CHAINS } from "../../../../../../consts/chains";
import { INetworkType } from "../../../../../../packages/neo/network";
import { getExploler } from "../../../../../../helpers";
import {
  approve,
  getAllowances,
  swap
} from "../../../../../../packages/polygon/swap";
import toast from "react-hot-toast";
import { ethers } from "ethers";

interface IActionModalProps {
  chain: CHAINS;
  network: INetworkType;
  address: string;
  tokenA: ITokenState;
  tokenB: ITokenState;
  amountIn: number;
  amountOut: number;
  isReverse: boolean;
  onClose: () => void;
}

const ActionModal = ({
  tokenA,
  tokenB,
  address,
  amountIn,
  amountOut,
  isReverse,
  onClose,
  chain,
  network
}: IActionModalProps) => {
  const [isTokenAApproved, setTokenAApproved] = useState(false);
  const [isTokenAApproving, setTokenAApproving] = useState(false);
  const [isTokenBApproved, setTokenBApproved] = useState(false);
  const [isTokenBApproving, setTokenBApproving] = useState(false);
  const [isSwapDone, setSwapDone] = useState(false);
  const [isSwapping, setSwapping] = useState(false);
  const [hasTokenAApproveError, setTokenAApproveError] = useState(false);
  const [hasTokenBApproveError, setTokenBApproveError] = useState(false);
  const [hasSwappingError, setSwappingError] = useState(false);
  const [txid, setTxid] = useState<string | undefined>();
  const [hasError, setError] = useState<string | undefined>();

  let currentStep = 0;
  if (isTokenAApproved) {
    currentStep = 1;
  }
  if (isTokenBApproved) {
    currentStep = 2;
  }

  useEffect(() => {
    async function startSwap() {
      let tokenAAllowance;
      let tokenBAllowance;
      try {
        const allowances = await getAllowances(
          network,
          address,
          tokenA.hash,
          tokenB.hash
        );
        tokenAAllowance = allowances[0];
        tokenBAllowance = allowances[1];
      } catch (e: any) {
        toast.error(e.message ? e.message : "Something went wrong.");
        onClose();
      }

      if (tokenAAllowance.toString() === "0") {
        setTokenAApproving(true);
        try {
          const config = await approve(network, tokenA.hash);
          const res = await writeContract(config);
          await res.wait();
          setTokenAApproved(true);
        } catch (e) {
          setTokenAApproveError(true);
          toast.error(`"Failed to approve ${tokenA.symbol}."`);
        }
        setTokenAApproving(false);
      } else {
        setTokenAApproved(true);
      }

      if (tokenBAllowance.toString() === "0") {
        setTokenBApproving(true);
        try {
          const config = await approve(network, tokenB.hash);
          const res = await writeContract(config);
          await res.wait();
          setTokenBApproved(true);
        } catch (e) {
          setTokenBApproveError(true);
          toast.error(`"Failed to approve ${tokenA.symbol}."`);
        }
        setTokenBApproving(false);
      } else {
        setTokenBApproved(true);
      }

      try {
        const config = await swap(network, {
          tokenA: tokenA.hash,
          tokenB: tokenB.hash,
          amountIn: ethers.utils
            .parseUnits(amountIn.toString(), tokenA.decimals)
            .toString(),
          amountOut: ethers.utils
            .parseUnits(amountOut.toString(), tokenB.decimals)
            .toString(),
          isReverse
        });

        const { hash } = await writeContract(config);

        setSwapping(true);
        setTxid(hash);

        await waitForTransaction({
          hash
        });

        setSwapDone(true);
        setSwapping(false);
      } catch (e: any) {
        setSwappingError(true);
        setSwapping(false);
        if (e.reason) {
          toast.error(e.reason);
        }
      }
    }

    startSwap();
  }, [tokenA, tokenB]);

  return (
    <Modal onClose={onClose}>
      <>
        <div className="block">
          <h3 className="title is-5 has-text-centered">Swap</h3>
        </div>

        <div className="block">
          <Steps
            progressDot={true}
            current={currentStep}
            items={[
              {
                title: tokenA.symbol,
                description: (
                  <>
                    {isTokenAApproving ? (
                      <LoadingWithText title="Approving" />
                    ) : (
                      <></>
                    )}
                    {isTokenAApproved ? "Approved" : ""}
                    {hasTokenAApproveError ? (
                      <span className="has-text-danger">Error</span>
                    ) : (
                      ""
                    )}
                  </>
                )
              },
              {
                title: tokenB.symbol,
                description: (
                  <>
                    {isTokenBApproving ? (
                      <LoadingWithText title="Approving" />
                    ) : (
                      <></>
                    )}
                    {isTokenBApproved ? "Approved" : ""}
                    {hasTokenBApproveError ? (
                      <span className="has-text-danger">Error</span>
                    ) : (
                      ""
                    )}
                  </>
                )
              },
              {
                title: "Action",
                description: (
                  <>
                    {isSwapping ? (
                      <LoadingWithText title="Submitting" />
                    ) : (
                      <></>
                    )}
                    {isSwapDone ? "Finished" : ""}
                    {hasSwappingError ? (
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

        {txid && isSwapDone ? (
          <>
            <hr />
            <div className="buttons" style={{ justifyContent: "center" }}>
              <a
                className="button is-primary"
                target="_blank"
                href={`${getExploler(chain, network)}/tx/${txid}`}
                rel="noreferrer"
              >
                View txid on explorer
              </a>
              <button onClick={onClose} className="button is-black">
                Close
              </button>
            </div>
          </>
        ) : (
          <></>
        )}

        {hasError ||
        hasSwappingError ||
        hasTokenAApproveError ||
        hasTokenBApproveError ? (
          <div className="has-text-centered">
            <hr />
            <button onClick={onClose} className="button is-black">
              Close
            </button>
          </div>
        ) : (
          <></>
        )}
      </>
    </Modal>
  );
};

export default ActionModal;
