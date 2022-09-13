import React, { useEffect, useState } from "react";
import { SmithContract } from "../../../../../packages/neo/contracts/ftw/smith";
import { useWallet } from "../../../../../packages/provider";
import DisplayNFT from "./DisplayNFT";
import _ from "underscore";
import { MAINNET } from "../../../../../packages/neo/consts";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
interface ITokensProps {
  contractHash: string;
}
const Tokens = ({ contractHash }: ITokensProps) => {
  const { network } = useWallet();
  const { isLoaded, error, data } = useOnChainData(() => {
    return new SmithContract(network).totalSupply(contractHash);
  }, [network]);
  return (
    <>
      {!isLoaded ? (
        <div>Loading..</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          {data > 0 ? (
            <>
              <div className="columns is-multiline is-mobile">
                {_.range(data > 12 ? 12 : data).map((i) => {
                  const tokenId = i + 1;
                  return (
                    <div
                      key={`token${i}`}
                      className="column is-1-desktop is-3-mobile"
                    >
                      <DisplayNFT
                        network={network}
                        contractHash={contractHash}
                        tokenId={tokenId.toString()}
                      />
                    </div>
                  );
                })}
              </div>
              {data > 12 && (
                <a
                  className="button is-black"
                  target="_blank"
                  href={`https://${
                    network === MAINNET
                      ? "explorer.onegate.space"
                      : "testnet.explorer.onegate.space"
                  }/NFTtokeninfo/0x${contractHash}`}
                >
                  <span className="icon">
                    <FaExternalLinkAlt />
                  </span>
                  <span>Browse more</span>
                </a>
              )}
            </>
          ) : (
            <div>No collections yet</div>
          )}
        </>
      )}
    </>
  );
};

export default Tokens;
