import React, { useEffect } from "react";
import { useApp } from "../../../../../common/hooks/use-app";
import { MAINNET, NEO_CHAIN } from "../../../../../consts/global";
import Pairs from "../../components/Pairs";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { RestAPI } from "../../../../../packages/neo/api";

const AnalyticsMain = () => {
  const { network } = useApp();

  useEffect(() => {
    document.title = "FTW Analytics";
  }, []);

  const payload = useOnChainData(() => {
    return new RestAPI(MAINNET).getNEOPairs();
  }, []);

  return (
    <>
      <Pairs chain={NEO_CHAIN} {...payload} />
    </>
  );
};

export default AnalyticsMain;
