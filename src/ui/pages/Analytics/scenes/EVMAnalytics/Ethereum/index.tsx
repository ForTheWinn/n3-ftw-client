import React from "react";
import Pairs from "../../../components/Pairs";
import { ETH_CHAIN, MAINNET } from "../../../../../../consts/global";
import { useOnChainData } from "../../../../../../common/hooks/use-onchain-data";
import { RestAPI } from "../../../../../../packages/neo/api";

const EthereumAnalytics = () => {
  const payload = useOnChainData(() => {
    return new RestAPI(MAINNET).getEVMSwapPairs({ chain: ETH_CHAIN });
  }, []);

  return (
    <>
      <Pairs chain={ETH_CHAIN} {...payload} />
    </>
  );
};

export default EthereumAnalytics;
