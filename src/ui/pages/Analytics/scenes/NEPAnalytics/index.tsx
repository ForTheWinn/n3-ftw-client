import React, { useEffect } from "react";
import { Avatar, Card, Divider, Typography } from "antd";
import {
  ETHEREUM_LOGO,
  ETH_CHAIN,
  MAINNET,
  NEOX_CHAIN,
  NEO_CHAIN,
  NEO_LOGO,
  NEP_LOGO,
  POLYGON_CHAIN,
  POLYGON_LOGO,
} from "../../../../../consts/global";
import { useApp } from "../../../../../common/hooks/use-app";
import { fetchTokenInfo } from "../../../../../common/routers/global";
import { GLOBAL_NEP_CONTRACT_ADDRESS } from "../../../../../consts/contracts";
import {
  getChainIdByChain,
  getExplorer,
  transformString,
} from "../../../../../common/helpers";
import { RestAPI } from "../../../../../packages/neo/api";
import { NEO_NEP_CONTRACT_ADDRESS } from "../../../../../packages/neo/consts/tokens";
import AddTokenButton from "../../../../components/AddTokenOnMetaMaskButton";
import CandleChart from "../../components/Pairs/TokenDetailPage/CandleChart";
import { NEO_MAINNET_TOKENS } from "../../../../../packages/neo/consts/tokens";

const EMMISSIONS = [
  {
    chain: "Neo",
    daily: 27324,
  },
  {
    chain: "Ethereum",
    daily: 1080,
  },
  {
    chain: "Polygon",
    daily: 1080,
  },
  {
    chain: "NeoX",
    daily: 0,
  },
];
const EllipsisMiddle: React.FC<{ suffixCount: number; children: string }> = ({
  suffixCount,
  children,
}) => {
  const start = children.slice(0, children.length - suffixCount).trim();
  const suffix = children.slice(-suffixCount).trim();
  return (
    <Typography.Text style={{ maxWidth: "100%" }} ellipsis={{ suffix }}>
      {start}
    </Typography.Text>
  );
};

