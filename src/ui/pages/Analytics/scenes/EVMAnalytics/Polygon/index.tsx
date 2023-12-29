import React from "react";
import { POLYGON_CHAIN } from "../../../../../../consts/global";
import Pairs from "../components/Pairs";

const PolygonAnalytics = (props) => {
  return (
    <>
      <Pairs chain={POLYGON_CHAIN} />
    </>
  );
};

export default PolygonAnalytics;
