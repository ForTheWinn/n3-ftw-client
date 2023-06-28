import React from "react";
import { Route } from "react-router-dom";
import { TOOLS_PAGE_ROUTE } from "../../../consts/routes";

const Tools = () => {
  return (
    <>
      <>
        {TOOLS_PAGE_ROUTE.category.map((route: any) => {
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
    </>
  );
};

export default Tools;
