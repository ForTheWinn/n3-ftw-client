import React from "react";
import { Route, useHistory, useLocation } from "react-router-dom";
import PairDetail from "./scenes/PairDetail";
import TokenDetail from "./scenes/TokenDetail";
import PageLayout from "../../components/Commons/PageLayout";
import {
  ANALYTICS_ETHEREUM_SWAP_PATH,
  ANALYTICS_NEOX_SWAP_PATH,
  ANALYTICS_NEO_SWAP_PATH,
  ANALYTICS_PAIRS_PATH,
  ANALYTICS_PATH,
  ANALYTICS_POLYGON_SWAP_PATH,
  ANALYTICS_TOKENS_PATH,
} from "../../../consts/routes";
import { NEO_CHAIN } from "../../../consts/global";
import NEPAnalytics from "./scenes/NEPAnalytics";
import NEOAnalytics from "./scenes/NEOAnalytics";
import PolygonAnalytics from "./scenes/EVMAnalytics/Polygon";
import EthereumAnalytics from "./scenes/EVMAnalytics/Ethereum";
import NeoXAnalytics from "./scenes/EVMAnalytics/NeoX";
import TokenDetailPage from "./components/Pairs/TokenDetailPage";

const Analytics = () => {
  const location = useLocation();
  const history = useHistory();
  const handleTabChange = (key) => {
    switch (key) {
      case "nep":
        history.push(ANALYTICS_PATH);
        break;
      case "neo-swap":
        history.push(ANALYTICS_NEO_SWAP_PATH);
        break;
      case "neox-swap":
        history.push(ANALYTICS_NEOX_SWAP_PATH);
        break;
      case "polygon-swap":
        history.push(ANALYTICS_POLYGON_SWAP_PATH);
        break;
      case "ethereum-swap":
        history.push(ANALYTICS_ETHEREUM_SWAP_PATH);
        break;
      // Handle other tabs accordingly...
      default:
        break;
    }
  };

  return (
    <PageLayout>
      <div className="box is-shadowless">
        <Route
          exact={true}
          path={`${ANALYTICS_PATH}`}
          component={NEPAnalytics}
        />
        <Route
          exact={true}
          path={`${ANALYTICS_NEO_SWAP_PATH}`}
          component={NEOAnalytics}
        />
        <Route
          path={`${ANALYTICS_NEO_SWAP_PATH}/token/:tokenId`}
          component={(props) => {
            return (
              <TokenDetailPage
                chain={NEO_CHAIN}
                tokens={[props.match.params.tokenId]}
              />
            );
          }}
        />
        <Route path={`${ANALYTICS_NEOX_SWAP_PATH}`} component={NeoXAnalytics} />
        <Route
          path={`${ANALYTICS_POLYGON_SWAP_PATH}`}
          component={PolygonAnalytics}
        />
        <Route
          path={`${ANALYTICS_ETHEREUM_SWAP_PATH}`}
          component={EthereumAnalytics}
        />
        <Route
          exact={true}
          path={`${ANALYTICS_PAIRS_PATH}/:pairId`}
          component={(props) => {
            return <PairDetail id={props.match.params.pairId} />;
          }}
        />
        <Route
          exact={true}
          path={`${ANALYTICS_TOKENS_PATH}/:tokenId`}
          component={(props) => {
            return <TokenDetail tokenId={props.match.params.tokenId} />;
          }}
        />
      </div>
    </PageLayout>
  );
};

export default Analytics;
