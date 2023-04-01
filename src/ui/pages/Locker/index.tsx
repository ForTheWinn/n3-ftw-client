import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import LockerMain from "./Main";
import Create from "./Create";
import PageLayout from "../../components/Commons/PageLayout";
import LockersByContract from "./LockersByContract";
import LockerKeys from "./LockerKeys";
import LockerSearch from "./Search";
import { NEO_ROUTES } from "../../../consts";

const Locker = () => {
  useEffect(() => {
    document.title = "FTW Locker";
  }, []);

  return (
    <PageLayout>
      <Route
        exact={true}
        path={NEO_ROUTES.LOCKER_PATH}
        component={LockerMain}
      />
      <Route
        path={`${NEO_ROUTES.LOCKER_CONTRACT_PATH}/:contractHash`}
        component={LockersByContract}
      />
      <Route path={NEO_ROUTES.LOCKER_USER_PATH} component={LockerKeys} />
      <Route
        path={`${NEO_ROUTES.LOCKER_SEARCH_PATH}`}
        component={LockerSearch}
      />
      <Route path={NEO_ROUTES.LOCKER_CREATE_PATH} component={Create} />
    </PageLayout>
  );
};

export default Locker;
