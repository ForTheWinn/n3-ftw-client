import React from "react";
import LogoIcon from "./LogoIcon";
import { INetworkType } from "../../packages/neo/network";
import { UNKNOWN_TOKEN_IMAGE } from "../../consts/global";
import { CHAINS } from "../../consts";
import { TOKEN_LIST } from "../../consts/tokens";

interface IPairIconsProps {
  network: INetworkType;
  tokenA: string;
  tokenB: string;
  width?: string;
  height?: string;
  chain: CHAINS.CHAINS;
}
const PairIcons = ({
  network,
  tokenA,
  tokenB,
  width,
  height,
  chain
}: IPairIconsProps) => {
  let token1 = TOKEN_LIST[chain][network][tokenA]
    ? TOKEN_LIST[chain][network][tokenA]
    : undefined;

  let token2 = TOKEN_LIST[chain][network][tokenB]
    ? TOKEN_LIST[chain][network][tokenB]
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
