import React, { useEffect, useState } from "react";
import { Modal, Space, Spin, Typography } from "antd";
import { IToken } from "../../../../../consts/tokens";
import { LoadingOutlined } from "@ant-design/icons";
import { CHAINS } from "../../../../../consts/chains";
import { INetworkType } from "../../../../../packages/neo/network";
import {
  approve,
  getAllowances,
  swap,
  swapAndUnwrap,
  unWrapNative,
  wrapAndSwap,
  wrapNative,
} from "../../../../../packages/evm/contracts/swap";
import {
  calculateSlippage,
  getCurrentStep,
} from "../../../../../common/helpers";
import { WENT_WRONG } from "../../../../../consts/messages";
import { waitTransactionUntilSubmmited } from "../../../../../common/routers/global";
import { DisplayAd } from "./components/DisplayAd";
import { TxResult } from "../../../../components/TxResult";
import Errors from "./components/Errors";
import { STATUS_STATE, SWAP } from "../../../../../consts/global";
import { CONTRACT_MAP } from "../../../../../consts/contracts";
import { ethers } from "ethers";

interface IActionModalProps {
  chain: CHAINS;
  network: INetworkType;
  address: any;
  tokenA: IToken;
  tokenB: IToken;
  amountA: string;
  amountB: string;
  slippage: number;
  isReverse: boolean;
  isWrapping: boolean;
  isUnWrapping: boolean;
  isSwapWithWrapping: boolean;
  isSwapWithUnWrapping: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const initialState = {
  allowlances: STATUS_STATE,
  tokenA: STATUS_STATE,
  swap: STATUS_STATE,
  txid: undefined,
};

const steps = [
  {
    title: "Allowlance Checks",
    key: "allowlances",
  },
  {
    key: "tokenA",
  },
  {
    title: "Confirm",
    key: "swap",
  },
];

const ActionModal = (props: IActionModalProps) => {
  const {
    tokenA,
    tokenB,
    amountA,
    amountB,
    slippage,
    address,
    chain,
    isReverse,
    network,
    isWrapping,
    isUnWrapping,
    isSwapWithWrapping,
    isSwapWithUnWrapping,
    onSuccess,
    onCancel,
  } = props;
  console.log(1)
  const [status, setStatus] = useState({
    isProcessing: false,
    message: "",
    error: "",
  });
  const [txid, setTxid] = useState<string | undefined>();
  const [isSubmitting, setSubmitting] = useState(false);
  const parsedAmountA = ethers.parseUnits(amountA, tokenA.decimals);
  const parsedAmountB = ethers.parseUnits(amountB, tokenB.decimals);
  const maxAmountAIn =
    parsedAmountA + calculateSlippage(parsedAmountA, slippage);
  const minAmountBOut =
    parsedAmountB - calculateSlippage(parsedAmountB, slippage);

  const nativeConvert = async () => {
    setStatus({
      isProcessing: false,
      message: "Check your wallet to confirm the transaction.",
      error: "",
    });
    let tx;

    try {
      if (isWrapping) {
        tx = await wrapNative(
          chain,
          network,
          tokenA.nativePair?.hash,
          parsedAmountA.toString()
        );
      } else {
        tx = await unWrapNative(
          chain,
          network,
          tokenB.nativePair?.hash,
          parsedAmountB.toString()
        );
      }
    } catch (e: any) {
      console.error(e);
      setStatus({
        isProcessing: false,
        message: "",
        error: `Failed. Try again`,
      });
      return;
    }

    setSubmitting(true);

    await waitTransactionUntilSubmmited(chain, network, tx);

    setTxid(tx);
  };

  const standardSwap = async () => {
    let allowances: any;
    let approveTx: any;
    let swapTx: any;
    const swapContractHash = CONTRACT_MAP[chain][network][SWAP];

    setStatus({
      isProcessing: true,
      message: `Checking ${tokenA.symbol} allowlance`,
      error: "",
    });

    try {
      allowances = await getAllowances(
        chain,
        network,
        address,
        [tokenA.hash],
        swapContractHash
      );
    } catch (e: any) {
      console.error(e);
      setStatus({
        isProcessing: false,
        message: "",
        error: "Failed to get allowances",
      });
      return;
    }

    if (parsedAmountA > allowances[0]) {
      setStatus({
        isProcessing: false,
        message: `Check your wallet to approve ${tokenA.symbol}`,
        error: "",
      });
      try {
        approveTx = await approve(
          chain,
          network,
          tokenA.hash,
          swapContractHash
        );
      } catch (e: any) {
        console.error(e);
        setStatus({
          isProcessing: false,
          message: "",
          error: `Failed to approve ${tokenA.symbol}. Try again`,
        });
        return;
      }
      setStatus({
        isProcessing: true,
        message: `Submitting`,
        error: "",
      });
      await waitTransactionUntilSubmmited(chain, network, approveTx);
    }

    setStatus({
      isProcessing: false,
      message: `Check your wallet to swap`,
      error: "",
    });
    try {
      swapTx = await swap(chain, network, {
        tokenA: tokenA.hash,
        tokenB: tokenB.hash,
        amountIn: isReverse ? maxAmountAIn : parsedAmountA,
        amountOut: isReverse ? parsedAmountB : minAmountBOut,
        isReverse,
      });
    } catch (e: any) {
      console.error(e);
      setStatus({
        isProcessing: false,
        message: "",
        error: `Failed to swap`,
      });
      return;
    }

    setSubmitting(true);

    await waitTransactionUntilSubmmited(chain, network, swapTx);

    setTxid(swapTx);
  };

  const _wrapAndSwap = async () => {
    setStatus({
      isProcessing: false,
      message: "Check your wallet to confirm the transaction.",
      error: "",
    });
    let tx;
    try {
      tx = await wrapAndSwap(chain, network, {
        tokenA: tokenA,
        tokenB: tokenB,
        amountIn: parsedAmountA,
        amountOut: minAmountBOut,
      });
    } catch (e: any) {
      console.error(e);
      setStatus({
        isProcessing: false,
        message: "",
        error: `Failed. Try again`,
      });
      return;
    }

    setSubmitting(true);

    await waitTransactionUntilSubmmited(chain, network, tx);

    setTxid(tx);
  };

  const _swapAndUnwrap = async () => {
    setStatus({
      isProcessing: false,
      message: "Check your wallet to confirm the transaction.",
      error: "",
    });
    let tx;
    try {
      tx = await swapAndUnwrap(chain, network, {
        tokenA: tokenA,
        tokenB: tokenB,
        amountIn: isReverse ? maxAmountAIn : parsedAmountA,
        amountOut: isReverse ? parsedAmountB : minAmountBOut,
        isReverse,
      });
    } catch (e: any) {
      console.error(e);
      setStatus({
        isProcessing: false,
        message: "",
        error: `Failed. Try again`,
      });
      return;
    }

    setSubmitting(true);

    await waitTransactionUntilSubmmited(chain, network, tx);

    setTxid(tx);
  };

  const doInvoke = async () => {
    if (isWrapping || isUnWrapping) {
      nativeConvert();
    } else {
      if (isSwapWithWrapping || isSwapWithUnWrapping) {
        if (isSwapWithWrapping) {
          _wrapAndSwap();
        } else if (isSwapWithUnWrapping) {
          _swapAndUnwrap();
        }
      } else {
        standardSwap();
      }
    }
  };

  useEffect(() => {
    doInvoke();
  }, [tokenA, tokenB]);

  return (
    <Modal open={true} onCancel={onCancel} footer={[]} closeIcon={false}>
      <div className="has-text-centered">
        <h3 className="title is-5">Swap</h3>
        <div className="block">
          {txid ? (
            <TxResult
              txid={txid}
              chain={chain}
              network={network}
              onClose={onSuccess}
            />
          ) : isSubmitting ? (
            <DisplayAd />
          ) : (
            <>
              <Space>
                {status.message && (
                  <Typography.Text>{status.message}</Typography.Text>
                )}
                {status.isProcessing && (
                  <Spin indicator={<LoadingOutlined spin />} />
                )}
                {status.error && (
                  <Typography.Text type="danger">
                    {status.error}
                  </Typography.Text>
                )}
              </Space>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ActionModal;
