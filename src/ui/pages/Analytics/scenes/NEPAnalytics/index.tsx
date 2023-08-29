import React, { useEffect } from "react";
import { Avatar, Card, Typography } from "antd";
import {
  NEO_CHAIN,
  NEO_LOGO,
  POLYGON_CHAIN,
  POLYGON_LOGO,
} from "../../../../../consts/global";
import { useApp } from "../../../../../common/hooks/use-app";
import { fetchTokenInfo } from "../../../../../common/routers/global";
import { GLOBAL_NEP_CONTRACT_ADDRESS } from "../../../../../consts/contracts";
import { getExplorer, transformString } from "../../../../../common/helpers";

const NEPdAnalytics = (props) => {
  const { network } = useApp();
  const [values, setValues] = React.useState<any>({
    neo: {
      totalSupply: "0",
    },
    polygon: {
      totalSupply: "0",
    },
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const neoNEP = await fetchTokenInfo(
          NEO_CHAIN,
          network,
          GLOBAL_NEP_CONTRACT_ADDRESS[NEO_CHAIN][network]
        );
        const polNEP = await fetchTokenInfo(
          POLYGON_CHAIN,
          network,
          GLOBAL_NEP_CONTRACT_ADDRESS[POLYGON_CHAIN][network]
        );
        setValues({
          neo: neoNEP,
          polygon: polNEP,
        });
      } catch (e: any) {
        console.error(e);
      }
      setLoading(false);
    }
    fetch();
  }, []);

  return (
    <div>
      <div className="columns">
        <div className="column">
          <Card>
            <Card.Meta
              avatar={<Avatar src={NEO_LOGO} />}
              title="NEP in NEO"
              description={
                <>
                  {loading ? (
                    "Loading..."
                  ) : (
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
                      Total supply: {values.neo.totalSupply}
                    </Typography.Paragraph>
                  )}
                </>
              }
            />
          </Card>
        </div>
        <div className="column">
          <Card>
            <Card.Meta
              avatar={<Avatar src={POLYGON_LOGO} />}
              title="NEP in NEO"
              description={
                <>
                  {loading ? (
                    "Loading..."
                  ) : (
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
                      Total supply: {values.polygon.totalSupply}
                    </Typography.Paragraph>
                  )}
                </>
              }
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NEPdAnalytics;
