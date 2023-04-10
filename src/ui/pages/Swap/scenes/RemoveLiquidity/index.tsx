import React, { useState } from "react";
import HeaderBetween from "../../../../components/Commons/HeaderBetween";
import ConnectWalletButton from "../../../../components/ConnectWalletButton";
import LPTokenCard from "../../../../components/LPTokenCard";
import RemoveLiquidityModal from "./RemoveLiquidityModal";
import { useApp } from "../../../../../common/hooks/use-app";
import { NEO_ROUTES } from "../../../../../consts";
import { swapRouter } from "../../../../../common/routers";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";

const RemoveLiquidity = () => {
  const { network, chain, refreshCount, increaseRefreshCount } = useApp();
  const { isConnected, address } = useWalletRouter(chain);

  const [tokenIdForInvoke, setTokenIdForInvoke] = useState<
    string | undefined
  >();

  const onReset = () => {
    increaseRefreshCount();
    setTokenIdForInvoke(undefined);
  };
  const { isLoaded, error, data } = useOnChainData(
    () => swapRouter.getLPTokens(chain, network, address),
    [address, network, refreshCount]
  );
  return (
    <>
      <HeaderBetween path={NEO_ROUTES.SWAP_PATH} title={"Withdraw liquidity"} />
      <hr />
      {isConnected ? (
        <>
          {!isLoaded ? (
            <div>Loading..</div>
          ) : data.length > 0 ? (
            data.map((token) => {
              return (
                <div key={token.tokenId} className="media">
                  <div className="media-content">
                    <LPTokenCard {...token} />
                  </div>
                  <div className="media-right">
                    <button
                      onClick={() => setTokenIdForInvoke(token.tokenId)}
                      className="button is-light is-small"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div>Your wallet doesn't have any LP tokens.</div>
          )}
        </>
      ) : (
        <ConnectWalletButton />
      )}

      {address && tokenIdForInvoke ? (
        <RemoveLiquidityModal
          chain={chain}
          network={network}
          address={address}
          tokenId={tokenIdForInvoke}
          onSuccess={onReset}
          onCancel={onReset}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default RemoveLiquidity;
