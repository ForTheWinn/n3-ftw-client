import React from "react";
import LogoIcon from "./LogoIcon";
import { ASSET_LIST } from "../../packages/neo/contracts/ftw/swap/consts";
import { UNKNOWN_TOKEN_IMAGE } from "../../packages/neo/consts";
import { INetworkType } from "../../packages/neo/network";

interface IPairIconsProps {
  network: INetworkType;
  tokenA: string;
  tokenB: string;
  width?: string;
  height?: string;
}
const PairIcons = ({
  network,
  tokenA,
  tokenB,
  width,
  height,
}: IPairIconsProps) => {
  let token1 = ASSET_LIST[network][tokenA]
    ? ASSET_LIST[network][tokenA]
    : undefined;

  let token2 = ASSET_LIST[network][tokenB]
    ? ASSET_LIST[network][tokenB]
    : undefined;

  // if (token2 && token2.contractHash === NEP_SCRIPT_HASH[network]) {
  //   const _token1 = token1;
  //   token1 = token2;
  //   token2 = _token1;
  // }

  return (
    <div className="is-flex">
      <LogoIcon
        width={width}
        height={width}
        img={token1 && token1.icon ? token1.icon : UNKNOWN_TOKEN_IMAGE}
      />
      <LogoIcon
        width={width}
        height={width}
        img={token2 && token2.icon ? token2.icon : UNKNOWN_TOKEN_IMAGE}
      />
    </div>
  );
};

export default PairIcons;
