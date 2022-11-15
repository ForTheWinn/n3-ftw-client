import React, { useEffect, useState } from "react";
import PageLayout from "../../components/PageLayout";
import { useWallet } from "../../../packages/provider";
import Banner from "./Banner";
import { RestAPI } from "../../../packages/neo/api";
import Modal from "../../components/Modal";
import RarityList from "./RarityList";
import { IBoy } from "../../../packages/neo/contracts/ftw/boyz/interface";
import PropertiesModal from "./PropertiesModal";

const Boyz = () => {
  const [isFilterActive, setFilterActive] = useState(false);
  const [isDetailModalActive, setDetailModalActive] = useState<
    IBoy | undefined
  >();

  const [filter, setFilter] = useState<any>({
    eyes: [],
    body: [],
    clothing: [],
    accessory: [],
    head: [],
    mouth: [],
    background: ["Mint"],
  });
  const [currentCategory, setCurrentCategory] = useState<string>("clothing");
  const [boyz, setBoyz] = useState<any>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { network } = useWallet();

  const onFilterChange = (newFilter: any) => {
    setFilter({
      ...newFilter,
    });
    setFilterActive(false);
  };

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
      <Banner filter={filter} setFilter={setFilter} setFilterActive={() => setFilterActive(true)} />
      <PageLayout>
        {isLoading ? (
          <div>Loading boyz..</div>
        ) : (
          <div className="is-flex" style={{ flexWrap: "wrap" }}>
            {boyz.map((boy) => (
              <>
                <img
                  className="is-clickable"
                  onClick={() => setDetailModalActive(boy)}
                  width="10%"
                  src={boy.image}
                  alt={boy.no}
                />
              </>
            ))}
          </div>
        )}
      </PageLayout>
      {isFilterActive && (
        <Modal onClose={() => setFilterActive(false)}>
          <div>
            <RarityList
              filter={filter}
              setFilter={onFilterChange}
              currentCategory={currentCategory}
              setCurrentCategory={setCurrentCategory}
            />
          </div>
        </Modal>
      )}
      {isDetailModalActive && (
        <PropertiesModal
          data={isDetailModalActive}
          onClose={() => setDetailModalActive(undefined)}
        />
      )}
    </div>
  );
};

export default Boyz;
