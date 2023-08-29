import { Avatar } from "antd";
import React from "react";
import { POLYGON_LOGO } from "../../../../../consts/global";

const PolygonWalletConnected = ({ isConnected, style }) => {
  if (!isConnected) return <></>;
  return <Avatar style={style} src={POLYGON_LOGO} />;
};

export default PolygonWalletConnected;
