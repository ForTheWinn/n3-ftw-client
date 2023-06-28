import React from "react";
import { NFT_ROUTE } from "../../../consts/routes";
import { Route } from "react-router-dom";

const NFTCollections = () => {
  return (
    <>
      {NFT_ROUTE.category.map((route: any) => {
        return (
          <Route
            key={route.path}
            exact={route.exact}
            path={route.path}
            component={route.component}
          />
        );
      })}
    </>
  );
};
export default NFTCollections;
