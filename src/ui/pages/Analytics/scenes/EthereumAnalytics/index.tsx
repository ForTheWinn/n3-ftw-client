import React from "react";
import Pairs from "./Pairs";
import { ETH_CHAIN } from "../../../../../consts/global";

const EthereumAnalytics = (props) => {
  return (
    <>
      <Pairs chain={ETH_CHAIN} />
    </>
  );
};

export default EthereumAnalytics;
