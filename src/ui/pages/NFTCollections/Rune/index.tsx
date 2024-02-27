import React, { useEffect, useState } from "react";
import PageLayout from "../../../components/Commons/PageLayout";
import PropertiesModal from "./PropertiesModal";
import { useNeoWallets } from "../../../../common/hooks/use-neo-wallets";
import { NFTContract } from "../../../../packages/neo/contracts";
import Banner from "./Banner";
import { RUNE_PHASE_FILTER } from "../../../../packages/neo/contracts/ftw/rune/consts";
import { useApp } from "../../../../common/hooks/use-app";
import { WENT_WRONG } from "../../../../consts/messages";
import { RestAPI } from "../../../../packages/neo/api";
import { message } from "antd";

const Gallery = () => {
  const [filter, setFilter] = useState<string>(RUNE_PHASE_FILTER[0]);
  const [tokens, setTokens] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [propertiesModalActive, setPropertiesModalActive] = useState<string>();
  const { network, setTxid } = useApp();
  const { connectedWallet } = useNeoWallets();
  const onPropertiesModalActive = (tokenId: string) => {
    setPropertiesModalActive(tokenId);
  };
  const onFilterChange = (val: string) => setFilter(val);
  const onMint = async () => {
    if (connectedWallet) {
      try {
        const res = await new NFTContract(network).mint(connectedWallet);
        setTxid(res);
      } catch (e: any) {
        message.error(e.message ? e.message : WENT_WRONG);
      }
    } else {
      message.error("Please connect wallet.");
    }
  };

  useEffect(() => {
    document.title = "FTW | Runes";
    async function fetchContractStatus() {
      setError("");
      setLoading(true);
      try {
        const items = await new RestAPI(network).getRunes(filter);
        // LEAVE TO SWITCH IN CASE DB ERROR
        // const res = await new NFTContract(network).getTokens();
        setTokens(items);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchContractStatus();
  }, [network, filter]);
  return (
    <section id="Rune">
      <Banner
        network={network}
        filter={filter}
        onFilterChange={onFilterChange}
        onMint={onMint}
      />
      {isLoading ? (
        <PageLayout>
          <div>Loading..</div>
        </PageLayout>
      ) : error ? (
        <PageLayout>
          <div>{error}</div>
        </PageLayout>
      ) : (
        <div
          className="container"
          style={{
            display: "flex",
            flexFlow: "wrap"
          }}
        >
          {tokens.map((token) => (
            <figure
              style={{ width: "5%" }}
              key={token.tokenId}
              className="image rune"
              onClick={() => onPropertiesModalActive(token.tokenId.toString())}
            >
              <img src={token.image} />
              {/*<small*/}
              {/*  className="has-text-white"*/}
              {/*  style={{ position: "absolute", top: 0 }}*/}
              {/*>*/}
              {/*  #{token.tokenId}*/}
              {/*</small>*/}
              {/*<span className="has-text-white">{token.phase}</span>*/}
            </figure>
          ))}
        </div>
      )}
      {propertiesModalActive && (
        <PropertiesModal
          tokenId={propertiesModalActive}
          onClose={() => setPropertiesModalActive(undefined)}
        />
      )}
    </section>
  );
};

export default Gallery;
