import React, { useEffect, useState } from "react";
import Input from "../../components/Input";
import { FaExchangeAlt } from "react-icons/fa";
import { SwapContract } from "../../../../../packages/neo/contracts";
import { INetworkType } from "../../../../../packages/neo/network";
import { ITokenState } from ".";

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
  isTokenAMaxGas?: any;
  isTokenBMaxGas?: any;
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
  isTokenAMaxGas,
  isTokenBMaxGas,
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
          const estimated = await new SwapContract(network).getSwapEstimate(
            tokenA.hash,
            tokenB.hash,
            searchTerm.type === "A" ? tokenA.hash : tokenB.hash,
            searchTerm.type === "A" ? tokenA.decimals : tokenB.decimals,
            searchTerm.value
          );
          if (searchTerm.type === "A") {
            setAmountBLoading(false);
            setAmountB(+estimated);
          } else {
            setAmountALoading(false);
            setAmountA(+estimated);
          }
        }
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  return (
    <>
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
        errorMessage={
          isTokenAMaxGas
            ? "You need to have GAS for transaction fee"
            : undefined
        }
      />
      <div className="pt-4 pb-4">
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
        errorMessage={
          isTokenBMaxGas
            ? "You need to have GAS for transaction fee"
            : undefined
        }
      />
    </>
  );
};

export default SwapInputs;
