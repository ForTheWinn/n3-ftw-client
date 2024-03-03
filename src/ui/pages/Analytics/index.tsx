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
import { Avatar, Tabs } from "antd";
import {
  ETHEREUM_LOGO,
  NEO_LOGO,
  NEP_LOGO,
  POLYGON_LOGO,
} from "../../../consts/global";
import NEPAnalytics from "./scenes/NEPAnalytics";
import NEOAnalytics from "./scenes/NEOAnalytics";
import PolygonAnalytics from "./scenes/EVMAnalytics/Polygon";
import EthereumAnalytics from "./scenes/EVMAnalytics/Ethereum";
import NeoXAnalytics from "./scenes/EVMAnalytics/NeoX";

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
        <Tabs
          onChange={handleTabChange}
          activeKey={(() => {
            if (location.pathname.includes(ANALYTICS_NEO_SWAP_PATH))
              return "neo-swap";
            if (location.pathname.includes(ANALYTICS_NEOX_SWAP_PATH))
              return "neox-swap";
            if (location.pathname.includes(ANALYTICS_POLYGON_SWAP_PATH))
              return "polygon-swap";
            if (location.pathname.includes(ANALYTICS_ETHEREUM_SWAP_PATH))
              return "ethereum-swap";
            return "nep"; // Default tab
          })()}
          items={[
            {
              label: (
                <>
                  <Avatar size="small" src={NEP_LOGO} /> NEPs
                </>
              ),
              key: "nep",
            },
            {
              label: (
                <>
                  <Avatar size="small" src={NEO_LOGO} /> FTW Swap (Neo)
                </>
              ),
              key: "neo-swap",
            },
            {
              label: (
                <>
                  <Avatar size="small" src={NEO_LOGO} /> FTW Swap (NeoX)
                </>
              ),
              key: "neox-swap",
            },
            {
              label: (
                <>
                  <Avatar size="small" src={ETHEREUM_LOGO} /> FTW Swap
                  (Ethereum)
                </>
              ),
              key: "ethereum-swap",
            },
            {
              label: (
                <>
                  <Avatar size="small" src={POLYGON_LOGO} /> FTW Swap (Polygon)
                </>
              ),
              key: "polygon-swap",
            },
          ]}
        />

        <Route
          exact={true}
          path={`${ANALYTICS_PATH}`}
          component={NEPAnalytics}
        />
        <Route path={`${ANALYTICS_NEO_SWAP_PATH}`} component={NEOAnalytics} />
        <Route
          path={`${ANALYTICS_NEOX_SWAP_PATH}`}
          component={NeoXAnalytics}
        />
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
