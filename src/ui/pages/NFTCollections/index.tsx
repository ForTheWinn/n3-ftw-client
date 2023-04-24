import React from "react";
import {
  BOYZ_PATH,
  GALLERY_PATH,
  LP_TOKENS_PATH,
  NFT_PATH
} from "../../../consts/neoRoutes";
import { Route } from "react-router-dom";
import Boyz from "../Boyz";
import LPTokens from "../LPTokens";
import Runes from "../Rune";
import Main from "./Main";

const NFTCollections = () => {
  return (
    <div>
      <Route exact path={NFT_PATH} component={Main} />
      <Route path={GALLERY_PATH} component={Runes} />
      <Route path={BOYZ_PATH} component={Boyz} />
      <Route path={LP_TOKENS_PATH} component={LPTokens} />
    </div>
  );
};
export default NFTCollections;
