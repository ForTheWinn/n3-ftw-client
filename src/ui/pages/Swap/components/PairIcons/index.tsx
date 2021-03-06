import React from "react";
import { UNKNOWN_TOKEN_IMAGE } from "../../../../../packages/neo/consts";
import { ASSET_LIST } from "../../../../../packages/neo/contracts/ftw/swap/consts";
import LogoIcon from "../../../../components/LogoIcon";

interface IPairIconsProps {
  network: string;
  token: string;
  tokenSymbol: string;
}
const PairIcons = ({ network, token, tokenSymbol }: IPairIconsProps) => {
  const tokenALogo = ASSET_LIST[network][token]
    ? ASSET_LIST[network][token].logo
    : UNKNOWN_TOKEN_IMAGE;

  return (
    <div
      id="PairIcons"
      className="is-centered"
      style={{ display: "flex", alignItems: "center" }}
    >
      <div className="mr-2">
        <LogoIcon img={tokenALogo} />
      </div>
      {tokenSymbol}
    </div>
  );
};

export default PairIcons;
