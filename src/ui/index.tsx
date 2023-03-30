import React from "react";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";
import { HashRouter as Router, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import {
  COLLECTION_PATH,
  GALLERY_PATH,
  HOME_PATH,
  MIGRATION_PATH,
  SMITH_PATH,
  SWAP_PATH,
  TOURNAMENT_PATH,
  FARM_PATH,
  DAO_PATH,
  IDO_PATH,
  ANALYTICS_PATH,
  FARM_V2_PATH,
  LP_TOKENS_PATH,
  LOCKER_PATH,
  BOYZ_PATH,
  GASFI_PATH,
  BRIDGE_PATH,
  BRAND_KIT_PATH
} from "../consts";
import { POLYGON_FARM_PATH, POLYGON_SWAP_PATH } from "../consts/polygonRoutes";

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
import IDO from "./pages/IDO";
import Analytics from "./pages/Analytics";
import FarmV2 from "./pages/FarmV2";
import LPTokens from "./pages/LPTokens";
import Locker from "./pages/Locker";
import Boyz from "./pages/Boyz";
import GASFi from "./pages/GASFi";
import Bridge from "./pages/Bridge";
import BrandKit from "./pages/BrandKit";
import { TESTNET } from "../packages/neo/consts";
import TxHandler from "./components/Commons/TxHandler";

const { chains, provider, webSocketProvider } = configureChains(
  [process.env.REACT_APP_NETWORK === TESTNET ? polygonMumbai : polygonMumbai],
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
          <Route exact path={HOME_PATH} component={Home} />
          <Route path={GALLERY_PATH} component={Gallery} />
          <Route path={BOYZ_PATH} component={Boyz} />
          <Route path={TOURNAMENT_PATH} component={Tournament} />
          <Route path={SMITH_PATH} component={Smith} />
          <Route path={LOCKER_PATH} component={Locker} />
          <Route path={COLLECTION_PATH} component={MyCollection} />
          <Route path={SWAP_PATH} component={Swap} />
          <Route
            path={POLYGON_SWAP_PATH}
            component={() => <Swap path={POLYGON_SWAP_PATH} />}
          />
          <Route path={FARM_PATH} component={Farm} />
          <Route path={FARM_V2_PATH} component={FarmV2} />
          <Route
            path={POLYGON_FARM_PATH}
            component={() => <FarmV2 path={POLYGON_FARM_PATH} />}
          />
          <Route path={DAO_PATH} component={DAO} />
          <Route path={IDO_PATH} component={IDO} />
          <Route exact path={MIGRATION_PATH} component={Migration} />
          <Route path={ANALYTICS_PATH} component={Analytics} />
          <Route path={LP_TOKENS_PATH} component={LPTokens} />
          <Route path={GASFI_PATH} component={GASFi} />
          <Route path={BRAND_KIT_PATH} component={BrandKit} />
          <Route path={BRIDGE_PATH} component={Bridge} />

          <MobileMenuSlider />
          <WalletSidebar />
          <TxHandler />
        </Router>
      </WalletContextProvider>
    </WagmiConfig>
  );
};

export default App;
