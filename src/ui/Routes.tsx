import React from 'react'
import { Route } from "react-router-dom";
import { NEO_ROUTES } from "../consts";

import MyCollection from "./pages/MyCollection";
import Gallery from "./pages/Rune";
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

const Routes = () => {
  return (
    <>
      <Route exact path={NEO_ROUTES.HOME_PATH} component={Home} />
      <Route path={NEO_ROUTES.GALLERY_PATH} component={Gallery} />
      <Route path={NEO_ROUTES.BOYZ_PATH} component={Boyz} />
      <Route path={NEO_ROUTES.TOURNAMENT_PATH} component={Tournament} />
      <Route path={NEO_ROUTES.SMITH_PATH} component={Smith} />
      <Route path={NEO_ROUTES.LOCKER_PATH} component={Locker} />
      <Route path={NEO_ROUTES.COLLECTION_PATH} component={MyCollection} />
      <Route path={NEO_ROUTES.SWAP_PATH} component={Swap} />
      <Route path={NEO_ROUTES.FARM_PATH} component={Farm} />
      <Route path={NEO_ROUTES.FARM_V2_PATH} component={FarmV2} />
      <Route path={NEO_ROUTES.DAO_PATH} component={DAO} />
      <Route path={NEO_ROUTES.MIGRATION_PATH} component={Migration} />
      <Route path={NEO_ROUTES.ANALYTICS_PATH} component={Analytics} />
      <Route path={NEO_ROUTES.LP_TOKENS_PATH} component={LPTokens} />
      <Route path={NEO_ROUTES.GASFI_PATH} component={GASFi} />
      <Route path={NEO_ROUTES.BRAND_KIT_PATH} component={BrandKit} />
      <Route path={NEO_ROUTES.BRIDGE_PATH} component={Bridge} />
    </>
  );
}

export default Routes