import React, { useEffect, useState } from "react";
import { useWallet } from "../../../../../../packages/provider";
import { RestAPI } from "../../../../../../packages/neo/api";
import TokenItem from "./TokenItem";
import ModalCard from "../../../../../components/Modal";
import TokenDetail from "../../TokenDetail";
import {
  ANALYTICS_PATH,
  ANALYTICS_TOKENS_PATH,
} from "../../../../../../consts";

const TokensAnalytics = (props) => {
  const { network } = useWallet();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isModalActive, setModalActive] = useState("");
  const handleTokenClick = (id: string) => {
    setModalActive(id);
    window.history.replaceState(null, "", `#${ANALYTICS_TOKENS_PATH}/${id}`);
  };

  const handleModalClose = () => {
    window.history.replaceState(null, "", `#${ANALYTICS_PATH}`);
    setModalActive("");
  };

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const res = await new RestAPI(network).getTokens();
        setData(res);
        setLoading(false);
      } catch (e: any) {
        setLoading(false);
        // setError(e.message);
      }
    }
    fetch();
  }, []);
  return (
    <div>
      <div className="table-container">
        <table className="table is-fullwidth is-narrow">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Liquidity</th>
              <th>Volume</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((token) => (
              <TokenItem
                onClick={handleTokenClick}
                key={token.id}
                id={token.id}
                network={network}
                symbol={token.symbol}
              />
            ))}
          </tbody>
        </table>
      </div>
      {isModalActive !== "" ? (
        <ModalCard isLarge={true} onClose={handleModalClose}>
          <div className="has-modal-page">
            <TokenDetail tokenId={isModalActive} />
          </div>
        </ModalCard>
      ) : (
        <></>
      )}
    </div>
  );
};

export default TokensAnalytics;
