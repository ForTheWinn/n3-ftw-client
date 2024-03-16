import React from "react";
import { Link } from "react-router-dom";
import { SWAP_PATH_LIQUIDITY_REMOVE } from "../../../../../../../consts/routes";
import { Button } from "antd";
import { MinusOutlined } from "@ant-design/icons";

const RemoveLiquidityButton = () => {
  return (
    <Link to={SWAP_PATH_LIQUIDITY_REMOVE} data-tip data-for="removeLiquidity">
      <Button icon={<MinusOutlined />} size="small" type="text">
        Withdraw
      </Button>
    </Link>
  );
};

export default RemoveLiquidityButton;
