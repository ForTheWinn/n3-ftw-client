import React, { useState } from "react";
import { Link } from "react-router-dom";
import ErrorNotificationWithRefresh from "../../../../components/ErrorNotificationWithRefresh";
import { CONFIGS } from "../../../../../consts/chains";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { Avatar, Space } from "antd";
import DisplayAPR from "../../components/DisplayAPR";
import { farmRouter } from "../../../../../common/routers";
import { IFarmPair } from "../../../../../common/routers/farm/interfaces";
import { useApp } from "../../../../../common/hooks/use-app";
import {
  FARM_V2_STAKE_PATH,
  FARM_V2_STAKE_POSITIONS_PATH
} from "../../../../../consts/routes";

const TableHeader = () => (
  <thead>
    <tr>
      <th>Pool</th>
      <th>Rewards</th>
      <th>APR</th>
      <th></th>
    </tr>
  </thead>
);

const StakingMain = () => {
  const { chain, network } = useApp();
  const [refresh, setRefresh] = useState(0);
  const handleRefresh = () => setRefresh(refresh + 1);

  const { data, error } = useOnChainData(
    () => farmRouter.getPoolList(chain, network),
    [chain, refresh, network]
  );

  return (
    <div>
      <div className="box is-shadowless mb-1">
        <div className="level is-mobile mb-1">
          <div className="level-left">
            <div className="level-item">
              <Space>
                <Avatar src={CONFIGS[network][chain].icon} />
                <h1 className="title is-5 is-marginless">Farm</h1>
              </Space>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <div className="buttons">
                <Link
                  to={`${FARM_V2_STAKE_POSITIONS_PATH}`}
                  className="button is-light is-small is-rounded"
                >
                  My staking
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="box is-shadowless mb-1">
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
                  {data.map((pair: IFarmPair, i) => (
                    <tr key={"pool-farm-" + i}>
                      <td>
                        <Space>
                          <Avatar size="small" src={pair.iconA} />
                          <Avatar size="small" src={pair.iconB} />
                          <small>
                            {pair.symbolA} / {pair.symbolB}
                          </small>
                        </Space>
                      </td>
                      <td>
                        {`${pair.nepRewardsPerDay} NEP`}
                        <br />
                        {pair.hasBonusRewards && (
                          <>{`${pair.bonusRewardsPerDay} ${pair.bonusTokenSymbol}`}</>
                        )}
                      </td>
                      <td>
                        <DisplayAPR
                          chain={chain}
                          network={network}
                          pair={pair}
                        />
                      </td>
                      <td className="has-text-right">
                        <Link
                          to={`${FARM_V2_STAKE_PATH}?tokenA=${pair.tokenA}&tokenB=${pair.tokenB}&tokenASymbol=${pair.symbolA}&tokenBSymbol=${pair.symbolB}`}
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
    </div>
  );
};

export default StakingMain;
