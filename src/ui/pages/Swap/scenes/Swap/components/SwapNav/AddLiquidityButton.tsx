import React from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { SWAP_PATH_LIQUIDITY_ADD } from "../../../../../../../consts/neoRoutes";

interface IAddLiquidityButtonProps {
  search?: string;
}
const AddLiquidityButton = ({ search }: IAddLiquidityButtonProps) => {
  return (
    <Link
      to={{
        pathname: `${SWAP_PATH_LIQUIDITY_ADD}`,
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
