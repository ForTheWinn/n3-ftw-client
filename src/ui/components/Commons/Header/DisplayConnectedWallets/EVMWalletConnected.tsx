import { Avatar } from "antd";
import React from "react";
import { ETHEREUM_LOGO } from "../../../../../consts/global";

const EVMWalletConnected = ({ isConnected, style }) => {
  if (!isConnected) return <></>;
  return <Avatar style={style} src={ETHEREUM_LOGO} />;
};

export default EVMWalletConnected;
