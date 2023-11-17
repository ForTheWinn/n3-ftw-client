import React from "react";
import { Link, Route, useHistory, useLocation } from "react-router-dom";
import PairDetail from "./scenes/PairDetail";
import TokenDetail from "./scenes/TokenDetail";
import PageLayout from "../../components/Commons/PageLayout";
import {
  ANALYTICS_NEO_SWAP_PATH,
  ANALYTICS_PAIRS_PATH,
  ANALYTICS_PATH,
  ANALYTICS_POLYGON_SWAP_PATH,
  ANALYTICS_TOKENS_PATH,
} from "../../../consts/routes";
import { Avatar, Tabs } from "antd";
import { NEO_LOGO, NEP_LOGO } from "../../../consts/global";
import NEPAnalytics from "./scenes/NEPAnalytics";
import NEOAnalytics from "./scenes/NEOAnalytics";
import PolygonAnalytics from "./scenes/PolygonAnalytics";

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
      case "polygon-swap":
        history.push(ANALYTICS_POLYGON_SWAP_PATH);
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
            if (location.pathname.includes(ANALYTICS_POLYGON_SWAP_PATH))
              return "polygon-swap";
            // Handle other routes...
            return "nep"; // Default tab
          })()}
          items={[
            {
              label: (
                <>
                  <Avatar size="small" src={NEP_LOGO} /> NEP
                </>
              ),
              key: "nep",
            },
            {
              label: (
                <>
                  <Avatar size="small" src={NEO_LOGO} /> FTW Swap
                </>
              ),
              key: "neo-swap",
            },
            // {
            //   label: (
            //     <>
            //       <Avatar size="small" src={POLYGON_LOGO} /> FTW Swap
            //     </>
            //   ),
            //   key: "polygon-swap",
            // },
          ]}
        />

        <Route exact={true} path={`${ANALYTICS_PATH}`} component={NEPAnalytics} />
        <Route path={`${ANALYTICS_NEO_SWAP_PATH}`} component={NEOAnalytics} />
        <Route
          path={`${ANALYTICS_POLYGON_SWAP_PATH}`}
          render={PolygonAnalytics}
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
