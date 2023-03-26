import React, { useState } from "react";
import PageLayout from "../../components/Commons/PageLayout";
import { Route, useHistory, useRouteMatch } from "react-router-dom";
import {
  FARM_V2_PATH,
  FARM_V2_STAKE_PATH,
  FARM_V2_STAKE_POSITIONS_PATH
} from "../../../consts";
import StakingMain from "./scenes/Main";
import Stake from "./scenes/Stake";
import MyPositions from "./scenes/MyPositions";
import ClaimRewards from "./scenes/ClaimRewards";
import CheckMarketStatus from "./components/CheckMarketStatus";
import { useApp } from "../../../common/hooks/use-app";
import { useOnChainData } from "../../../common/hooks/use-onchain-data";
import { NEO_CHAIN, POLYGON_CHAIN } from "../../../packages/chains/consts";
import { POLYGON_FARM_PATH } from "../../../consts/polygonRoutes";
import { NEP_SCRIPT_HASH } from "../../../packages/neo/consts/neo-token-hashes";
import { useWallet } from "../../../packages/provider";
import { farmRouter } from "../../../common/routers";

interface IFarmProps {
  path?: string;
}

const Farm = (props: IFarmProps) => {
  const { chain } = useApp();
  const { network } = useWallet();
  const [refresh, setRefresh] = useState(0);
  let nepPrice = undefined;
  const { data } = useOnChainData(() => farmRouter.getPrices(chain), [refresh]);

  let { path } = useRouteMatch();
  let history = useHistory();

  if (props.path) {
    path = props.path;
  }

  if (!data) return <></>;

  if (chain === NEO_CHAIN) {
    if (path !== FARM_V2_PATH) {
      history.push(FARM_V2_PATH);
    }
    nepPrice = data[NEP_SCRIPT_HASH[network]];
  }

  if (chain === POLYGON_CHAIN) {
    if (path !== POLYGON_FARM_PATH) {
      history.push(POLYGON_FARM_PATH);
    }
    //TODO::change later
    nepPrice = data[NEP_SCRIPT_HASH[network]];
  }

  return (
    <PageLayout>
      <div className="columns">
        <div className="column is-8 is-offset-2">
          <div className="columns">
            <div className="column is-8">
              <CheckMarketStatus />
              <div className="box is-shadowless">
                <Route
                  exact={true}
                  path={path}
                  component={() => (
                    <StakingMain
                      path={path}
                      prices={data}
                      chain={chain}
                      nepPrice={nepPrice}
                    />
                  )}
                />
                <Route
                  exact={true}
                  path={`${path}${FARM_V2_STAKE_PATH}`}
                  component={() => (
                    <Stake
                      chain={chain}
                      network={network}
                      onRefresh={() => setRefresh(refresh + 1)}
                    />
                  )}
                />
                <Route
                  path={`${path}${FARM_V2_STAKE_POSITIONS_PATH}`}
                  component={() => (
                    <MyPositions
                      path={path}
                      onRefresh={() => setRefresh(refresh + 1)}
                    />
                  )}
                />
              </div>
            </div>
            <div className="column is-4">
              <ClaimRewards prices={data} />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Farm;
