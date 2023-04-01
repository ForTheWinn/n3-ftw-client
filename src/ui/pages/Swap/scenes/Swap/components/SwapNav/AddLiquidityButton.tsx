import React from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { NEO_ROUTES } from "../../../../../../../consts";

interface IAddLiquidityButtonProps {
  rootPath: string;
  search?: string;
}
const AddLiquidityButton = ({ rootPath, search }: IAddLiquidityButtonProps) => {
  return (
    <Link
      to={{
        pathname: `${rootPath + NEO_ROUTES.SWAP_PATH_LIQUIDITY_ADD}`,
        search
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
