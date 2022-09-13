import React from "react";
import { SmithContract } from "../../../../../packages/neo/contracts/ftw/smith";
import { INetworkType } from "../../../../../packages/neo/network";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";

interface IDisplayNFTProps {
  contractHash: string;
  tokenId: string;
  network: INetworkType;
}

const DisplayNFT = ({ contractHash, tokenId, network }: IDisplayNFTProps) => {
  const { isLoaded, error, data } = useOnChainData(() => {
    return new SmithContract(network).getProperties(contractHash, tokenId);
  }, [tokenId, network]);
  if (!isLoaded) return <></>;
  if (error) return <></>;
  return <img width="100%" height="100%" src={data.image} />;
};

export default DisplayNFT;
