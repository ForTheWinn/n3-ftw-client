import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FARM_V2_STAKE_PATH,
  FARM_V2_STAKE_POSITIONS_PATH
} from "../../../../../consts";
import { useWallet } from "../../../../../packages/provider";
import ErrorNotificationWithRefresh from "../../../../components/ErrorNotificationWithRefresh";
import { IPrices } from "../../../../../packages/neo/api/interfaces";
import { CHAINS } from "../../../../../packages/chains/consts";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { IPoolEnhanced } from "../../../../../packages/neo/contracts/ftw/farm-v2/interfaces";
import { Avatar, Space } from "antd";
import DisplayAPR from "../../components/DisplayAPR";
import { farmRouter } from "../../../../../common/routers";

interface IStakingMainProps {
  chain: CHAINS;
  prices?: IPrices;
  nepPrice?: number;
  path: string;
}

const TableHeader = () => (
  <thead>
    <tr>
      <th>Pool</th>
      <th>Reward Tokens</th>
      <th>APR</th>
      <th></th>
    </tr>
  </thead>
);

const StakingMain = ({ prices, chain, nepPrice, path }: IStakingMainProps) => {
  const { network } = useWallet();
  const [refresh, setRefresh] = useState(0);
  const handleRefresh = () => setRefresh(refresh + 1);

  const { data, error } = useOnChainData(
    () => farmRouter.getPoolList(chain, network),
    [refresh, network]
  );

  console.log(error);

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
                to={`${path}${FARM_V2_STAKE_POSITIONS_PATH}`}
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
              <TableHeader />
              <tbody>
                {data.map((pool: IPoolEnhanced, i) => (
                  <tr key={"pool-farm-" + i}>
                    <td>
                      <Space>
                        <Avatar size="small" src={pool.tokenALogo} />
                        <Avatar size="small" src={pool.tokenBLogo} />
                        <small>
                          {pool.tokenASymbol} / {pool.tokenBSymbol}
                        </small>
                      </Space>
                    </td>
                    <td>
                      {`${pool.nepRewardsPerDay} NEP`}
                      <br />
                      {pool.hasBonusRewards && (
                        <>{`${pool.bonusRewardsPerDay} ${pool.bonusTokenSymbol}`}</>
                      )}
                    </td>
                    <td>
                      {prices && nepPrice ? (
                        <DisplayAPR
                          chain={chain}
                          network={network}
                          prices={prices}
                          nepPrice={nepPrice}
                          {...pool}
                        />
                      ) : (
                        <></>
                      )}
                    </td>
                    <td className="has-text-right">
                      <Link
                        to={`${path}${FARM_V2_STAKE_PATH}?tokenA=${pool.tokenA}&tokenB=${pool.tokenB}&tokenASymbol=${pool.tokenASymbol}&tokenBSymbol=${pool.tokenBSymbol}`}
                        className="button is-primary is-small"
                      >
                        Stake
                      </Link>
                    </td>
                  </tr>
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
