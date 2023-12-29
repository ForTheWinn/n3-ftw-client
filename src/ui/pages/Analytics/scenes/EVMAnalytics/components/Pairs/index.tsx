import React, { useState } from "react";
import PairItem from "./PairItem";
import { useOnChainData } from "../../../../../../../common/hooks/use-onchain-data";

import { RestAPI } from "../../../../../../../packages/neo/api";
import { ETH_CHAIN, MAINNET } from "../../../../../../../consts/global";
import { CHAINS } from "../../../../../../../consts/chains";
import { Col, Modal, Row, Table } from "antd";
import TokenItem from "./TokenItem";
import {
  ANALYTICS_ETHEREUM_SWAP_PATH,
  ANALYTICS_POLYGON_SWAP_PATH,
} from "../../../../../../../consts/routes";
import Swaps from "./Swaps";

interface IPairsAnalyticsProps {
  chain: CHAINS;
}
const Pairs = ({ chain }: IPairsAnalyticsProps) => {
  const [tokenDetailObj, setTokenDetailObj] = useState<string[]>([]);
  const path =
    chain === ETH_CHAIN
      ? ANALYTICS_ETHEREUM_SWAP_PATH
      : ANALYTICS_POLYGON_SWAP_PATH;
  const handleTokenClick = (tokens: string[]) => {
    setTokenDetailObj(tokens);
    window.history.replaceState(null, "", `#${path}/${tokens.join(",")}`);
  };

  const handleModalClose = () => {
    window.history.replaceState(null, "", `#${path}/`);
    setTokenDetailObj([]);
  };

  const { data, isLoaded, error } = useOnChainData(() => {
    return new RestAPI(MAINNET).getEVMSwapPairs({ chain });
  }, []);

  return (
    <>
      {" "}
      <Row gutter={[10, 10]}>
        <Col xs={24} sm={12}>
          <Table
            loading={!isLoaded}
            pagination={false}
            dataSource={data && data.pairs ? data.pairs : []}
            columns={[
              {
                title: "Pairs",
                key: "pairs",
                render: (data, i) => {
                  return (
                    <PairItem
                      chain={chain}
                      key={"pair" + i}
                      data={data}
                      onClick={handleTokenClick}
                    />
                  );
                },
              },
            ]}
          />
        </Col>
        <Col xs={24} sm={12}>
          <Table
            loading={!isLoaded}
            pagination={false}
            dataSource={data && data.tokens ? data.tokens : []}
            columns={[
              {
                title: "Tokens",
                key: "Tokens",
                render: (data, i) => {
                  return (
                    <TokenItem
                      chain={chain}
                      key={"token" + i}
                      data={data}
                      onClick={handleTokenClick}
                    />
                  );
                },
              },
            ]}
          />
        </Col>
      </Row>
      {tokenDetailObj.length > 0 && (
        <Modal
          closable={false}
          onCancel={handleModalClose}
          open={true}
          footer={null}
          width={1000}
        >
          <Swaps chain={chain} tokens={tokenDetailObj} />
        </Modal>
      )}
    </>
  );
};

export default Pairs;
