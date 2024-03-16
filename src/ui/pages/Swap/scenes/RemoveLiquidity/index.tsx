import React, { useState } from "react";
import HeaderBetween from "../../../../components/Commons/HeaderBetween";
import ConnectWalletButton from "../../../../components/ConnectWalletButton";
import LPTokenCard from "../../../../components/LPTokenCard";
import RemoveLiquidityModal from "./EVMRemoveLiquidityActionModal";
import { useApp } from "../../../../../common/hooks/use-app";
import { swapRouter } from "../../../../../common/routers";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";
import { SWAP_PATH } from "../../../../../consts/routes";
import { NEO_CHAIN } from "../../../../../consts/global";
import { WENT_WRONG } from "../../../../../consts/messages";
import { Spin, message } from "antd";

const RemoveLiquidity = () => {
  const { network, chain, refreshCount, increaseRefreshCount, setTxid } =
    useApp();
  const { isConnected, address, client } = useWalletRouter(chain);

  const [tokenIdForInvoke, setTokenIdForInvoke] = useState<
    string | undefined
  >();

  const onReset = () => {
    increaseRefreshCount();
    setTokenIdForInvoke(undefined);
  };

  const onWithdraw = async (tokenId: string) => {
    if (chain === NEO_CHAIN) {
      try {
        const txid = await swapRouter.removeLiquidity(
          chain,
          network,
          tokenId,
          client
        );
        setTxid(txid);
      } catch (e: any) {
        message.error(
          e.message ? e.message : e.description ? e.description : WENT_WRONG
        );
      }
    } else {
      setTokenIdForInvoke(tokenId);
    }
  };

  const { isLoaded, error, data } = useOnChainData(
    () => swapRouter.getLPTokens(chain, network, address),
    [address, network, refreshCount]
  );
  return (
    <>
      <HeaderBetween path={SWAP_PATH} title={"LP Tokens"} />
      {isConnected ? (
        <div className="box is-shadowless">
          {!isLoaded ? (
            <div className="has-text-centered">
              <Spin />
            </div>
          ) : data.length > 0 ? (
            data.map((token) => {
              return (
                <div key={token.tokenId} className="media">
                  <div className="media-content">
                    <LPTokenCard {...token} />
                  </div>
                  <div className="media-right">
                    <button
                      onClick={() => onWithdraw(token.tokenId)}
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
        </div>
      ) : (
        <div className="mt-1">
          <ConnectWalletButton />
        </div>
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
