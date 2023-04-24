import React from "react";
import { Route } from "react-router-dom";
import Airdrop from "./scenes/Airdrop";
import {
  TOOLS_AIRDROP_PATH,
  TOOLS_LP_TOKENS_PATH,
  TOOLS_PATH
} from "../../../consts/neoRoutes";
import ToolsMain from "./scenes/Main";
import LPTokens from "../LPTokens";

const Tools = () => {
  return (
    <>
      <Route exact path={TOOLS_PATH} component={ToolsMain} />
      <Route path={TOOLS_AIRDROP_PATH} component={Airdrop} />
      <Route path={TOOLS_LP_TOKENS_PATH} component={LPTokens} />
    </>
  );
};

export default Tools;
