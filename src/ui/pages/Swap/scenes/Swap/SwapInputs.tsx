import React, { useEffect, useState } from "react";
import Input from "../../components/Input";
import { FaExchangeAlt } from "react-icons/fa";
import { SwapContract } from "../../../../../packages/neo/contracts";
import { INetworkType } from "../../../../../packages/neo/network";
import { ITokenState } from ".";
import { GAS_SCRIPT_HASH } from "../../../../../packages/neo/consts/nep17-list";

interface ISwapInputsProps {
  network: INetworkType;
  tokenA?: ITokenState;
  tokenB?: ITokenState;
  amountA?: number;
  amountB?: number;
  onAssetChange: (type: "A" | "B") => void;
  onSwitch: () => void;
  setAmountA: (val?: number) => void;
  setAmountB: (val?: number) => void;
  noLiquidity?: boolean;
  userTokenABalance?: number;
  userTokenBBalance?: number;
}

interface ISearchTerm {
  type: "A" | "B";
  value?: number;
}

const SwapInputs = ({
  network,
  tokenA,
  tokenB,
  onAssetChange,
  amountA,
  amountB,
  onSwitch,
  userTokenABalance,
  userTokenBBalance,
  setAmountA,
  setAmountB,
  noLiquidity,
}: ISwapInputsProps) => {
  const [searchTerm, setSearchTerm] = useState<ISearchTerm>();
  const [isAmountALoading, setAmountALoading] = useState(false);
  const [isAmountBLoading, setAmountBLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (tokenA && tokenB && searchTerm && searchTerm.value) {
        if (searchTerm.value > 0) {
          if (searchTerm.type === "A") {
            setAmountBLoading(true);
          } else {
            setAmountALoading(true);
          }

          let estimated;
          if (searchTerm.type === "A") {
            estimated = await new SwapContract(network).getSwapEstimate(
              tokenA.hash,
              tokenB.hash,
              tokenA.hash,
              tokenA.decimals,
              searchTerm.value,
              tokenB.decimals
            );
          } else {
            estimated = await new SwapContract(network).getSwapBEstimate(
              tokenA.hash,
              tokenB.hash,
              tokenB.decimals,
              searchTerm.value
            );
          }
          if (searchTerm.type === "A") {
            setAmountBLoading(false);
            setAmountB(estimated);
          } else {
            setAmountALoading(false);
            setAmountA(estimated);
          }
        }
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="pb-2">
      <Input
        contractHash={tokenA ? tokenA.hash : ""}
        symbol={tokenA ? tokenA.symbol : undefined}
        isDisable={!tokenA || !tokenB || noLiquidity}
        heading="Sell"
        onClickAsset={() => onAssetChange("A")}
        val={amountA}
        setValue={(value) => {
          setAmountA(value);
          setSearchTerm({
            type: "A",
            value,
          });
        }}
        decimals={tokenA ? tokenA.decimals : userTokenABalance}
        userBalance={userTokenABalance}
        isLoading={isAmountALoading}
        balanceOverflow={
          !!(amountA && userTokenABalance && amountA > userTokenABalance)
        }
        errorMessage={
          tokenA &&
          tokenA.hash === GAS_SCRIPT_HASH &&
          amountA &&
          userTokenABalance &&
          amountA === userTokenABalance
            ? "You need to have more GAS for a tx fee"
            : undefined
        }
      />
      <div className="pt-5 pb-5">
        <button onClick={onSwitch} className="button is-white is-fullwidth">
          <FaExchangeAlt />
        </button>
      </div>
      <Input
        contractHash={tokenB ? tokenB.hash : ""}
        symbol={tokenB ? tokenB.symbol : undefined}
        isDisable={!tokenA || !tokenB || noLiquidity}
        heading="Buy"
        onClickAsset={() => {
          onAssetChange("B");
        }}
        val={amountB}
        setValue={(value) => {
          setAmountB(value);
          setSearchTerm({
            type: "B",
            value,
          });
        }}
        decimals={tokenB ? tokenB.decimals : undefined}
        userBalance={userTokenBBalance}
        isLoading={isAmountBLoading}
      />
    </div>
  );
};

export default SwapInputs;
