import React, { useEffect } from "react";
import { Avatar, Card, Divider, Typography } from "antd";
import {
  ETH_CHAIN,
  MAINNET,
  NEOX_CHAIN,
  NEO_CHAIN,
  NEP_LOGO,
  POLYGON_CHAIN,
} from "../../../../../consts/global";
import { useApp } from "../../../../../common/hooks/use-app";
import {
  fetchTokenBalance,
  fetchTokenInfo,
} from "../../../../../common/routers/global";
import { NEP_ADDRESSES } from "../../../../../consts/contracts";
import {
  getChainIdByChain,
  getExplorer,
  transformString,
} from "../../../../../common/helpers";
import { RestAPI } from "../../../../../packages/neo/api";
import { NEO_NEP_CONTRACT_ADDRESS } from "../../../../../packages/neo/consts/tokens";
import AddTokenButton from "../../../../components/AddTokenOnMetaMaskButton";
import CandleChart from "../../components/Pairs/TokenDetailPage/CandleChart";
import { CONFIGS } from "../../../../../consts/chains";
import { BRIDGE_CONTRACTS } from "../../../../../consts/bridge";

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

const NEPAnalytics = () => {
  const { network } = useApp();
  const [values, setValues] = React.useState<any>({
    neo: {
      totalSupply: "0",
      bridge: "0",
    },
    polygon: {
      totalSupply: "0",
      bridge: "0",
    },
    ethereum: {
      totalSupply: "0",
      bridge: "0",
    },
    neoX: {
      totalSupply: "0",
      bridge: "0",
    },
    nepPrice: 0,
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const [
          neoNEP,
          polNEP,
          ethNEP,
          neoXNep,
          nepPrice,
          ethNEPInBridge,
          polNEPInBridge,
        ] = await Promise.all([
          fetchTokenInfo(NEO_CHAIN, network, NEP_ADDRESSES[NEO_CHAIN][network]),
          fetchTokenInfo(
            POLYGON_CHAIN,
            network,
            NEP_ADDRESSES[POLYGON_CHAIN][network]
          ),
          fetchTokenInfo(ETH_CHAIN, network, NEP_ADDRESSES[ETH_CHAIN][network]),
          fetchTokenInfo(
            NEOX_CHAIN,
            network,
            NEP_ADDRESSES[NEOX_CHAIN][network]
          ),
          new RestAPI(MAINNET).getPrice(NEO_NEP_CONTRACT_ADDRESS[MAINNET]),

          fetchTokenBalance(
            NEO_CHAIN,
            network,
            BRIDGE_CONTRACTS[network][getChainIdByChain(NEO_CHAIN, network)][
              getChainIdByChain(ETH_CHAIN, network)
            ],
            NEP_ADDRESSES[NEO_CHAIN][network]
          ),
          fetchTokenBalance(
            NEO_CHAIN,
            network,
            BRIDGE_CONTRACTS[network][getChainIdByChain(NEO_CHAIN, network)][
              getChainIdByChain(POLYGON_CHAIN, network)
            ],
            NEP_ADDRESSES[NEO_CHAIN][network]
          ),
        ]);

        setValues({
          neo: { ...neoNEP },
          polygon: { ...polNEP, bridge: polNEPInBridge },
          ethereum: { ...ethNEP, bridge: ethNEPInBridge },
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

  const polygonSupply = parseFloat(values.polygon.totalSupply);
  const ethereumSupply = parseFloat(values.ethereum.totalSupply);
  const neoSupply =
    parseFloat(values.neo.totalSupply) - polygonSupply - ethereumSupply;
  const neoMC = neoSupply * values.nepPrice;
  const polygonMC = polygonSupply * values.nepPrice;
  const ethereumMC = ethereumSupply * values.nepPrice;
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
              tokenHash={NEO_NEP_CONTRACT_ADDRESS[MAINNET]}
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
              avatar={<Avatar src={CONFIGS[network][NEO_CHAIN].icon} />}
              title={`NEP on ${CONFIGS[network][NEO_CHAIN].label}`}
              description={
                <>
                  <Typography.Paragraph>
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
              avatar={<Avatar src={CONFIGS[network][ETH_CHAIN].icon} />}
              title={`NEP on ${CONFIGS[network][ETH_CHAIN].label}`}
              description={
                <>
                  <Typography.Paragraph>
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
                    In Bridge: {transformString(values.ethereum.bridge)}
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
              avatar={<Avatar src={CONFIGS[network][POLYGON_CHAIN].icon} />}
              title={`NEP on ${CONFIGS[network][POLYGON_CHAIN].label}`}
              description={
                <>
                  <Typography.Paragraph>
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
                    In Bridge: {transformString(values.polygon.bridge)}
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

        {/* <div className="column is-4">
          <Card style={{ height: "240px" }} loading={loading}>
            <Card.Meta
              avatar={<Avatar src={CONFIGS[network][NEOX_CHAIN].icon} />}
              title={`NEP on ${CONFIGS[network][NEOX_CHAIN].label}`}
              description={
                <>
                  <Typography.Paragraph>
                    <a
                      target="_blank"
                      href={`${getExplorer(NEO_CHAIN, network, "contract")}/${
                        values.neoX?.hash
                      }`}
                    >
                      {values.neoX?.hash}
                    </a>
                  </Typography.Paragraph>
                  <AddTokenButton
                    chainId={getChainIdByChain(NEOX_CHAIN, network)}
                    chainName={"NeoX"}
                    address={values.neoX?.hash}
                    symbol={"NEP"}
                    decimals={8}
                    image={"https://forthewin.network/symbols/nep.png"}
                  />
                </>
              }
            />
          </Card>
        </div> */}
      </div>
    </div>
  );
};

export default NEPAnalytics;
