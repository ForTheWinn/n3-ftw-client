import { Avatar } from "antd";
import React from "react";

const PolygonWalletConnected = ({ isConnected, style }) => {
  if (!isConnected) return <></>;
  return <Avatar style={style} src="/symbols/matic.png" />;
};

export default PolygonWalletConnected;
