import React, { useEffect } from "react";
import PageLayout from "../../components/PageLayout";
import {
  SWAP_PATH,
  SWAP_PATH_HISTORY,
  SWAP_PATH_LIQUIDITY_ADD,
  SWAP_PATH_LIQUIDITY_REMOVE,
  SWAP_PATH_LP_LIST,
  SWAP_POOL_PATH,
} from "../../../consts";
import { Route, useRouteMatch } from "react-router-dom";
import Liquidity from "./scenes/AddLiquidity";
import History from "./scenes/History";
import Trade from "./scenes/Swap";
import Pools from "./scenes/PairsFromChain";
import RemoveLiquidity from "./scenes/RemoveLiquidity";
import Providers from "./scenes/Providers";
import MarketStatus from "./components/CheckMarketStatus";

interface ISwapProps {
  path?: string;
}
const Swap = (props: ISwapProps) => {
  useEffect(() => {
    document.title = "FTW Swap";
  }, []);
  let { path } = useRouteMatch();
  if (props.path) {
    path = props.path;
  }

  console.log(path);
  return (
    <div>
      <PageLayout>
        <div className="columns is-centered">
          <div className="column is-half">
            <MarketStatus />
            <div className="box is-shadowless">
              <Route
                exact={true}
                path={path}
                component={() => <Trade rootPath={path} />}
              />
              <Route path={path + SWAP_POOL_PATH} component={Pools} />
              <Route path={path + SWAP_PATH_HISTORY} component={History} />
              <Route path={path + SWAP_PATH_LP_LIST} component={Providers} />
              <Route
                path={path + SWAP_PATH_LIQUIDITY_ADD}
                component={() => <Liquidity rootPath={path} />}
              />
              <Route
                path={path + SWAP_PATH_LIQUIDITY_REMOVE}
                component={RemoveLiquidity}
              />
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default Swap;
