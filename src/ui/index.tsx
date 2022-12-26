import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import Header from "./components/Header";
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
  LOTTO_PATH,
  ANALYTICS_PATH,
  FARM_V2_PATH,
  LP_TOKENS_PATH,
  LOCKER_PATH,
  BOYZ_PATH,
  GASFI_PATH,
  BRAND_KIT_PATH,
} from "../consts";
import { WalletContextProvider } from "../packages/provider";
import WalletSidebar from "./components/WalletSidebar";
import { Toaster } from "react-hot-toast";
import MyCollection from "./pages/MyCollection";
import Gallery from "./pages/Rune";
import MobileMenuSlider from "./components/MobileMenuSlider";
import Home from "./pages/Home";
import Smith from "./pages/Smith";
import Tournament from "./pages/Tournament";
import Swap from "./pages/Swap";
import Migration from "./pages/Migration";
import Farm from "./pages/Farm";
import DAO from "./pages/DAO";
import IDO from "./pages/IDO";
import Lotto from "./pages/Lotto";
import Analytics from "./pages/Analytics";
import FarmV2 from "./pages/FarmV2";
import LPTokens from "./pages/LPTokens";
import Locker from "./pages/Locker";
import Boyz from "./pages/Boyz";
import GASFi from "./pages/GASFi";
import BrandKit from "./pages/BrandKit";

const App = () => {
  return (
    <WalletContextProvider
      options={{
        useDevWallet: process.env.NODE_ENV === "development",
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
        <Route path={FARM_PATH} component={Farm} />
        <Route path={FARM_V2_PATH} component={FarmV2} />
        <Route path={DAO_PATH} component={DAO} />
        <Route path={IDO_PATH} component={IDO} />
        <Route exact path={MIGRATION_PATH} component={Migration} />
        <Route path={LOTTO_PATH} component={Lotto} />
        <Route path={ANALYTICS_PATH} component={Analytics} />
        <Route path={LP_TOKENS_PATH} component={LPTokens} />
        <Route path={GASFI_PATH} component={GASFi} />
        <Route path={BRAND_KIT_PATH} component={BrandKit} />
        <MobileMenuSlider />
        <WalletSidebar />
      </Router>
    </WalletContextProvider>
  );
};

export default App;
