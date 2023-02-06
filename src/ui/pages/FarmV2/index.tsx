import React, { useEffect, useState } from "react";
import PageLayout from "../../components/Commons/PageLayout";
import { Route } from "react-router-dom";
import {
  FARM_V2_PATH,
  FARM_V2_STAKE_PATH,
  FARM_V2_STAKE_POSITIONS_PATH,
} from "../../../consts";
import StakingMain from "./scenes/Main";
import Stake from "./scenes/Stake";
import MyPositions from "./scenes/MyPositions";
import ClaimRewards from "./scenes/ClaimRewards";
import CheckMarketStatus from "./components/CheckMarketStatus";
import { RestAPI } from "../../../packages/neo/api";
import { MAINNET } from "../../../packages/neo/consts";
import { useWallet } from "../../../packages/provider";
import { IPrices } from "../../../packages/neo/api/interfaces";
import BoyzStaking from "./components/BoyzStaking";

const Farm = () => {
  const [refresh, setRefresh] = useState(0);
  const { network } = useWallet();
  const [prices, setPrices] = useState<IPrices | undefined>();

  useEffect(() => {
    document.title = "FTW Double Farm";
    async function fetch() {
      const res = await new RestAPI(MAINNET).getPrices();
      setPrices(res);
    }
    fetch();
  }, [refresh, network]);

  if (!prices) return <></>;

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
                  path={FARM_V2_PATH}
                  component={() => <StakingMain prices={prices} />}
                />
                <Route
                  exact={true}
                  path={FARM_V2_STAKE_PATH}
                  component={() => (
                    <Stake onRefresh={() => setRefresh(refresh + 1)} />
                  )}
                />
                <Route
                  path={FARM_V2_STAKE_POSITIONS_PATH}
                  component={() => (
                    <MyPositions onRefresh={() => setRefresh(refresh + 1)} />
                  )}
                />
              </div>
            </div>
            <div className="column is-4">
              <ClaimRewards prices={prices} />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Farm;
