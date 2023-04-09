import React from "react";
import { INetworkType } from "../../../../../packages/neo/network";
import { CHAINS } from "../../../../../consts/chains";
import { farmRouter } from "../../../../../common/routers";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import LPTokenCard from "../../../../components/LPTokenCard";
import { ISwapLPToken } from "../../../../../common/routers/swap/interfaces";

interface IPositionListProps {
  chain: CHAINS;
  address: string;
  network: INetworkType;
  onUnStake: (tokenId: string) => void;
}
const PositionList = ({
  chain,
  network,
  address,
  onUnStake
}: IPositionListProps) => {
  const { data, error } = useOnChainData(
    () => farmRouter.getStakedLPTokens(chain, network, address),
    []
  );

  return (
    <div>
      {!data ? (
        <></>
      ) : data.length > 0 ? (
        <div>
          {data.map((token: ISwapLPToken, i) => {
            return (
              <>
                <div className="media">
                  <div className="media-content">
                    <LPTokenCard {...token} />
                  </div>
                  <div className="media-right">
                    <button
                      onClick={() => onUnStake(token.tokenId)}
                      className="button is-light is-small"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      ) : (
        <div>No staking found</div>
      )}
    </div>
  );
};

export default PositionList;
