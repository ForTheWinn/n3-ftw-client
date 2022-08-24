import React, { useEffect, useState } from "react";
import { RestAPI } from "../../../../../../packages/neo/api";
import { INetworkType } from "../../../../../../packages/neo/network";
import PairIcons from "../../../../../components/PairIcons";
import { numberTrim } from "../../../../../../packages/neo/utils";
import { FaChartLine } from "react-icons/fa";

interface IPairItem {
  network: INetworkType;
  tokenA: string;
  tokenB: string;
  tokenASymbol: string;
  tokenBSymbol: string;
  onClick: () => void;
}
const PairItem = ({
  tokenA,
  tokenB,
  tokenASymbol,
  tokenBSymbol,
  network,
  onClick,
}: IPairItem) => {
  const [data, setData] = useState<any>();
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const res = await new RestAPI(network).getPair(`${tokenA}_${tokenB}`);
        setData(res);
        setLoading(false);
      } catch (e: any) {
        setLoading(false);
        // setError(e.message);
      }
    }
    fetch();
  }, []);
  if (isLoading) return <></>;
  if (data && data.reserveUSD < 100) return <></>;
  return (
    <tr>
      <td>
        <div className="is-flex" style={{ alignItems: "center" }}>
          <PairIcons
            width="20px"
            height="20px"
            network={network}
            tokenA={tokenA.slice(2)}
            tokenB={tokenB.slice(2)}
          />
          <span className="ml-2">{`${tokenASymbol}-${tokenBSymbol}`}</span>
        </div>
      </td>
      <td>{data ? "$" + numberTrim(data.reserveUSD) : ""}</td>
      <td>{data ? "$" + numberTrim(data.volumeUSD) : ""}</td>
      {/*<td>{data ? "$" + numberTrim(data.feesUSD) : ""}</td>*/}
      <td style={{ textAlign: "right" }}>
        <button onClick={onClick} className="button is-small is-white">
          <FaChartLine />
        </button>
      </td>
    </tr>
  );
};

export default PairItem;
