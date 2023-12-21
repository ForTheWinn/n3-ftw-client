import React from "react";
import Pairs from "./Pairs";
import { POLYGON_CHAIN } from "../../../../../consts/global";

const PolygonAnalytics = (props) => {
  return (
    <>
      <Pairs chain={POLYGON_CHAIN} />
    </>
  );
};

export default PolygonAnalytics;
