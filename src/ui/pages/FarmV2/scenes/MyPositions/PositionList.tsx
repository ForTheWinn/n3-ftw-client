import React, { useEffect, useState } from "react";
import PositionCard from "./PositionCard";
import { INetworkType } from "../../../../../packages/neo/network";
import { IConnectedWallet } from "../../../../../packages/neo/wallet/interfaces";
import { FarmV2Contract } from "../../../../../packages/neo/contracts/ftw/farm-v2";
import { RestAPI } from "../../../../../packages/neo/api";

interface IPositionListProps {
  network: INetworkType;
  connectedWallet: IConnectedWallet;
  refresh: number;
  onUnStake: (tokenId: string) => void;
}
const PositionList = ({
  network,
  connectedWallet,
  refresh,
  onUnStake,
}: IPositionListProps) => {
  const [data, setData] = useState<any>();
  const [prices, setPrices] = useState<any>();

  useEffect(() => {
    async function getData(wallet) {
      try {
        const res = await new FarmV2Contract(network).getStakedLPTokens(wallet);
        setData(res);
      } catch (e: any) {
        console.log(e);
      }

      try {
        const res = await new RestAPI(network).getPrices();
        setPrices(res);
      } catch (e: any) {
        console.log(e);
      }
    }
    if (connectedWallet) {
      getData(connectedWallet);
    }
  }, [connectedWallet, refresh, network]);

  return (
    <div>
      {!data ? (
        <></>
      ) : data.length > 0 ? (
        <div>
          {data.map((item, i) => {
            return (
              <PositionCard
                network={network}
                key={"position" + i}
                prices={prices}
                {...item}
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