const NEPAnalytics = () => {
  const { network } = useApp();
  const [values, setValues] = React.useState<any>({
    neo: {
      totalSupply: "0",
    },
    polygon: {
      totalSupply: "0",
    },
    ethereum: {
      totalSupply: "0",
    },
    neoX: {
      totalSupply: "0",
    },
    nepPrice: 0,
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [neoNEP, polNEP, ethNEP, neoXNep, nepPrice] = await Promise.all([
          fetchTokenInfo(
            NEO_CHAIN,
            network,
            GLOBAL_NEP_CONTRACT_ADDRESS[NEO_CHAIN][network]
          ),
          fetchTokenInfo(
            POLYGON_CHAIN,
            network,
            GLOBAL_NEP_CONTRACT_ADDRESS[POLYGON_CHAIN][network]
          ),
          fetchTokenInfo(
            ETH_CHAIN,
            network,
            GLOBAL_NEP_CONTRACT_ADDRESS[ETH_CHAIN][network]
          ),
          fetchTokenInfo(
            NEOX_CHAIN,
            network,
            GLOBAL_NEP_CONTRACT_ADDRESS[NEOX_CHAIN][network]
          ),
          new RestAPI(MAINNET).getPrice(NEO_NEP_CONTRACT_ADDRESS[MAINNET]),
        ]);

        setValues({
          neo: neoNEP,
          polygon: polNEP,
          ethereum: ethNEP,
          neoX: neoXNep,
          nepPrice: nepPrice.price,
        });
      } catch (e: any) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const neoSupply =
    parseFloat(values.neo.totalSupply) - parseFloat(values.polygon.totalSupply);
  const polygonSupply = parseFloat(values.polygon.totalSupply);
  const ethereumSupply = parseFloat(values.ethereum.totalSupply);
  const neoXSupply = parseFloat(values.neoX.totalSupply);
  const neoMC = neoSupply * values.nepPrice;
  const polygonMC = polygonSupply * values.nepPrice;
  const ethereumMC = ethereumSupply * values.nepPrice;
  const neoXMC = neoXSupply * values.nepPrice;
  let totalEmmissions = 0;
  return (
    <div>
      <div className="columns is-multiline">
        <div className="column is-4">
          <Card style={{ minHeight: "240px", padding: 0 }} loading={loading}>
            <Card.Meta title={"About NEP"} />
            <br />
            <Typography.Paragraph
              ellipsis={{
                symbol: "more",
                rows: 6,
                expandable: true,
              }}
            >
              NEP primarily functions as a utility token within the Forthewin
              ecosystem, facilitating a range of critical operations such as
              token launches, vesting, and bridging. While it also serves as the
              governance token, enabling voting on the platform's development,
              its utility aspect stands out as a key feature. This versatility
              makes NEP essential for the efficient functioning and continuous
              growth of the Forthewin ecosystem, extending its significance
              beyond governance into various operational realms.
            </Typography.Paragraph>
          </Card>
        </div>
        <div className="column is-4">
          <Card style={{ height: "240px", padding: 0 }} loading={loading}>
            <Card.Meta title={"NEP Now"} />
            <br />
            <CandleChart
              chain={"NEO_CHAIN"}
              tokenHash={NEO_MAINNET_TOKENS.NEP.hash}
              height={160}
            />
          </Card>
        </div>
        <div className="column is-4">
          <Card style={{ height: "240px" }} loading={loading}>
            <Card.Meta
              avatar={<Avatar src={NEP_LOGO} />}
              title="NEP emmisions per day"
              description={
                <>
                  <Typography.Paragraph>
                    {EMMISSIONS.map((emission, i) => {
                      totalEmmissions += emission.daily;
                      return (
                        <div key={`em-${i}`}>
                          {emission.chain}: {emission.daily.toLocaleString()}{" "}
                          NEP <br />
                        </div>
                      );
                    })}
                  </Typography.Paragraph>

                  <Divider />
                  <Typography.Paragraph>
                    Total: {totalEmmissions.toLocaleString()} NEP
                  </Typography.Paragraph>
                </>
              }
            />
          </Card>
        </div>

        <div className="column is-4">
          <Card style={{ height: "240px" }} loading={loading}>
            <Card.Meta
              avatar={<Avatar src={NEO_LOGO} />}
              title="NEP on Neo"
              description={
                <>
                  <Typography.Paragraph>
                    Hash:{" "}
                    <a
                      target="_blank"
                      href={`${getExplorer(NEO_CHAIN, network, "contract")}/${
                        values.neo.hash
                      }`}
                    >
                      {values.neo.hash}
                    </a>
                    <br />
                    Total Supply: {transformString(neoSupply)}
                    <br />
                    MC: ${transformString(neoMC)}
                  </Typography.Paragraph>
                </>
              }
            />
          </Card>
        </div>
        <div className="column is-4">
          <Card style={{ height: "240px" }} loading={loading}>
            <Card.Meta
              avatar={<Avatar src={ETHEREUM_LOGO} />}
              title="NEP on Ethereum"
              description={
                <>
                  <Typography.Paragraph>
                    Hash:{" "}
                    <a
                      target="_blank"
                      href={`${getExplorer(ETH_CHAIN, network, "contract")}/${
                        values.ethereum.hash
                      }`}
                    >
                      {values.ethereum.hash}
                    </a>
                    <br />
                    Total Supply: {transformString(ethereumSupply)}
                    <br />
                    MC: ${transformString(ethereumMC)}
                    <br />
                  </Typography.Paragraph>
                  <AddTokenButton
                    chainId={getChainIdByChain(ETH_CHAIN, network)}
                    chainName={"Ethereum"}
                    address={values.ethereum.hash}
                    symbol={"NEP"}
                    decimals={8}
                    image={"https://forthewin.network/symbols/nep.png"}
                  />
                </>
              }
            />
          </Card>
        </div>
        <div className="column is-4">
          <Card style={{ height: "240px" }} loading={loading}>
            <Card.Meta
              avatar={<Avatar src={POLYGON_LOGO} />}
              title="NEP on Polygon"
              description={
                <>
                  <Typography.Paragraph>
                    Hash:{" "}
                    <a
                      target="_blank"
                      href={`${getExplorer(
                        POLYGON_CHAIN,
                        network,
                        "contract"
                      )}/${values.polygon.hash}`}
                    >
                      {values.polygon.hash}
                    </a>
                    <br />
                    Total Supply: {transformString(polygonSupply)}
                    <br />
                    MC: ${transformString(polygonMC)}
                  </Typography.Paragraph>
                  <AddTokenButton
                    chainId={getChainIdByChain(POLYGON_CHAIN, network)}
                    chainName={"Polygon"}
                    address={values.polygon.hash}
                    symbol={"NEP"}
                    decimals={8}
                    image={"https://forthewin.network/symbols/nep.png"}
                  />
                </>
              }
            />
          </Card>
        </div>

        <div className="column is-4">
          <Card style={{ height: "240px" }} loading={loading}>
            <Card.Meta
              avatar={<Avatar src={NEO_LOGO} />}
              title="NEP on NeoX"
              description={
                <>
                  <Typography.Paragraph>
                    Hash:{" "}
                    <a
                      target="_blank"
                      href={`${getExplorer(NEO_CHAIN, network, "contract")}/${
                        values.neoX.hash
                      }`}
                    >
                      {values.neoX.hash}
                    </a>
                    <br />
                    Total Supply: {transformString(neoXSupply)}
                    <br />
                    MC: ${transformString(neoXMC)}
                  </Typography.Paragraph>
                  <AddTokenButton
                    chainId={getChainIdByChain(NEOX_CHAIN, network)}
                    chainName={"NeoX"}
                    address={values.neoX.hash}
                    symbol={"NEP"}
                    decimals={8}
                    image={"https://forthewin.network/symbols/nep.png"}
                  />
                </>
              }
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NEPAnalytics;
