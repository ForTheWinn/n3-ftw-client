import React, { useEffect, useState } from "react";
import PageLayout from "../../components/PageLayout";
import { useWallet } from "../../../packages/provider";
import { RUNE_PHASE_FILTER } from "../../../packages/neo/contracts/ftw/rune/consts";
import Banner from "./Banner";
import { RestAPI } from "../../../packages/neo/api";

const Boyz = () => {
  const [txid, setTxid] = useState("");
  const [filter, setFilter] = useState<string>(RUNE_PHASE_FILTER[0]);
  const [boyz, setBoyz] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [propertiesModalActive, setPropertiesModalActive] = useState<string>();
  const { connectedWallet, network, addPendingTransaction } = useWallet();

  const onPropertiesModalActive = (tokenId: string) => {
    setPropertiesModalActive(tokenId);
  };

  const onFilterChange = (val: string) => setFilter(val);

  useEffect(() => {
    document.title = "FTW | NEO Boyz";
    async function fetchContractStatus() {
      setError("");
      setLoading(true);
      try {
        const items = await new RestAPI(network).getBoyz(filter);
        setBoyz(items);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchContractStatus();
  }, [network, filter]);

  return (
    <div>
      <Banner />
      <PageLayout>
        <div className="is-flex" style={{ flexWrap: "wrap" }}>
          {boyz.map((boy) => (
            <img width="5%" src={boy.image} alt={boy.no} />
          ))}
        </div>
      </PageLayout>
    </div>
  );
};

export default Boyz;
