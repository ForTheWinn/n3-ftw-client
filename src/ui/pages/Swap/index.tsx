import React from "react";
import PageLayout from "../../components/PageLayout";
import {
  SWAP_PATH,
  
  SWAP_PATH_HISTORY,
  SWAP_PATH_LIQUIDITY_ADD,
  SWAP_PATH_LIQUIDITY_REMOVE,
  SWAP_PATH_LP_LIST,
  SWAP_PATH_TRADE,
  SWAP_POOL_PATH,
} from "../../../consts";
import { Route } from "react-router-dom";
import Liquidity from "./scenes/AddLiquidity";
import { useWallet } from "../../../packages/provider";
import { MAINNET } from "../../../packages/neo/consts";
import History from "./scenes/History";
import Trade from "./scenes/Swap";
import Pools from "./scenes/Pools";
import RemoveLiquidity from "./scenes/RemoveLiquidity";
import Providers from "./scenes/Providers";
import Main from "./scenes/Main";

const Swap = () => {
  const { network } = useWallet();
  if (network === MAINNET)
    return (
      <PageLayout>
        <div className="notification is-info">
          FTW Swap is not on Mainnet yet.{" "}
        </div>
      </PageLayout>
    );
  return (
    <div>
      <PageLayout>
        <div className="columns is-centered">
          <div className="column is-half">
            <div className="box is-shadowless">
              <Route exact={true} path={SWAP_PATH} component={Main} />
              <Route path={SWAP_POOL_PATH} component={Pools} />
              <Route path={SWAP_PATH_HISTORY} component={History} />
              <Route path={SWAP_PATH_LP_LIST} component={Providers} />
              <Route path={SWAP_PATH_LIQUIDITY_ADD} component={Liquidity} />
              <Route
                path={SWAP_PATH_LIQUIDITY_REMOVE}
                component={RemoveLiquidity}
              />
              <Route path={SWAP_PATH_TRADE} component={Trade} />
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default Swap;