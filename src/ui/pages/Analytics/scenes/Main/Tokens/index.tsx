import React, { useState } from "react";
import { RestAPI } from "../../../../../../packages/neo/api";
import TokenItem from "./TokenItem";
import ModalCard from "../../../../../components/Modal";
import TokenDetail from "../../TokenDetail";
import { useApp } from "../../../../../../common/hooks/use-app";
import { useOnChainData } from "../../../../../../common/hooks/use-onchain-data";
import { ANALYTICS_PATH, ANALYTICS_TOKENS_PATH } from "../../../../../../consts/neoRoutes";

const TokensAnalytics = () => {
  const { chain, network } = useApp();
  const [isModalActive, setModalActive] = useState("");
  const handleTokenClick = (id: string) => {
    setModalActive(id);
    window.history.replaceState(
      null,
      "",
      `#${ANALYTICS_TOKENS_PATH}/${id}`
    );
  };

  const handleModalClose = () => {
    window.history.replaceState(null, "", `#${ANALYTICS_PATH}`);
    setModalActive("");
  };

  const { data } = useOnChainData(() => {
    return new RestAPI(network).getTokens();
  }, []);
  return (
    <div>
      <div className="table-container">
        <table className="table is-fullwidth is-narrow">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>24H %</th>
              <th>7D %</th>
              <th>Volume 24H</th>
              <th>Liquidity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data && data.map((token) => (
              <TokenItem
                chain={chain}
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
