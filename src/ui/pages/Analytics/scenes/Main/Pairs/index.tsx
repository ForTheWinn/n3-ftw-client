import React, { useEffect, useState } from "react";
import { RestAPI } from "../../../../../../packages/neo/api";
import PairItem from "./PairItem";
import ModalCard from "../../../../../components/Modal";
import PairDetail from "../../PairDetail";
import { NEO_ROUTES } from "../../../../../../consts";
import { useApp } from "../../../../../../common/hooks/use-app";

const Pairs = () => {
  const { network } = useApp();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isModalActive, setModalActive] = useState("");
  const handleTokenClick = (id: string) => {
    setModalActive(id);
    window.history.replaceState(
      null,
      "",
      `#${NEO_ROUTES.ANALYTICS_PAIRS_PATH}/${id}`
    );
  };

  const handleModalClose = () => {
    window.history.replaceState(null, "", `#${NEO_ROUTES.ANALYTICS_PATH}`);
    setModalActive("");
  };
  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const res = await new RestAPI(network).getPairs();
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
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>Name</th>
              <th>Liquidity</th>
              <th>Volume</th>
              {/*<th>Fees</th>*/}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((pair) => (
              <PairItem
                onClick={() => handleTokenClick(pair.id)}
                key={pair.id}
                tokenA={pair.token_A_id}
                tokenB={pair.token_B_id}
                tokenASymbol={pair.token_A_symbol}
                tokenBSymbol={pair.token_B_symbol}
                network={network}
              />
            ))}
          </tbody>
        </table>
      </div>
      {isModalActive !== "" ? (
        <ModalCard isLarge={true} onClose={handleModalClose}>
          <div className="has-modal-page">
            <PairDetail id={isModalActive} />
          </div>
        </ModalCard>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Pairs;
