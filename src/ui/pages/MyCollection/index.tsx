import React, { useEffect, useState } from "react";
import PageLayout from "../../components/Commons/PageLayout";
import { useWallet } from "../../../packages/neo/provider";
import { NFTContract } from "../../../packages/neo/contracts";
import PropertiesModal from "../Rune/PropertiesModal";
import { Link } from "react-router-dom";
import { NEO_ROUTES } from "../../../consts";

const MyCollection = () => {
  const [tokens, setTokens] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [propertiesModalActive, setPropertiesModalActive] = useState<string>();
  const { connectedWallet, network } = useWallet();
  const onPropertiesModalActive = (tokenId: string) => {
    setPropertiesModalActive(tokenId);
  };

  useEffect(() => {
    async function fetchContractStatus(address: string) {
      setError("");
      try {
        const res = await new NFTContract(network).getTokensOf(address);
        setTokens(res);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
      }
    }
    if (connectedWallet) {
      fetchContractStatus(connectedWallet.account.address);
    }
  }, [connectedWallet, network]);
  return (
    <>
      <section className="hero is-white">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">My runes</h1>
          </div>
        </div>
      </section>
      <PageLayout>
        {isLoading ? (
          <div>Loading..</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className="columns is-multiline">
            {tokens.length > 0 ? (
              tokens.map((token) => (
                <div className="column is-2">
                  <figure
                    className="image"
                    onClick={() => onPropertiesModalActive(token.tokenId)}
                  >
                    <img src={token.image} />
                  </figure>
                </div>
              ))
            ) : (
              <div className="column is-3">
                <div className="box">
                  <div className="block">
                    <p>You don't have any runes yet</p>
                  </div>

                  <Link className="button is-primary" to={NEO_ROUTES.GALLERY_PATH}>
                    Go Get Them
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </PageLayout>
      {propertiesModalActive && (
        <PropertiesModal
          tokenId={propertiesModalActive}
          onClose={() => setPropertiesModalActive(undefined)}
        />
      )}
    </>
  );
};

export default MyCollection;
