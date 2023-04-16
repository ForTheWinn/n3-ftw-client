import React, { useState } from "react";
import { Link } from "react-router-dom";
import StakingPairCard from "./StakingPairCard";
import { StakingContract } from "../../../../../packages/neo/contracts/ftw/farm";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import ErrorNotificationWithRefresh from "../../../../components/ErrorNotificationWithRefresh";
import { useApp } from "../../../../../common/hooks/use-app";
import { FARM_STAKE_POSITIONS_PATH } from "../../../../../consts/neoRoutes";

const StakingMain = () => {
  const { network } = useApp();
  const [refresh, setRefresh] = useState(0);
  const handleRefresh = () => setRefresh(refresh + 1);
  const { isLoaded, error, data } = useOnChainData(() => {
    return new StakingContract(network).getStakingPairs();
  }, [network, refresh]);

  return (
    <div>
      <div className="level is-mobile">
        <div className="level-left">
          <div className="level-item">
            <h1 className="title is-5 ">Farm</h1>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <div className="buttons">
              <Link
                to={FARM_STAKE_POSITIONS_PATH}
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
        {!isLoaded ? (
          <div>Loading..</div>
        ) : error ? (
          <ErrorNotificationWithRefresh
            error={error}
            onRefresh={handleRefresh}
          />
        ) : data && data.length > 0 ? (
          <div className="table-container">
            <table className="table is-fullwidth is-hoverable">
              <tbody>
                {data.map((item, i) => (
                  <StakingPairCard key={"sc" + i} {...item} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default StakingMain;
