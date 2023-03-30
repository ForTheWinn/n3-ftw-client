import React, { useState } from "react";
import PositionCard from "./PositionCard";
import { INetworkType } from "../../../../../packages/neo/network";
import { CHAINS } from "../../../../../consts/chains";
import { farmRouter } from "../../../../../common/routers";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { IFarmLPToken } from "../../../../../common/routers/farm/interfaces";

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
  const [prices, setPrices] = useState<any>();

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
          {data.map((item: IFarmLPToken, i) => {
            return (
              <PositionCard
                key={"position" + i}
                prices={prices}
                token={item}
                onUnStake={onUnStake}
              />
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
