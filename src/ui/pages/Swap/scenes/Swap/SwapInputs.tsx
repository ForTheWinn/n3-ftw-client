import React from "react";
import Input from "../../components/Input";
import { FaArrowDown } from "react-icons/fa";
import { ISwapInputState } from "./interfaces";
import { IToken } from "../../../../../consts/tokens";
import {
  ISwapReserves,
  IUserTokenBalances,
} from "../../../../../common/routers/swap/interfaces";
import SwapErrors from "./components/SwapErrors";
import InputDivider from "../../components/InputDivider";

interface ISwapInputsProps {
  reserves?: ISwapReserves;
  tokenA?: IToken;
  tokenB?: IToken;
  amountA?: string;
  amountB?: string;
  balances?: IUserTokenBalances;
  swapInput?: ISwapInputState;
  isAmountALoading: boolean;
  isAmountBLoading: boolean;
  noLiquidity?: boolean;
  hasEstimatedError: boolean;
  hasReservesError: boolean;
  priceImpact: number;
  notEnoughBalance?: boolean;
  prices:
    | {
        [key: string]: number;
      }
    | undefined;
  onAssetChange: (type: "A" | "B") => void;
  onSwitch: () => void;
  setSwapInputChange: (val: ISwapInputState) => void;
}

const SwapInputs = ({
  reserves,
  tokenA,
  tokenB,
  amountA,
  amountB,
  balances,
  swapInput,
  isAmountALoading,
  isAmountBLoading,
  hasEstimatedError,
  hasReservesError,
  noLiquidity,
  priceImpact,
  notEnoughBalance,
  prices,
  onSwitch,
  setSwapInputChange,
  onAssetChange,
}: ISwapInputsProps) => {
  const errors: string[] = [];
  if (hasReservesError) {
    errors.push("Failed to fetch reserves");
  }

  if (hasEstimatedError) {
    errors.push("Failed to fetch estimated swap amount");
  }

  if (priceImpact > 30) {
    errors.push("Check price impact");
  }

  let inputADisable = false;
  let inputBDisable = false;

  if (tokenB?.decimals === 0) {
    inputADisable = true;
  }
  if (tokenA?.decimals === 0) {
    inputBDisable = true;
  }

  return (
    <>
      <div className="box is-shadowless is-marginless">
        <Input
          token={tokenA}
          val={amountA}
          userBalance={balances ? balances.amountA : "0"}
          isLoading={isAmountALoading}
          onClickAsset={() => onAssetChange("A")}
          setValue={(value) => {
            setSwapInputChange({
              type: "A",
              value,
            });
          }}
          isDisabled={inputADisable}
          notEnoughBalance={notEnoughBalance}
        />
      </div>

      <InputDivider icon={<FaArrowDown />} onClick={onSwitch} />

      <div className="box is-shadowless mb-0">
        <Input
          token={tokenB}
          val={amountB}
          userBalance={balances ? balances.amountB : "0"}
          isLoading={isAmountBLoading}
          onClickAsset={() => {
            onAssetChange("B");
          }}
          setValue={(value) => {
            setSwapInputChange({
              type: "B",
              value,
            });
          }}
          isDisabled={inputBDisable}
          price={
            prices && tokenB ? prices[tokenB.hash.toLowerCase()] : undefined
          }
        />
      </div>

      {errors && errors.length > 0 ? <SwapErrors errors={errors} /> : <></>}
    </>
  );
};

export default SwapInputs;
