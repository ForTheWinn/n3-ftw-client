import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FARM_V2_STAKE_POSITIONS_PATH } from "../../../../../consts";
import StakingPairCard from "./StakingPairCard";
import { useWallet } from "../../../../../packages/provider";
import ErrorNotificationWithRefresh from "../../../../components/ErrorNotificationWithRefresh";
import { FarmV2Contract } from "../../../../../packages/neo/contracts/ftw/farm-v2";
import { NEP_SCRIPT_HASH } from "../../../../../packages/neo/consts/nep17-list";
import { IPrices } from "../../../../../packages/neo/api/interfaces";
import { CHAINS } from "../../../../../packages/chains/consts";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { getPoolList, getPrices } from "../../services";

interface IStakingMainProps {
  chain: CHAINS;
  prices?: IPrices;
}
const StakingMain = ({ prices, chain }: IStakingMainProps) => {
  const { network } = useWallet();
  const [refresh, setRefresh] = useState(0);
  const handleRefresh = () => setRefresh(refresh + 1);

  const { data, error } = useOnChainData(
    () => getPoolList(chain, network),
    [refresh, network]
  );

  return (
    <div>
      <div className="level is-mobile">
        <div className="level-left">
          <div className="level-item">
            <h1 className="title is-5 ">Double Farm</h1>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <div className="buttons">
              <Link
                to={FARM_V2_STAKE_POSITIONS_PATH}
                className="button is-light is-small is-rounded"
              >
                My positions
              </Link>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div>
        {!data ? (
          <div>Loading..</div>
        ) : error ? (
          <ErrorNotificationWithRefresh
            error={error}
            onRefresh={handleRefresh}
          />
        ) : (
          <div className="table-container">
            <table className="table is-fullwidth">
              <thead>
                <tr>
                  <th>Pool</th>
                  <th>Reward tokens</th>
                  <th>APR</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, i) => (
                  <StakingPairCard
                    key={"sc" + i}
                    {...item}
                    tokenAPrice={prices ? prices["0x" + item.tokenA] : 0}
                    tokenBPrice={prices ? prices["0x" + item.tokenB] : 0}
                    nepPrice={
                      prices ? prices["0x" + NEP_SCRIPT_HASH[network]] : 0
                    }
                    bonusTokenPrice={
                      prices ? prices["0x" + item.bonusToken] : 0
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StakingMain;
