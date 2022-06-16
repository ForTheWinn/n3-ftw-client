import React, { useEffect, useState } from "react";
import PageLayout from "../../components/PageLayout";
import PropertiesModal from "./PropertiesModal";
import toast from "react-hot-toast";
import { useWallet } from "../../../packages/provider";
import { NFTContract } from "../../../packages/neo/contracts";
import Banner from "./Banner";
import { RestAPI } from "../../../packages/neo/api";
import { RUNE_PHASE_FILTER } from "../../../packages/neo/contracts/ftw/nft/consts";
import AfterTransactionSubmitted from "../../../packages/ui/AfterTransactionSubmitted";
import Modal from "../../components/Modal";

const Gallery = () => {
  const [txid, setTxid] = useState("");
  const [filter, setFilter] = useState<string>(RUNE_PHASE_FILTER[0]);
  const [tokens, setTokens] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [propertiesModalActive, setPropertiesModalActive] = useState<string>();
  const { connectedWallet, network, addPendingTransaction } = useWallet();
  const onPropertiesModalActive = (tokenId: string) => {
    setPropertiesModalActive(tokenId);
  };
  const onFilterChange = (val: string) => setFilter(val);
  const onMint = async () => {
    if (connectedWallet) {
      try {
        const res = await new NFTContract(network).mint(connectedWallet);
        addPendingTransaction(res);
        setTxid(res);
      } catch (e: any) {
	      console.log(e);
	      toast.error("An error occurred, Check console.");
      }
    } else {
      toast.error("Please connect wallet.");
    }
  };

  useEffect(() => {
    document.title =
      "Forthewin Rune: Algorithms-generated lucky runes NFT on NEO";
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
            flexFlow: "wrap",
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
      {txid && (
        <Modal onClose={() => setTxid("")}>
          <AfterTransactionSubmitted
            txid={txid}
            network={network}
            onSuccess={() => setTxid("")}
            onError={() => setTxid("")}
          />
        </Modal>
      )}
    </section>
  );
};

export default Gallery;
