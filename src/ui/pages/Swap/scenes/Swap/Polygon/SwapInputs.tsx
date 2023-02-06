import React from "react";
import Input from "../../../components/Input";
import { FaExchangeAlt } from "react-icons/fa";
import { IBalancesState, ISwapInputState, ITokenState } from "../interfaces";

interface ISwapInputsProps {
  tokenA?: ITokenState;
  tokenB?: ITokenState;
  amountA?: number;
  amountB?: number;
  balances?: IBalancesState;
  swapInput?: ISwapInputState;
  isAmountALoading: boolean;
  isAmountBLoading: boolean;
  onAssetChange: (type: "A" | "B") => void;
  onSwitch: () => void;
  setSwapInputChange: (val: ISwapInputState) => void;
}

const SwapInputs = ({
  tokenA,
  tokenB,
  amountA,
  amountB,
  balances,
  swapInput,
  isAmountALoading,
  isAmountBLoading,
  onSwitch,
  setSwapInputChange,
  onAssetChange,
}: ISwapInputsProps) => {

  const amountAOverflow =
    !!(
      swapInput &&
      swapInput.type === "A" &&
      amountA &&
      balances &&
      amountA > parseFloat(balances.amountA)
    ) ||
    !!(
      swapInput &&
      swapInput.type === "B" &&
      amountA &&
      balances &&
      amountA > parseFloat(balances.amountA)
    );

  return (
    <div className="pb-2">
      <Input
        contractHash={tokenA ? tokenA.hash : ""}
        symbol={tokenA ? tokenA.symbol : undefined}
        logo={tokenA ? tokenA.icon : undefined}
        isDisable={!tokenA || !tokenB}
        heading="Sell"
        onClickAsset={() => onAssetChange("A")}
        val={amountA}
        setValue={(value) => {
          setSwapInputChange({
            type: "A",
            value,
          });
        }}
        decimals={tokenA ? tokenA.decimals : 0}
        userBalance={balances ? parseFloat(balances.amountA) : undefined}
        isLoading={isAmountALoading}
        balanceOverflow={amountAOverflow}
      />
      <div className="pt-5 pb-5">
        <button onClick={onSwitch} className="button is-white is-fullwidth">
          <FaExchangeAlt />
        </button>
      </div>
      <Input
        contractHash={tokenB ? tokenB.hash : ""}
        symbol={tokenB ? tokenB.symbol : undefined}
        logo={tokenB ? tokenB.icon : undefined}
        isDisable={!tokenA || !tokenB}
        heading="Buy"
        onClickAsset={() => {
          onAssetChange("B");
        }}
        val={amountB}
        setValue={(value) => {
          setSwapInputChange({
            type: "B",
            value,
          });
        }}
        decimals={tokenB ? tokenB.decimals : 0}
        userBalance={balances ? parseFloat(balances.amountB) : undefined}
        isLoading={isAmountBLoading}
        // balanceOverflow={amountBOverflow}
      />
    </div>
  );
};

export default SwapInputs;
