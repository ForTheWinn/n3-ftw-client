import React from "react";
import Input from "../../components/Input";
import { FaPlusSquare } from "react-icons/fa";
import { ISwapInputState, ITokenState } from "../Swap/interfaces";
import { IUserTokenBalances } from "../../../../../common/routers/swap/interfaces";
import InputDivider from "../../components/InputDivider";

interface ILPInputsProps {
  tokenA?: ITokenState;
  tokenB?: ITokenState;
  amountA?: string;
  amountB?: string;
  balances?: IUserTokenBalances;
  swapInput?: ISwapInputState;
  onAssetChange: (type: "A" | "B") => void;
  setSwapInputChange: (val: ISwapInputState) => void;
}

const LPInputs = ({
  tokenA,
  tokenB,
  amountA,
  amountB,
  balances,
  swapInput,
  onAssetChange,
  setSwapInputChange
}: ILPInputsProps) => {
  // const amountAOverflow =
  //   !!(
  //     swapInput &&
  //     swapInput.type === "A" &&
  //     amountA &&
  //     balances &&
  //     parseFloat(amountA) > parseFloat(balances.amountA)
  //   ) ||
  //   !!(
  //     swapInput &&
  //     swapInput.type === "B" &&
  //     amountA &&
  //     balances &&
  //     parseFloat(amountA) > parseFloat(balances.amountA)
  //   );

  // const amountBOverflow =
  //   !!(
  //     swapInput &&
  //     swapInput.type === "B" &&
  //     amountB &&
  //     balances &&
  //     amountB > parseFloat(balances.amountB)
  //   ) ||
  //   !!(
  //     swapInput &&
  //     swapInput.type === "B" &&
  //     amountB &&
  //     balances &&
  //     amountB > parseFloat(balances.amountB)
  //   );
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
              value
            });
          }}
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
              value
            });
          }}
        />
      </div>
    </>
  );
};

export default LPInputs;
