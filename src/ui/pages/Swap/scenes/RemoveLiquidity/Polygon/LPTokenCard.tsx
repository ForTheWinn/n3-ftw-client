import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Buffer } from "buffer";

import { getTokenURI } from "../../../../../../packages/polygon/api";
import LPTokenCard from "../components/LPTokenCard";

import { ILPTokenURI } from "../../../../../../packages/polygon/interfaces";

interface ILPTokenCard {
  tokenId: string;
  onClick: () => void;
}
const LPTokenDataLoader = ({ tokenId, onClick }: ILPTokenCard) => {
  const [token, setToken] = useState<ILPTokenURI | undefined>();
  useEffect(() => {
    const load = async (_tokenId: string) => {
      // setLoading(true);
      try {
        const res: any = await getTokenURI(parseFloat(_tokenId));
        const json = Buffer.from(res.substring(29), "base64").toString();
        const jsonObject = JSON.parse(json);
        setToken(jsonObject);
        console.log(jsonObject);
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
      sharePercentage={token.shares.toString()}
      tokenAAmount={ethers.utils
        .formatUnits(token.amountA, token.decimalsA)
        .toString()}
      tokenBAmount={ethers.utils
        .formatUnits(token.amountB, token.decimalsB)
        .toString()}
      tokenASymbol={token.symbolA}
      tokenBSymbol={token.symbolB}
      onClick={onClick}
    />
  );
};

export default LPTokenDataLoader;
