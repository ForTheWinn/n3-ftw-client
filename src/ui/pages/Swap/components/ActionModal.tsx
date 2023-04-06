import React, { useEffect, useState } from "react";
import { writeContract } from "@wagmi/core";
import Modal from "../../../components/Modal";
import { Steps } from "antd";
import { ITokenState } from "../scenes/Swap/interfaces";
import LoadingWithText from "../../../components/Commons/LoadingWithText";
import { CHAINS, NEO_CHAIN } from "../../../../consts/chains";
import { INetworkType } from "../../../../packages/neo/network";
import { getExploler } from "../../../../helpers";
import {
  approve,
  getAllowances,
  provide,
  swap
} from "../../../../packages/polygon/contracts/swap";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import {
  getAfterSlippage,
  getMaxTokenAAmount
} from "../../../../packages/neo/contracts/ftw/swap/helpers";
import { SwapContract } from "../../../../packages/neo/contracts";
import { waitTransactionUntilSubmmited } from "../../../../common/routers/global";
import { useNeoWallets } from "../../../../common/hooks/use-neo-wallets";

interface IActionModalProps {
  chain: CHAINS;
  network: INetworkType;
  address: string;
  tokenA: ITokenState;
  tokenB: ITokenState;
  amountA: number;
  amountB: number;
  slippage: number;
  method: "swap" | "provide";
  isReverse: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const ActionModal = ({
  tokenA,
  tokenB,
  amountA,
  amountB,
  slippage,
  address,
  method,
  onSuccess,
  onCancel,
  chain,
  isReverse,
  network
}: IActionModalProps) => {
  const { connectedWallet } = useNeoWallets();
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
      if (chain === NEO_CHAIN) {
        if (!connectedWallet) return false;

        let txid;

        setTokenAApproved(true);
        setTokenBApproved(true);
        try {
          if (method === "swap") {
            if (isReverse) {
              txid = await new SwapContract(network).swapBtoA(
                connectedWallet,
                tokenA.hash,
                tokenA.decimals,
                tokenB.hash,
                tokenB.decimals,
                amountB,
                getMaxTokenAAmount(amountA, slippage)
              );
            } else {
              txid = await new SwapContract(network).swap(
                connectedWallet,
                tokenA.hash,
                tokenA.decimals,
                amountA,
                tokenB.hash,
                tokenB.decimals,
                getAfterSlippage(amountB, slippage)
              );
            }
          } else {
            txid = await new SwapContract(network).provide(
              connectedWallet,
              isReverse ? tokenB.hash : tokenA.hash,
              isReverse ? tokenB.decimals : tokenA.decimals,
              isReverse ? amountB : amountA,
              isReverse ? tokenA.hash : tokenB.hash,
              isReverse ? tokenA.decimals : tokenB.decimals,
              isReverse ? amountA : amountB,
              0, // Deprecated LP lock
              slippage * 100 // BPS
            );
          }
          if (txid) {
            setTxid(txid);
            setSwapping(true);
            await waitTransactionUntilSubmmited(chain, network, txid);
            setSwapping(false);
            setSwapDone(true);
          }
        } catch (e: any) {
          console.error(e);
          setSwappingError(true);
          setSwapping(false);
          if (e.reason) {
            toast.error(e.reason);
          }
        }
      } else {
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
          console.error(e);
          toast.error(e.message ? e.message : "Something went wrong.");
          onCancel();
        }

        if (tokenAAllowance.toString() === "0") {
          setTokenAApproving(true);
          try {
            const config = await approve(network, tokenA.hash);
            const res = await writeContract(config);
            await res.wait();
            setTokenAApproved(true);
          } catch (e) {
            console.error(e);
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
            console.error(e);
            setTokenBApproveError(true);
            toast.error(`"Failed to approve ${tokenA.symbol}."`);
          }
          setTokenBApproving(false);
        } else {
          setTokenBApproved(true);
        }

        try {
          let config;
          if (method === "swap") {
            const amountOutBN = ethers.utils.parseUnits(
              amountB.toString(),
              tokenB.decimals
            );

            config = await swap(network, {
              tokenA: tokenA.hash,
              tokenB: tokenB.hash,
              amountIn: ethers.utils
                .parseUnits(amountA.toString(), tokenA.decimals)
                .toString(),
              // Add slippage
              amountOut: amountOutBN
                .sub(amountOutBN.mul(slippage).div(100))
                .toString(),
              isReverse
            });
          } else if (method === "provide") {
            config = await provide(network, {
              tokenA: tokenA.hash,
              tokenB: tokenB.hash,
              amountA: ethers.utils
                .parseUnits(amountA.toString(), tokenA.decimals)
                .toString(),
              amountB: ethers.utils
                .parseUnits(amountB.toString(), tokenB.decimals)
                .toString(),
              slippage: slippage * 100 // BPS
            });
          } else {
            toast.error("The method is not supported.");
            return;
          }

          const { hash } = await writeContract(config);

          setSwapping(true);
          setTxid(hash);

          await waitTransactionUntilSubmmited(chain, network, hash);

          setSwapDone(true);
          setSwapping(false);
        } catch (e: any) {
          console.error(e);
          setSwappingError(true);
          setSwapping(false);
          if (e.reason) {
            toast.error(e.reason);
          }
        }
      }
    }

    startSwap();
  }, [tokenA, tokenB]);

  return (
    <Modal onClose={onCancel}>
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
                href={`${getExploler(chain, network)}/${txid}`}
                rel="noreferrer"
              >
                View txid on explorer
              </a>
              <button onClick={onSuccess} className="button is-black">
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
            <button onClick={onCancel} className="button is-black">
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
