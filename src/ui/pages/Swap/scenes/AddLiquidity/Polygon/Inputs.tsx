import React from "react";
import Input from "../../../components/Input";
import { FaExchangeAlt, FaPlusSquare } from "react-icons/fa";
import {
  IBalancesState,
  ISwapInputState,
  ITokenState,
} from "../../Swap/interfaces";

interface ILPInputsProps {
  tokenA?: ITokenState;
  tokenB?: ITokenState;
  amountA?: number;
  amountB?: number;
  balances?: IBalancesState;
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
  setSwapInputChange,
}: ILPInputsProps) => {

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

  const amountBOverflow =
    !!(
      swapInput &&
      swapInput.type === "B" &&
      amountB &&
      balances &&
      amountB > parseFloat(balances.amountB)
    ) ||
    !!(
      swapInput &&
      swapInput.type === "B" &&
      amountB &&
      balances &&
      amountB > parseFloat(balances.amountB)
    );
  return (
    <>
      <div className="pb-2">
        <Input
          isLoading={false}
          isDisable={!tokenA}
          heading="Pair A"
          onClickAsset={() => {
            onAssetChange("A");
          }}
          contractHash={tokenA ? tokenA.hash : ""}
          symbol={tokenA ? tokenA.symbol : ""}
          logo={tokenA ? tokenA.icon : undefined}
          decimals={tokenA ? tokenA.decimals : undefined}
          val={amountA}
          setValue={(value) => {
            setSwapInputChange({
              type: "A",
              value,
            });
          }}
          userBalance={balances ? parseFloat(balances.amountA) : undefined}
          balanceOverflow={amountAOverflow}
        />
      </div>

      <div className="pt-5 pb-5">
        <button className="button is-white is-fullwidth">
          <FaPlusSquare />
        </button>
      </div>

      <Input
        isLoading={false}
        isDisable={!tokenB}
        heading="Pair B"
        onClickAsset={() => {
          onAssetChange("B");
        }}
        contractHash={tokenB ? tokenB.hash : ""}
        symbol={tokenB ? tokenB.symbol : ""}
        logo={tokenB ? tokenB.icon : undefined}
        decimals={tokenB ? tokenB.decimals : undefined}
        val={amountB}
        setValue={(value) => {
          setSwapInputChange({
            type: "B",
            value,
          });
        }}
        userBalance={balances ? parseFloat(balances.amountB) : undefined}
        balanceOverflow={amountBOverflow}
      />
    </>
  );
};

export default LPInputs;
