import React from "react";
import PageLayout from "../../components/Commons/PageLayout";
import { Route } from "react-router-dom";
import {
  GASFI_MY_STAKING_PATH,
  GASFI_PATH,
  GASFI_STAKE_PATH,
} from "../../../consts";
import Main from "./scenes/Main";
import Stake from "./scenes/Stake";
import MyStaking from "./scenes/MyStaking";

const GASFi = (props) => {
  return (
    <PageLayout>
      <Route exact={true} path={GASFI_PATH} component={Main} />
      <Route path={GASFI_STAKE_PATH} component={Stake} />
      <Route path={GASFI_MY_STAKING_PATH} component={MyStaking} />
    </PageLayout>
  );
};

export default GASFi;
