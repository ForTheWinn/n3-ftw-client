import React from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { SWAP_PATH_LIQUIDITY_ADD } from "../../../../../../../consts";
import {
  BNEO_SCRIPT_HASH,
  NEO_SCRIPT_HASH,
} from "../../../../../../../packages/neo/consts/nep17-list";
import { INetworkType } from "../../../../../../../packages/neo/network";

interface IAddLiquidityButtonProps {
  rootPath: string;
  tokenA?: any;
  tokenB?: any;
  network: INetworkType;
}
const AddLiquidityButton = ({
  rootPath,
  tokenA,
  tokenB,
  network,
}: IAddLiquidityButtonProps) => {
  return (
    <Link
      to={{
        pathname: `${rootPath + SWAP_PATH_LIQUIDITY_ADD}`,
        search:
          tokenA &&
          tokenB &&
          !(
            tokenA.hash === NEO_SCRIPT_HASH &&
            tokenB.hash === BNEO_SCRIPT_HASH[network]
          ) &&
          !(
            tokenA.hash === BNEO_SCRIPT_HASH[network] &&
            tokenB.hash === NEO_SCRIPT_HASH
          )
            ? `?tokenA=${tokenA.hash}&tokenB=${tokenB.hash}`
            : "",
      }}
      className="button is-small is-white"
    >
      <span className="icon">
        <FaPlus />
      </span>
      <span className="ml-1">Add Liquidity</span>
    </Link>
  );
};

export default AddLiquidityButton;
