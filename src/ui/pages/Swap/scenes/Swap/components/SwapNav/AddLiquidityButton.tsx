import React from "react";
import { Link } from "react-router-dom";
import { SWAP_PATH_LIQUIDITY_ADD } from "../../../../../../../consts/routes";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface IAddLiquidityButtonProps {
  search?: string;
}
const AddLiquidityButton = ({ search }: IAddLiquidityButtonProps) => {
  return (
    <Link
      to={{
        pathname: `${SWAP_PATH_LIQUIDITY_ADD}`,
        search,
      }}
    >
      <Button icon={<PlusOutlined />} size="small" type="text">
        Add Liquidity
      </Button>
    </Link>
  );
};

export default AddLiquidityButton;
