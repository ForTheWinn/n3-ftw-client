import React, { useEffect } from "react";
import {
  SMITH_CONTRACT_NEP11_PATH,
  SMITH_CONTRACT_NEP17_PATH,
  SMITH_CREATE_NEP11_PATH,
  SMITH_CREATE_NEP17_PATH,
  SMITH_PATH,
  SMITH_PATH_NEP11,
} from "../../../consts";
import { Route } from "react-router-dom";
import NEP17Smith from "./scenes/NEP17";
import NEP11Smith from "./scenes/NEP11";
import NEP17InfoPage from "./scenes/PageView/NEP17InfoPage";
import NEP11InfoPage from "./scenes/PageView/NEP11InfoPage";
import CreateNEP17 from "./scenes/CreateNEP17";
import CreateNEP11 from "./scenes/CreateNEP11";
import Maintenance from "./Maintenance";

const Smith = () => {
  useEffect(() => {
    document.title =
      "Forthewin Smith: Create your NEP11 and NEP17 smart contracts without any codes.";
  }, []);

  // return <Maintenance />;
  return (
    <>
      <Route exact path={SMITH_PATH} component={() => <NEP17Smith />} />
      <Route exact path={SMITH_PATH_NEP11} component={() => <NEP11Smith />} />
      <Route
        exact
        path={SMITH_CREATE_NEP17_PATH}
        component={() => <CreateNEP17 />}
      />
      <Route
        exact
        path={SMITH_CREATE_NEP11_PATH}
        component={() => <CreateNEP11 />}
      />
      <Route
        exact
        path={`${SMITH_CONTRACT_NEP17_PATH}/:contractHash`}
        component={() => <NEP17InfoPage />}
      />
      <Route
        exact
        path={`${SMITH_CONTRACT_NEP11_PATH}/:contractHash`}
        component={() => <NEP11InfoPage />}
      />
    </>
  );
};

export default Smith;
