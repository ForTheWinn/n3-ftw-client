import React, { useEffect, useState } from "react";
import { waitForTransaction, writeContract } from "@wagmi/core";
import Modal from "../../../components/Modal";
import { Spin, Steps } from "antd";
import { ITokenState } from "../scenes/Swap/interfaces";
import LoadingWithText from "../../../components/Commons/LoadingWithText";
import { CHAINS } from "../../../../consts/chains";
import { INetworkType } from "../../../../packages/neo/network";
import {
  approve,
  getAllowances,
  provide,
  swap,
} from "../../../../packages/polygon/contracts/swap";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { SwapContract } from "../../../../packages/neo/contracts";
import { waitTransactionUntilSubmmited } from "../../../../common/routers/global";
import { useNeoWallets } from "../../../../common/hooks/use-neo-wallets";
import { WENT_WRONG } from "../../../../consts/messages";
import { NEO_CHAIN } from "../../../../consts/global";
import { getExplorer } from "../../../../common/helpers";
import NFTAds from "../../../components/Ad";

interface IActionModalProps {
  chain: CHAINS;
  network: INetworkType;
  address: string;
  tokenA: ITokenState;
  tokenB: ITokenState;
  amountA: string;
  amountB: string;
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
  network,
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
      const parsedAmountA = ethers.utils.parseUnits(amountA, tokenA.decimals);
      const parsedAmountB = ethers.utils.parseUnits(amountB, tokenB.decimals);

      const slippageAmountA = parsedAmountA
        .mul(ethers.BigNumber.from(Math.round(slippage * 100)))
        .div(10000);
      const slippageAmountB = parsedAmountB
        .mul(ethers.BigNumber.from(Math.round(slippage * 100)))
        .div(10000);

      const maxAmountAIn = parsedAmountA.add(slippageAmountA).toString();

      const minAmountBOut = parsedAmountB.sub(slippageAmountB).toString();

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
                tokenB.hash,
                parsedAmountB.toString(),
                maxAmountAIn
              );
            } else {
              txid = await new SwapContract(network).swap(
                connectedWallet,
                tokenA.hash,
                parsedAmountA.toString(),
                tokenB.hash,
                minAmountBOut
              );
            }
          } else {
            txid = await new SwapContract(network).provide(
              connectedWallet,
              isReverse ? tokenB.hash : tokenA.hash,
              isReverse ? parsedAmountB.toString() : parsedAmountA.toString(),
              isReverse ? tokenA.hash : tokenB.hash,
              isReverse ? parsedAmountA.toString() : parsedAmountB.toString(),
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
          toast.error(e.message ? e.message : WENT_WRONG);
          onCancel();
        }

        if (tokenAAllowance.toString() === "0") {
          setTokenAApproving(true);
          try {
            const config = await approve(network, tokenA.hash);
            const { hash } = await writeContract(config);
            await waitForTransaction({ hash });
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
            const { hash } = await writeContract(config);
            await waitForTransaction({ hash });
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
            config = await swap(network, {
              tokenA: tokenA.hash,
              tokenB: tokenB.hash,
              amountIn: isReverse ? maxAmountAIn : parsedAmountA.toString(),
              // Add slippage
              amountOut: isReverse ? parsedAmountB.toString() : minAmountBOut,
              isReverse,
            });
          } else if (method === "provide") {
            config = await provide(network, {
              tokenA: tokenA.hash,
              tokenB: tokenB.hash,
              amountA: parsedAmountA.toString(),
              amountB: parsedAmountB.toString(),
              slippage: slippage * 100, // BPS
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
        {/* <div className="block">
          <h3 className="title is-5 has-text-centered">
            {method === "swap" ? "Swap" : "Add Liquidity"}
          </h3>
        </div> */}

        <div className="block">
          {isSwapping ? (
            <div>
              <>
                <NFTAds />
                <div className="has-text-centered">
                  <Spin />
                  <p className="subtitle is-6">
                    Please hold while your transaction is being confirmed
                  </p>
                </div>
              </>
            </div>
          ) : (
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
                  ),
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
                  ),
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
                  ),
                },
              ]}
            />
          )}
        </div>

        {txid && isSwapDone ? (
          <>
            <hr />
            <div className="buttons" style={{ justifyContent: "center" }}>
              <a
                className="button is-primary"
                target="_blank"
                href={`${getExplorer(chain, network, "tx")}/${txid}`}
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
