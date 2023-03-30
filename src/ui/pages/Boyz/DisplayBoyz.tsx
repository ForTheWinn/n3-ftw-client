import React, { useEffect, useState } from "react";
import { NFTContract } from "../../../packages/neo/contracts";
import { useWallet } from "../../../packages/neo/provider";
import { INetworkType } from "../../../packages/neo/network";
import { IRuneMeta } from "../../../packages/neo/contracts/ftw/rune/interfaces";

interface IDisplayRuneProps {
  width: string;
  height: string;
  tokenId: string;
  network: INetworkType;
  onClick: (obj) => void;
}

const DisplayBoyz = ({
  width,
  height,
  tokenId,
  network,
  onClick
}: IDisplayRuneProps) => {
  const [token, setToken] = useState<IRuneMeta | undefined>();
  useEffect(() => {
    async function fetchContractStatus() {
      const res = await new NFTContract(network).getProperties(tokenId);
      if (res) {
        setToken(res);
      }
      // try {
      //   const res = await new NFTContract(network).getProperties(tokenId);
      //   if (res) {
      //     setToken(res);
      //   }
      // } catch (e: any) {
      //   // setError(e.message);
      // }
    }
    fetchContractStatus();
  }, [tokenId]);
  if (!token) return <></>;
  return (
    <figure
      style={{ width, height }}
      className="image rune"
      onClick={() => onClick(token)}
    >
      <img src={token.image} />
    </figure>
  );
};

export default DisplayBoyz;
