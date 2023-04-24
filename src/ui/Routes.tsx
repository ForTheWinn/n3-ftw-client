import React, { useMemo } from "react";
import { Route } from "react-router-dom";

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
import {
  ANALYTICS_PATH,
  BOYZ_PATH,
  BRAND_KIT_PATH,
  FARM_PATH,
  FARM_V2_PATH,
  GALLERY_PATH,
  HOME_PATH,
  LOCKER_PATH,
  LP_TOKENS_PATH,
  MIGRATION_PATH,
  NFT_PATH,
  SMITH_PATH,
  SWAP_PATH,
  TOOLS_PATH,
  TOURNAMENT_PATH
} from "../consts/neoRoutes";
import Tools from "./pages/Tools";
import NFTCollections from "./pages/NFTCollections";

const pageRoutes = [
  {
    exact: true,
    path: HOME_PATH,
    component: Home,
    chain: {
      [NEO_CHAIN]: [TESTNET, MAINNET],
      [POLYGON_CHAIN]: [MAINNET, TESTNET]
    }
  },
  {
    path: SWAP_PATH,
    component: Swap,
    chain: {
      [NEO_CHAIN]: [TESTNET, MAINNET],
      [POLYGON_CHAIN]: [TESTNET, MAINNET]
    }
  },
  {
    path: FARM_PATH,
    component: Farm,
    chain: {
      [NEO_CHAIN]: [MAINNET]
    }
  },
  {
    path: LOCKER_PATH,
    component: Locker,
    chain: {
      [NEO_CHAIN]: [TESTNET, MAINNET]
    }
  },
  {
    path: FARM_V2_PATH,
    component: FarmV2,
    chain: {
      [NEO_CHAIN]: [TESTNET, MAINNET],
      [POLYGON_CHAIN]: [TESTNET]
    }
  },
  {
    path: SMITH_PATH,
    component: Smith,
    chain: {
      [NEO_CHAIN]: [TESTNET, MAINNET]
    }
  },
  {
    path: TOOLS_PATH,
    component: Tools,
    chain: {
      [NEO_CHAIN]: [TESTNET, MAINNET],
      [POLYGON_CHAIN]: [TESTNET, MAINNET]
    }
  },
  {
    path: NFT_PATH,
    component: NFTCollections,
    chain: {
      [NEO_CHAIN]: [TESTNET, MAINNET],
    }
  },
  {
    path: ANALYTICS_PATH,
    component: Analytics,
    chain: {
      [NEO_CHAIN]: [MAINNET]
    }
  },
  {
    path: MIGRATION_PATH,
    component: Migration,
    chain: {
      [NEO_CHAIN]: [MAINNET]
    }
  },
  {
    path: TOURNAMENT_PATH,
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
        <Route path={BRAND_KIT_PATH} component={BrandKit} />
        {/* <Route path={NEO_ROUTES.GASFI_PATH} component={GASFi} /> */}
        {/* <Route path={NEO_ROUTES.BRIDGE_PATH} component={Bridge} /> */}
      </>
    );
  }, [chain, network]);

  return memoizedRoutes;
};

export default Routes;
