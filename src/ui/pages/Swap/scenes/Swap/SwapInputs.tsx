import React, { useEffect, useState } from "react";
import Input from "../../components/Input";
import { FaExchangeAlt } from "react-icons/fa";
import { SwapContract } from "../../../../../packages/neo/contracts";
import { INetworkType } from "../../../../../packages/neo/network";
import { ITokenState } from ".";
import {
  BNEO_SCRIPT_HASH,
  GAS_SCRIPT_HASH,
  NEO_SCRIPT_HASH,
} from "../../../../../packages/neo/consts/nep17-list";

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
  setSwapType: (type: "AtoB" | "BtoA") => void;
}

interface ISearchTerm {
  type: "A" | "B";
  value?: number;
}

const SwapInputs = ({
  setSwapType,
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
    if (tokenA && tokenB && searchTerm && searchTerm.value) {
      const bNEOHash = BNEO_SCRIPT_HASH[network];

      if (
        (tokenA.hash === NEO_SCRIPT_HASH && tokenB.hash === bNEOHash) ||
        (tokenA.hash === bNEOHash && tokenB.hash === NEO_SCRIPT_HASH)
      ) {
        if (searchTerm.type === "A") {
          setAmountB(searchTerm.value);
        } else {
          setAmountA(searchTerm.value);
        }
      } else {

	      const delayDebounceFn = setTimeout(async () => {
		      if (searchTerm.type === "A") {
			      setAmountBLoading(true);
		      } else {
			      setAmountALoading(true);
		      }

		      let estimated;

		      const tokenAHash =
			      tokenA.hash === NEO_SCRIPT_HASH
				      ? BNEO_SCRIPT_HASH[network]
				      : tokenA.hash;

		      const tokenBHash =
			      tokenB.hash === NEO_SCRIPT_HASH
				      ? BNEO_SCRIPT_HASH[network]
				      : tokenB.hash;

		      if (searchTerm.type === "A") {
			      console.log(1);
			      estimated = await new SwapContract(network).getSwapEstimate(
				      tokenAHash,
				      tokenBHash,
				      tokenAHash,
				      tokenA.hash === NEO_SCRIPT_HASH ? 8 : tokenA.decimals,
				      searchTerm.value
			      );
		      } else {
			      console.log(2);
			      estimated = await new SwapContract(network).getSwapBEstimate(
				      tokenAHash,
				      tokenBHash,
				      tokenB.hash === NEO_SCRIPT_HASH ? 8 : tokenB.decimals,
				      searchTerm.value
			      );
		      }
		      if (searchTerm.type === "A") {
			      setAmountBLoading(false);
			      setAmountB(+estimated);
		      } else {
			      setAmountALoading(false);
			      setAmountA(+estimated);
		      }
	      }, 800);

	      return () => clearTimeout(delayDebounceFn);
      }
    }

  }, [searchTerm]);

  return (
    <div className="pb-2">
      <Input
        contractHash={tokenA ? tokenA.hash : ""}
        symbol={tokenA ? tokenA.symbol : undefined}
        isDisable={
          !tokenA || !tokenB || noLiquidity || tokenB.hash === NEO_SCRIPT_HASH
        }
        heading="Sell"
        onClickAsset={() => onAssetChange("A")}
        val={amountA}
        setValue={(value) => {
          setAmountA(value);
          setSearchTerm({
            type: "A",
            value,
          });
          setSwapType("AtoB");
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
        isDisable={
          !tokenA || !tokenB || noLiquidity || tokenA.hash === NEO_SCRIPT_HASH
        }
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
          setSwapType("BtoA");
        }}
        decimals={tokenB ? tokenB.decimals : undefined}
        userBalance={userTokenBBalance}
        isLoading={isAmountBLoading}
      />
    </div>
  );
};

export default SwapInputs;
