import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import NEP17Smith from "./scenes/NEP17";
import NEP11Smith from "./scenes/NEP11";
import NEP17InfoPage from "./scenes/PageView/NEP17InfoPage";
import NEP11InfoPage from "./scenes/PageView/NEP11InfoPage";
import CreateNEP17 from "./scenes/CreateNEP17";
import CreateNEP11 from "./scenes/CreateNEP11";
import { NEO_ROUTES } from "../../../consts";
// import Maintenance from "./Maintenance";

const Smith = () => {
  useEffect(() => {
    document.title = "FTW | Smith";
  }, []);

  // return <Maintenance />;
  return (
    <>
      <Route
        exact
        path={NEO_ROUTES.SMITH_PATH}
        component={() => <NEP17Smith />}
      />
      <Route
        exact
        path={NEO_ROUTES.SMITH_PATH_NEP11}
        component={() => <NEP11Smith />}
      />
      <Route
        exact
        path={NEO_ROUTES.SMITH_CREATE_NEP17_PATH}
        component={() => <CreateNEP17 />}
      />
      <Route
        exact
        path={NEO_ROUTES.SMITH_CREATE_NEP11_PATH}
        component={() => <CreateNEP11 />}
      />
      <Route
        exact
        path={`${NEO_ROUTES.SMITH_CONTRACT_NEP17_PATH}/:contractHash`}
        component={() => <NEP17InfoPage />}
      />
      <Route
        exact
        path={`${NEO_ROUTES.SMITH_CONTRACT_NEP11_PATH}/:contractHash`}
        component={() => <NEP11InfoPage />}
      />
    </>
  );
};

export default Smith;
