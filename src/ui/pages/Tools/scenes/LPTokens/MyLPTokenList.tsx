import React from "react";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { SwapContract } from "../../../../../packages/neo/contracts";
import MyLPTokenItem from "./MyLPTokenItem";

const MyLPTokenList = ({ connectedWallet, network, prices }) => {
  const { isLoaded, error, data } = useOnChainData(() => {
    return new SwapContract(network).getLPTokens(connectedWallet);
  }, [connectedWallet, network]);
  return (
    <div className="box is-shadowless">
      <h1 className="title is-6 is-marginless">My LP tokens</h1>
      <hr />
      {data ? (
        data.length === 0 ? (
          <div>Your wallet doesn't have LP tokens</div>
        ) : (
          data.map((token, i) => {
            return (
              <MyLPTokenItem
                key={`lp-item-${token.tokenId}`}
                token={token}
                prices={prices}
                network={network}
              />
            );
          })
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default MyLPTokenList;
