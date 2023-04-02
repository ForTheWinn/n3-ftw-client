import React from "react";
import { Route, useHistory, useRouteMatch } from "react-router-dom";
import { useApp } from "../../../common/hooks/use-app";
import { NEO_ROUTES, POLYGON_ROUTES } from "../../../consts";

import PageLayout from "../../components/Commons/PageLayout";
import Liquidity from "./scenes/AddLiquidity";
import Trade from "./scenes/Swap";
import RemoveLiquidity from "./scenes/RemoveLiquidity";
import { NEO_CHAIN, POLYGON_CHAIN } from "../../../consts/chains";
import PolygonSwap from "./scenes/Swap/Polygon";
import PolygonAddLiquidity from "./scenes/AddLiquidity/Polygon";

// import MarketStatus from "./components/CheckMarketStatus";

interface ISwapProps {
  path?: string;
}

const Swap = (props: ISwapProps) => {
  // useEffect(() => {
  //   document.title = "FTW Swap";
  // }, []);

  let { path } = useRouteMatch();
  let history = useHistory();
  const { chain } = useApp();

  if (props.path) {
    path = props.path;
  }

  if (path !== NEO_ROUTES.SWAP_PATH && chain === NEO_CHAIN) {
    history.push(NEO_ROUTES.SWAP_PATH);
  }

  if (path !== POLYGON_ROUTES.SWAP_PATH && chain === POLYGON_CHAIN) {
    history.push(POLYGON_ROUTES.SWAP_PATH);
  }

  return (
    <div>
      <PageLayout>
        <div className="columns is-centered">
          <div className="column is-half">
            <div className="box is-shadowless is-relative">
              <Route
                exact={true}
                path={path}
                component={() => <PolygonSwap rootPath={path} />}
              />
              <Route
                path={path + NEO_ROUTES.SWAP_PATH_LIQUIDITY_ADD}
                component={() => <PolygonAddLiquidity rootPath={path} />}
              />
              <Route
                path={path + NEO_ROUTES.SWAP_PATH_LIQUIDITY_REMOVE}
                component={() => <RemoveLiquidity rootPath={path} />}
              />
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default Swap;
