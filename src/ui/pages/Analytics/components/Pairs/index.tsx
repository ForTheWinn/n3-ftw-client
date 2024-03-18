import React, { useState } from "react";
import { List, Modal } from "antd";
import { CHAINS } from "../../../../../consts/chains";
import TokenItem from "./TokenItem";
import Swaps from "./TokenDetailPage/Swaps";
import TokenDetailPage from "./TokenDetailPage";
import {
  ETH_CHAIN,
  NEOX_CHAIN,
  NEO_CHAIN,
  POLYGON_CHAIN,
} from "../../../../../consts/global";
import {
  ANALYTICS_ETHEREUM_SWAP_PATH,
  ANALYTICS_NEOX_SWAP_PATH,
  ANALYTICS_NEO_SWAP_PATH,
  ANALYTICS_POLYGON_SWAP_PATH,
} from "../../../../../consts/routes";

interface IPairsAnalyticsProps {
  chain: CHAINS;
  data: any;
  isLoaded: boolean;
  error?: string;
}

const Pairs = ({ chain, data, isLoaded, error }: IPairsAnalyticsProps) => {
  const [tokenDetailObj, setTokenDetailObj] = useState<string[]>([]);
  const ANALYTICS_PATH = {
    [POLYGON_CHAIN]: ANALYTICS_POLYGON_SWAP_PATH,
    [NEO_CHAIN]: ANALYTICS_NEO_SWAP_PATH,
    [ETH_CHAIN]: ANALYTICS_ETHEREUM_SWAP_PATH,
    [NEOX_CHAIN]: ANALYTICS_NEOX_SWAP_PATH,
  };
  const path = ANALYTICS_PATH[chain];
  const handleTokenClick = (tokens: string[]) => {
    setTokenDetailObj(tokens);
    if (tokens.length > 0) {
      window.history.replaceState(null, "", `#${path}/token/${tokens[0]}`);
    }
  };

  const handleModalClose = () => {
    window.history.replaceState(null, "", `#${path}`);
    setTokenDetailObj([]);
  };

  return (
    <>
      <List
        loading={!isLoaded}
        pagination={false}
        dataSource={data ? data : []}
        renderItem={(item: any, i) => (
          <List.Item>
            <TokenItem
              chain={chain}
              key={"token" + i}
              data={item}
              onClick={handleTokenClick}
            />
          </List.Item>
        )}
      />
      {tokenDetailObj.length > 0 && (
        <Modal
          closable={false}
          onCancel={handleModalClose}
          open={true}
          footer={null}
          width={1000}
        >
          <TokenDetailPage
            chain={chain}
            tokens={tokenDetailObj}
          />
        </Modal>
      )}
    </>
  );
};

export default Pairs;
