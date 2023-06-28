import React, { useEffect, useMemo } from "react";
import { Route } from "react-router-dom";
import TokenMain from "./scenes/TokenMain";
import NFTMain from "./scenes/NFTMain";
import NEP17InfoPage from "./scenes/PageView/NEP17InfoPage";
import NEP11InfoPage from "./scenes/PageView/NEP11InfoPage";
import CreateNeoToken from "./scenes/CreateToken/Neo";
import CreateEVMToken from "./scenes/CreateToken/EVM";
import CreateNEP11 from "./scenes/CreateNFT";
import {
  SMITH_CONTRACT_NEP11_PATH,
  SMITH_CONTRACT_NEP17_PATH,
  SMITH_CREATE_NEP11_PATH,
  SMITH_CREATE_NEP17_PATH,
  SMITH_PATH,
  SMITH_PATH_NEP11
} from "../../../../../consts/routes";
import { useApp } from "../../../../../common/hooks/use-app";
import { NEO_CHAIN } from "../../../../../consts/global";

const Smith = () => {
  const { chain } = useApp();

  const memoizedRoutes = useMemo(() => {
    return (
      <>
        <Route exact path={SMITH_PATH} component={() => <TokenMain />} />
        <Route exact path={SMITH_PATH_NEP11} component={() => <NFTMain />} />
        <Route
          exact
          path={SMITH_CREATE_NEP17_PATH}
          component={() =>
            chain === NEO_CHAIN ? <CreateNeoToken /> : <CreateEVMToken />
          }
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
  }, [chain]);

  return memoizedRoutes;
};

export default Smith;
