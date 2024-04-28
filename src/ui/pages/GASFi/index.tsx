import React from "react";
import PageLayout from "../../components/Commons/PageLayout";
import { Route } from "react-router-dom";
import Main from "./scenes/Main";
import Stake from "./scenes/Main/Stake";
import {
  GASFI_PATH,
  GASFI_STAKE_PATH,
} from "../../../consts/routes";

const GASFi = () => {
  return (
    <PageLayout>
      <Route exact={true} path={GASFI_PATH} component={Main} />
      <Route path={GASFI_STAKE_PATH} component={Stake} />
    </PageLayout>
  );
};

export default GASFi;
