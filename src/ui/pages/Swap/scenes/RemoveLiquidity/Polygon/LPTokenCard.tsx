import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Buffer } from "buffer";

import { getTokenURI } from "../../../../../../packages/polygon/swap";
import LPTokenCard from "../components/LPTokenCard";

import { IFarmLPToken } from "../../../../../../common/routers/farm/interfaces";

interface ILPTokenCard {
  tokenId: string;
  onClick: () => void;
}
const LPTokenDataLoader = ({ tokenId, onClick }: ILPTokenCard) => {
  const [token, setToken] = useState<IFarmLPToken | undefined>();
  useEffect(() => {
    const load = async (_tokenId: string) => {
      try {
        const res: any = await getTokenURI(_tokenId);
        setToken(res);
      } catch (e) {
        console.log(e);
      }
    };
    load(tokenId);
  }, [tokenId]);
  if (!token) return <></>;
  return (
    <LPTokenCard
      tokenId={tokenId}
      sharePercentage={token.sharesPercentage}
      tokenAAmount={token.amountA}
      tokenBAmount={token.amountB}
      tokenASymbol={token.symbolA}
      tokenBSymbol={token.symbolB}
      onClick={onClick}
    />
  );
};

export default LPTokenDataLoader;
