import React, { useMemo } from "react";
import { Route } from "react-router-dom";
import { NEO_ROUTES } from "../consts";

import Runes from "./pages/Rune";
import Home from "./pages/Home";
import Smith from "./pages/Smith";
import Tournament from "./pages/Tournament";
import Swap from "./pages/Swap";
import Migration from "./pages/Migration";
import Farm from "./pages/Farm";
import Analytics from "./pages/Analytics";
import FarmV2 from "./pages/FarmV2";
import LPTokens from "./pages/LPTokens";
import Locker from "./pages/Locker";
import Boyz from "./pages/Boyz";
// import GASFi from "./pages/GASFi";
// import Bridge from "./pages/Bridge";
import BrandKit from "./pages/BrandKit";
import { useApp } from "../common/hooks/use-app";
import { NEO_CHAIN, POLYGON_CHAIN } from "../consts/chains";
import { MAINNET, TESTNET } from "../consts/global";
import NoChainSupport from "./pages/ChainRouting/NoChainSupport";
import NoNetworkSupport from "./pages/ChainRouting/NoNetworkSupport";

const pageRoutes = [
  {
    exact: true,
    path: NEO_ROUTES.HOME_PATH,
    component: Home,
    chain: {
      [NEO_CHAIN]: [TESTNET, MAINNET],
      [POLYGON_CHAIN]: [MAINNET, TESTNET]
    }
  },
  {
    path: NEO_ROUTES.SWAP_PATH,
    component: Swap,
    chain: {
      [NEO_CHAIN]: [TESTNET, MAINNET],
      [POLYGON_CHAIN]: [TESTNET]
    }
  },
  {
    path: NEO_ROUTES.FARM_PATH,
    component: Farm,
    chain: {
      [NEO_CHAIN]: [MAINNET]
    }
  },
  {
    path: NEO_ROUTES.LOCKER_PATH,
    component: Locker,
    chain: {
      [NEO_CHAIN]: [TESTNET, MAINNET]
    }
  },
  {
    path: NEO_ROUTES.FARM_V2_PATH,
    component: FarmV2,
    chain: {
      [NEO_CHAIN]: [TESTNET, MAINNET],
      [POLYGON_CHAIN]: [TESTNET]
    }
  },
  {
    path: NEO_ROUTES.SMITH_PATH,
    component: Smith,
    chain: {
      [NEO_CHAIN]: [TESTNET, MAINNET]
    }
  },
  {
    path: NEO_ROUTES.ANALYTICS_PATH,
    component: Analytics,
    chain: {
      [NEO_CHAIN]: [MAINNET]
    }
  },
  {
    path: NEO_ROUTES.GALLERY_PATH,
    component: Runes,
    chain: {
      [NEO_CHAIN]: [MAINNET]
    }
  },
  {
    path: NEO_ROUTES.BOYZ_PATH,
    component: Boyz,
    chain: {
      [NEO_CHAIN]: [MAINNET]
    }
  },
  {
    path: NEO_ROUTES.LP_TOKENS_PATH,
    component: LPTokens,
    chain: {
      [NEO_CHAIN]: [TESTNET, MAINNET],
      [POLYGON_CHAIN]: [TESTNET]
    }
  },
  {
    path: NEO_ROUTES.MIGRATION_PATH,
    component: Migration,
    chain: {
      [NEO_CHAIN]: [MAINNET]
    }
  },
  {
    path: NEO_ROUTES.TOURNAMENT_PATH,
    component: Tournament,
    chain: {
      [NEO_CHAIN]: [MAINNET]
    }
  }
];

const Routes = () => {
  const { chain, network } = useApp();
  const memoizedRoutes = useMemo(() => {
    return (
      <>
        {pageRoutes.map((route) => {
          const _chain: any = route.chain[chain];
          console.log(chain);
          return (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              component={() => {
                if (!_chain) return <NoChainSupport chain={chain} />;
                if (!_chain.includes(network))
                  return <NoNetworkSupport chain={chain} network={network} />;
                return <route.component />;
              }}
            />
          );
        })}
        <Route path={NEO_ROUTES.BRAND_KIT_PATH} component={BrandKit} />
        {/* <Route path={NEO_ROUTES.GASFI_PATH} component={GASFi} /> */}
        {/* <Route path={NEO_ROUTES.BRIDGE_PATH} component={Bridge} /> */}
      </>
    );
  }, [chain, network]);

  return memoizedRoutes;
};

export default Routes;
