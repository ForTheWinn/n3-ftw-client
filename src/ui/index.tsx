import React from "react";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";
import { HashRouter as Router, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { WalletContextProvider } from "../packages/neo/provider";

import Header from "./components/Commons/Header/Header";
import WalletSidebar from "./components/Commons/SideNavs/WalletSidebar";
import MyCollection from "./pages/MyCollection";
import Gallery from "./pages/Rune";
import MobileMenuSlider from "./components/Commons/SideNavs/MobileMenuSlider";
import Home from "./pages/Home";
import Smith from "./pages/Smith";
import Tournament from "./pages/Tournament";
import Swap from "./pages/Swap";
import Migration from "./pages/Migration";
import Farm from "./pages/Farm";
import DAO from "./pages/DAO";
import Analytics from "./pages/Analytics";
import FarmV2 from "./pages/FarmV2";
import LPTokens from "./pages/LPTokens";
import Locker from "./pages/Locker";
import Boyz from "./pages/Boyz";
import GASFi from "./pages/GASFi";
import Bridge from "./pages/Bridge";
import BrandKit from "./pages/BrandKit";
import TxHandler from "./components/Commons/TxHandler";
import { NEO_ROUTES, POLYGON_ROUTES, GLOBAL } from "../consts";

const { chains, provider, webSocketProvider } = configureChains(
  [
    process.env.REACT_APP_NETWORK === GLOBAL.TESTNET
      ? polygonMumbai
      : polygonMumbai
  ],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
  webSocketProvider
});

const App = () => {
  return (
    <WagmiConfig client={client}>
      <WalletContextProvider
        options={{
          useDevWallet: process.env.NODE_ENV === "development"
        }}
      >
        <Router>
          <Toaster position="bottom-center" />
          <Header />
          <Route exact path={NEO_ROUTES.HOME_PATH} component={Home} />
          <Route path={NEO_ROUTES.GALLERY_PATH} component={Gallery} />
          <Route path={NEO_ROUTES.BOYZ_PATH} component={Boyz} />
          <Route path={NEO_ROUTES.TOURNAMENT_PATH} component={Tournament} />
          <Route path={NEO_ROUTES.SMITH_PATH} component={Smith} />
          <Route path={NEO_ROUTES.LOCKER_PATH} component={Locker} />
          <Route path={NEO_ROUTES.COLLECTION_PATH} component={MyCollection} />
          <Route path={NEO_ROUTES.SWAP_PATH} component={Swap} />
          <Route
            path={POLYGON_ROUTES.SWAP_PATH}
            component={() => <Swap path={POLYGON_ROUTES.SWAP_PATH} />}
          />
          <Route path={NEO_ROUTES.FARM_PATH} component={Farm} />
          <Route path={NEO_ROUTES.FARM_V2_PATH} component={FarmV2} />
          <Route
            path={POLYGON_ROUTES.FARM_PATH}
            component={() => <FarmV2 path={POLYGON_ROUTES.FARM_PATH} />}
          />
          <Route path={NEO_ROUTES.DAO_PATH} component={DAO} />
          <Route exact path={NEO_ROUTES.MIGRATION_PATH} component={Migration} />
          <Route path={NEO_ROUTES.ANALYTICS_PATH} component={Analytics} />
          <Route path={NEO_ROUTES.LP_TOKENS_PATH} component={LPTokens} />
          <Route path={NEO_ROUTES.GASFI_PATH} component={GASFi} />
          <Route path={NEO_ROUTES.BRAND_KIT_PATH} component={BrandKit} />
          <Route path={NEO_ROUTES.BRIDGE_PATH} component={Bridge} />

          <MobileMenuSlider />
          <WalletSidebar />
          <TxHandler />
        </Router>
      </WalletContextProvider>
    </WagmiConfig>
  );
};

export default App;
