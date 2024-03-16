import React from "react";
import Input from "../../components/Input";
import { FaPlusSquare } from "react-icons/fa";
import { ISwapInputState } from "../Swap/interfaces";
import { IToken } from "../../../../../consts/tokens";
import { IUserTokenBalances } from "../../../../../common/routers/swap/interfaces";
import InputDivider from "../../components/InputDivider";

interface ILPInputsProps {
  tokenA?: IToken;
  tokenB?: IToken;
  amountA?: string;
  amountB?: string;
  balances?: IUserTokenBalances;
  swapInput?: ISwapInputState;
  notEnoughBalanceA?: boolean
  notEnoughBalanceB?: boolean
  onAssetChange: (type: "A" | "B") => void;
  setSwapInputChange: (val: ISwapInputState) => void;
}

const LPInputs = ({
  tokenA,
  tokenB,
  amountA,
  amountB,
  balances,
  notEnoughBalanceA,
  notEnoughBalanceB,
  onAssetChange,
  setSwapInputChange,
}: ILPInputsProps) => {
  let inputADisabled = false;
  let inputBDisabled = false;

  if (tokenA?.isNative) {
    inputADisabled = true;
  }
  if (tokenB?.isNative) {
    inputBDisabled = true;
  }

  return (
    <>
      <div className="box is-shadowless mb-0">
        <Input
          token={tokenA}
          val={amountA}
          isLoading={false}
          userBalance={balances ? balances.amountA : "0"}
          onClickAsset={() => {
            onAssetChange("A");
          }}
          setValue={(value) => {
            setSwapInputChange({
              type: "A",
              value,
            });
          }}
          isDisabled={inputADisabled}
          notEnoughBalance={notEnoughBalanceA}
        />
      </div>

      <InputDivider icon={<FaPlusSquare />} />

      <div className="box is-shadowless mb-0">
        <Input
          token={tokenB}
          val={amountB}
          isLoading={false}
          userBalance={balances ? balances.amountB : "0"}
          onClickAsset={() => {
            onAssetChange("B");
          }}
          setValue={(value) => {
            setSwapInputChange({
              type: "B",
              value,
            });
          }}
          isDisabled={inputBDisabled}
          notEnoughBalance={notEnoughBalanceB}
        />
      </div>
    </>
  );
};

export default LPInputs;
