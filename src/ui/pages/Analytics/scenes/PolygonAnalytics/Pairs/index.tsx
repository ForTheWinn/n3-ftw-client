import React, { useState } from "react";
import PairItem from "./PairItem";
import { useOnChainData } from "../../../../../../common/hooks/use-onchain-data";
import {
  ANALYTICS_POLYGON_SWAP_PAIRS_PATH,
  ANALYTICS_POLYGON_SWAP_PATH,
} from "../../../../../../consts/routes";
import { RestAPI } from "../../../../../../packages/neo/api";
import { MAINNET } from "../../../../../../consts/global";
import { CHAINS } from "../../../../../../consts/chains";
import { Col, Row, Table } from "antd";
import TokenItem from "./TokenItem";

interface IPairsAnalyticsProps {
  chain: CHAINS;
}
const Pairs = ({ chain }: IPairsAnalyticsProps) => {
  const [isModalActive, setModalActive] = useState("");
  const handleTokenClick = (id: string) => {
    setModalActive(id);
    window.history.replaceState(
      null,
      "",
      `#${ANALYTICS_POLYGON_SWAP_PAIRS_PATH}/${id}`
    );
  };

  const handleModalClose = (id: string) => {
    window.history.replaceState(
      null,
      "",
      `#${ANALYTICS_POLYGON_SWAP_PATH}/${id}`
    );
    setModalActive("");
  };

  const { data, isLoaded, error } = useOnChainData(() => {
    return new RestAPI(MAINNET).getEVMSwapPairs({ chain });
  }, []);


  return (
    <Row gutter={[10,10]}>
      <Col span={12}>
        <Table
          loading={!isLoaded}
          pagination={false}
          dataSource={data && data.pairs ? data.pairs : []}
          columns={[
            {
              title: "Liquidity",
              key: "liquidity",
              render: (data, i) => {
                return <PairItem chain={chain} key={"pair" + i} data={data} />;
              },
            },
          ]}
        />
      </Col>
      <Col span={12}>
        {" "}
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
                  <TokenItem chain={chain} key={"token" + i} data={data} />
                );
              },
            },
          ]}
        />
      </Col>
    </Row>
  );
};

export default Pairs;
