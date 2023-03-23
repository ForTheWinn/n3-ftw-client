import React from "react";
import Input from "../../../components/Input";
import { FaPlusSquare } from "react-icons/fa";
import { INetworkType } from "../../../../../../packages/neo/network";
import { IReserveData } from "../../../../../../packages/neo/contracts/ftw/swap/interfaces";
import { SwapContract } from "../../../../../../packages/neo/contracts";
import {
  GAS_SCRIPT_HASH,
  NEO_SCRIPT_HASH
} from "../../../../../../packages/neo/consts/neo-token-hashes";
import { ASSET_LIST } from "../../../../../../packages/neo/contracts/ftw/swap/consts";
import { ITokenState } from "../../Swap/interfaces";

interface ILPInputsProps {
  network: INetworkType;
  tokenA?: ITokenState;
  tokenB?: ITokenState;
  amountA?: number;
  amountB?: number;
  onAssetChange: (type: "A" | "B") => void;
  setAmountA: (val?: number) => void;
  setAmountB: (val?: number) => void;
  data?: IReserveData;
  noLiquidity?: boolean;
  userTokenABalance?: number;
  userTokenBBalance?: number;
  setPeg: (val: "A" | "B") => void;
}

const LPInputs = ({
  network,
  tokenA,
  tokenB,
  onAssetChange,
  amountA,
  amountB,
  setAmountA,
  setAmountB,
  noLiquidity,
  data,
  userTokenABalance,
  userTokenBBalance,
  setPeg
}: ILPInputsProps) => {
  const handleChangeAmountA = (val) => {
    setAmountA(val);
    if (val !== undefined) {
      if (!noLiquidity && data && tokenA && tokenB) {
        const estimated = new SwapContract(network).getLPEstimate(
          val,
          tokenA.hash === NEO_SCRIPT_HASH ? 8 : tokenA.decimals, // Use bNEO decimals here
          tokenB.hash === NEO_SCRIPT_HASH ? 8 : tokenB.decimals,
          data.pair[tokenA.hash].reserveAmount,
          data.pair[tokenB.hash].reserveAmount
        );
        setAmountB(parseFloat(estimated));
        setPeg("A");
      }
    } else {
      if (!noLiquidity) {
        setAmountB(undefined);
      }
    }
  };

  const handleChangeAmountB = (val) => {
    setAmountB(val);
    if (val !== undefined) {
      if (!noLiquidity && data && tokenA && tokenB) {
        const estimated = new SwapContract(network).getLPEstimate(
          val,
          tokenB.hash === NEO_SCRIPT_HASH ? 8 : tokenB.decimals,
          tokenA.hash === NEO_SCRIPT_HASH ? 8 : tokenA.decimals,
          data.pair[tokenB.hash].reserveAmount,
          data.pair[tokenA.hash].reserveAmount
        );
        setAmountA(parseFloat(estimated));
        setPeg("B");
      }
    } else {
      if (!noLiquidity) {
        setAmountA(undefined);
      }
    }
  };

  return (
    <>
      <Input
        isDisable={!tokenA || (tokenB && tokenB.symbol === "NEO")}
        heading="Pair A"
        onClickAsset={() => {
          onAssetChange("A");
        }}
        contractHash={tokenA ? tokenA.hash : ""}
        symbol={tokenA ? tokenA.symbol : ""}
        logo={
          tokenA && ASSET_LIST[network][tokenA.hash]
            ? ASSET_LIST[network][tokenA.hash].icon
            : undefined
        }
        decimals={tokenA ? tokenA.decimals : undefined}
        val={amountA}
        setValue={handleChangeAmountA}
        userBalance={userTokenABalance}
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
      <div className="pt-4 pb-4 has-text-centered">
        <FaPlusSquare size={16} />
      </div>
      <Input
        isDisable={!tokenB || (tokenA && tokenA.hash === NEO_SCRIPT_HASH)}
        heading="Pair B"
        onClickAsset={() => {
          onAssetChange("B");
        }}
        contractHash={tokenB ? tokenB.hash : ""}
        symbol={tokenB ? tokenB.symbol : ""}
        logo={
          tokenB && ASSET_LIST[network][tokenB.hash]
            ? ASSET_LIST[network][tokenB.hash].icon
            : undefined
        }
        decimals={tokenB ? tokenB.decimals : undefined}
        val={amountB}
        setValue={handleChangeAmountB}
        userBalance={userTokenBBalance}
        balanceOverflow={
          !!(amountB && userTokenBBalance && amountB > userTokenBBalance)
        }
        errorMessage={
          tokenB &&
          tokenB.hash === GAS_SCRIPT_HASH &&
          tokenB &&
          userTokenABalance &&
          amountB === userTokenBBalance
            ? "You need to have more GAS for a tx fee"
            : undefined
        }
      />
    </>
  );
};

export default LPInputs;
