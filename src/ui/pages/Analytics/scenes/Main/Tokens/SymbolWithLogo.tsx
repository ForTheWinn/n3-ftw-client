import React from "react";
import { MAINNET, UNKNOWN_TOKEN_IMAGE } from "../../../../../../consts/global";
import { TOKEN_LIST } from "../../../../../../consts/tokens";
import { useApp } from "../../../../../../common/hooks/use-app";
import { Avatar } from "antd";

const SymbolWithLogo = ({ id, symbol }) => {
  const { chain } = useApp();
  const hash = id.substring(2);
  const logo = TOKEN_LIST[chain][MAINNET][hash]
    ? TOKEN_LIST[chain][MAINNET][hash].icon
    : UNKNOWN_TOKEN_IMAGE;
  return (
    <div className="is-flex" style={{ alignItems: "center" }}>
      <Avatar src={logo} />
      <strong className="ml-3">{symbol}</strong>
    </div>
  );
};

export default SymbolWithLogo;
