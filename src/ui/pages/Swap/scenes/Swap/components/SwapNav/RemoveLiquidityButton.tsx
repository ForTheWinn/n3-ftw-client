import React from "react";
import { FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { NEO_ROUTES } from "../../../../../../../consts";

interface IRemoveLiquidityButtonProps {
  rootPath: string;
}
const RemoveLiquidityButton = ({ rootPath }: IRemoveLiquidityButtonProps) => {
  return (
    <Link
      to={rootPath + NEO_ROUTES.SWAP_PATH_LIQUIDITY_REMOVE}
      data-tip
      data-for="removeLiquidity"
      className="button is-small is-white"
    >
      <span className="icon">
        <FaMinus />
      </span>
      <span className="ml-1">Withdraw</span>
    </Link>
  );
};

export default RemoveLiquidityButton;
