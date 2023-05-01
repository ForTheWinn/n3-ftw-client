import React from "react";
import Input from "../../components/Input";
import { FaArrowDown, FaExchangeAlt } from "react-icons/fa";
import { ISwapInputState, ITokenState } from "./interfaces";
import { IUserTokenBalances } from "../../../../../common/routers/swap/interfaces";

interface ISwapInputsProps {
  tokenA?: ITokenState;
  tokenB?: ITokenState;
  amountA?: number;
  amountB?: number;
  balances?: IUserTokenBalances;
  swapInput?: ISwapInputState;
  isAmountALoading: boolean;
  isAmountBLoading: boolean;
  noLiquidity?: boolean;
  inputError?: string;
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
  noLiquidity,
  inputError,
  onSwitch,
  setSwapInputChange,
  onAssetChange
}: ISwapInputsProps) => {
  const amountAOverflow = !!(
    swapInput &&
    swapInput.type === "A" &&
    amountA &&
    balances &&
    amountA > parseFloat(balances.amountA)
  );

  const amountBOverflow = !!(
    swapInput &&
    swapInput.type === "B" &&
    amountB &&
    balances &&
    amountB > parseFloat(balances.amountB)
  );

  return (
    <div className="pb-2">
      <Input
        token={tokenA}
        isDisable={!tokenA || !tokenB || noLiquidity}
        heading="Sell"
        onClickAsset={() => onAssetChange("A")}
        val={amountA}
        setValue={(value) => {
          setSwapInputChange({
            type: "A",
            value
          });
        }}
        userBalance={balances ? parseFloat(balances.amountA) : undefined}
        isLoading={isAmountALoading}
        balanceOverflow={amountAOverflow}
        hasEstimateError={
          inputError && swapInput && swapInput.type === "A" ? true : false
        }
      />
      <div className="pt-5 pb-5">
        <button onClick={onSwitch} className="button is-white is-fullwidth">
          <FaArrowDown />
        </button>
      </div>
      <Input
        token={tokenB}
        isDisable={!tokenA || !tokenB || noLiquidity}
        heading="Buy"
        onClickAsset={() => {
          onAssetChange("B");
        }}
        val={amountB}
        setValue={(value) => {
          setSwapInputChange({
            type: "B",
            value
          });
        }}
        userBalance={balances ? parseFloat(balances.amountB) : undefined}
        isLoading={isAmountBLoading}
        balanceOverflow={amountBOverflow}
        hasEstimateError={
          inputError && swapInput && swapInput.type === "B" ? true : false
        }
      />
    </div>
  );
};

export default SwapInputs;
