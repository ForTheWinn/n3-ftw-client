import React from "react";
import PageLayout from "../../components/Commons/PageLayout";
import { Route } from "react-router-dom";
import Main from "./scenes/Main";
import Stake from "./scenes/Stake";
import MyStaking from "./scenes/MyStaking";
import { NEO_ROUTES } from "../../../consts";

const GASFi = () => {
  return (
    <PageLayout>
      <Route exact={true} path={NEO_ROUTES.GASFI_PATH} component={Main} />
      <Route path={NEO_ROUTES.GASFI_STAKE_PATH} component={Stake} />
      <Route path={NEO_ROUTES.GASFI_MY_STAKING_PATH} component={MyStaking} />
    </PageLayout>
  );
};

export default GASFi;
