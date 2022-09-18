import React, { useEffect, useState } from "react";
import PageLayout from "../../components/PageLayout";
import toast from "react-hot-toast";
import { useWallet } from "../../../packages/provider";
import { NFTContract } from "../../../packages/neo/contracts";
import { RUNE_PHASE_FILTER } from "../../../packages/neo/contracts/ftw/rune/consts";
import { handleError } from "../../../packages/neo/utils/errors";

const samples = ["0007", "0051", "0103", "0112"];
const Boyz = () => {
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
        toast.error(handleError(e));
      }
    } else {
      toast.error("Please connect wallet.");
    }
  };
  //
  // useEffect(() => {
  //   document.title =
  //     "FTW | NEO Boyz";
  //   async function fetchContractStatus() {
  //     setError("");
  //     setLoading(true);
  //     try {
  //       const items = await new RestAPI(network).getRunes(filter);
  //       // LEAVE TO SWITCH IN CASE DB ERROR
  //       // const res = await new NFTContract(network).getTokens();
  //       setTokens(items);
  //     } catch (e: any) {
  //       setError(e.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchContractStatus();
  // }, [network, filter]);
  return (
    <PageLayout>
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="box">
            <h1 className="title">NEO Boyz</h1>
            <p className="subtitle">Algorithms-generated NEO Boyz</p>
            <div className="columns">
              {samples.map((img) => {
                return (
                  <div key={img} className="column is-paddingless">
                    <img src={`/boyz/${img}.png`} width="100%" />
                  </div>
                );
              })}
            </div>

            <div className="level">
              <div className="level-left">
                <div className="level-item is-block">
                  <div className="heading">Total supply</div>
                  <p>0/250</p>
                </div>
              </div>

              <div className="level-right">
                <div className="level-item">
	                <button className="button is-primary">Mint</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*<Banner*/}
      {/*  network={network}*/}
      {/*  filter={filter}*/}
      {/*  onFilterChange={onFilterChange}*/}
      {/*  onMint={onMint}*/}
      {/*/>*/}
      {/*{isLoading ? (*/}
      {/*  <PageLayout>*/}
      {/*    <div>Loading..</div>*/}
      {/*  </PageLayout>*/}
      {/*) : error ? (*/}
      {/*  <PageLayout>*/}
      {/*    <div>{error}</div>*/}
      {/*  </PageLayout>*/}
      {/*) : (*/}
      {/*  <div*/}
      {/*    className="container"*/}
      {/*    style={{*/}
      {/*      display: "flex",*/}
      {/*      flexFlow: "wrap",*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    {tokens.map((token) => (*/}
      {/*      <figure*/}
      {/*        style={{ width: "5%" }}*/}
      {/*        key={token.tokenId}*/}
      {/*        className="image rune"*/}
      {/*        onClick={() => onPropertiesModalActive(token.tokenId.toString())}*/}
      {/*      >*/}
      {/*        <img src={token.image} />*/}
      {/*      </figure>*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*)}*/}
      {/*{propertiesModalActive && (*/}
      {/*  <PropertiesModal*/}
      {/*    tokenId={propertiesModalActive}*/}
      {/*    onClose={() => setPropertiesModalActive(undefined)}*/}
      {/*  />*/}
      {/*)}*/}
      {/*{txid && (*/}
      {/*  <Modal onClose={() => setTxid("")}>*/}
      {/*    <AfterTransactionSubmitted*/}
      {/*      txid={txid}*/}
      {/*      network={network}*/}
      {/*      onSuccess={() => setTxid("")}*/}
      {/*      onError={() => setTxid("")}*/}
      {/*    />*/}
      {/*  </Modal>*/}
      {/*)}*/}
    </PageLayout>
  );
};

export default Boyz;
