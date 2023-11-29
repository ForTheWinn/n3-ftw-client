import React, { useEffect } from "react";
import { Avatar, Card, Spin, Typography } from "antd";
import {
  ETHEREUM_LOGO,
  ETH_CHAIN,
  MAINNET,
  NEO_CHAIN,
  NEO_LOGO,
  POLYGON_CHAIN,
  POLYGON_LOGO,
} from "../../../../../consts/global";
import { useApp } from "../../../../../common/hooks/use-app";
import { fetchTokenInfo } from "../../../../../common/routers/global";
import { GLOBAL_NEP_CONTRACT_ADDRESS } from "../../../../../consts/contracts";
import { getExplorer, transformString } from "../../../../../common/helpers";
import { RestAPI } from "../../../../../packages/neo/api";
import { NEO_NEP_CONTRACT_ADDRESS } from "../../../../../packages/neo/consts/neo-contracts";

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
    nepPrice: "0",
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [neoNEP, polNEP, ethNEP, nepPrice] = await Promise.all([
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
          new RestAPI(MAINNET).getPrice(NEO_NEP_CONTRACT_ADDRESS[MAINNET]),
        ]);


        setValues({
          neo: neoNEP,
          polygon: polNEP,
          ethereum: ethNEP,
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

  if (loading) return null;


  const neoSupply =
    parseFloat(values.neo.totalSupply) - parseFloat(values.polygon.totalSupply);
  const polygonSupply = parseFloat(values.polygon.totalSupply);
  const ethereumSupply = parseFloat(values.ethereum.totalSupply);
  const neoMC = neoSupply * values.nepPrice;
  const polygonMC = polygonSupply * values.nepPrice;
  const ethereumMC = ethereumSupply * values.nepPrice;

  return (
    <div>
      <div className="columns">
        <div className="column">
          <Card>
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
        <div className="column">
          <Card>
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
                  </Typography.Paragraph>
                </>
              }
            />
          </Card>
        </div>
        <div className="column">
          <Card>
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
