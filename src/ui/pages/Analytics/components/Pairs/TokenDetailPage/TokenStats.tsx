import React from "react";
import { MAINNET } from "../../../../../../consts/global";
import { Col, Row, Statistic } from "antd";
import { RestAPI } from "../../../../../../packages/neo/api";
import { useOnChainData } from "../../../../../../common/hooks/use-onchain-data";

interface ITokenDetailPageProps {
  ca: string;
}
const TokenStats = ({ ca }: ITokenDetailPageProps) => {
  const { data, isLoaded } = useOnChainData(() => {
    return new RestAPI(MAINNET).getToken(ca);
  }, []);

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Statistic
          className="has-text-centered"
          title="Price"
          value={data?.price}
          loading={!isLoaded}
          prefix="$"
        />
      </Col>
      <Col span={8}>
        <Statistic
          className="has-text-centered"
          title="Market Cap"
          value={data?.mc}
          loading={!isLoaded}
          prefix="$"
        />
      </Col>
      <Col span={8}>
        <Statistic
          className="has-text-centered"
          title="Liquidity"
          value={data?.liquidity}
          loading={!isLoaded}
          prefix="$"
        />
      </Col>
    </Row>
  );
};

export default TokenStats;
