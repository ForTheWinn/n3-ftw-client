import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { SmithContract } from "../../../../../packages/neo/contracts/ftw/smith";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import Tokens from "../NEP11/Tokens";
import NEP11MintFormModal from "./NEP11MintFormModal";
import { toast } from "react-hot-toast";
import AfterTransactionSubmitted from "../../../../components/NeoComponents/AfterTransactionSubmitted";
import Modal from "../../../../components/Modal";
import PageLayout from "../../../../components/Commons/PageLayout";
import NEP17UpdateFormModal from "./NEP17UpdateFormModal";
import { handleError } from "../../../../../packages/neo/utils/errors";
import { NEO_ROUTES, GLOBAL } from "../../../../../consts";
import { UNKNOWN_TOKEN_IMAGE } from "../../../../../consts/global";
import { useApp } from "../../../../../common/hooks/use-app";

const NEP11InfoPage = () => {
  const params = useParams();
  const { contractHash } = params as any;
  const { network } = useApp();
  const { connectedWallet } = useNeoWallets();
  const [isMintModalActive, setMintModalActive] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [txid, setTxid] = useState<string>();
  const [isUpdateModalActive, setUpdateModalActive] = useState(false);
  const [isAdmin, setAdmin] = useState(false);

  const { isLoaded, error, data } = useOnChainData(() => {
    return new SmithContract(network).getNep11ContractInfo(contractHash);
  }, [connectedWallet, network, refresh]);
  const onUpdate = async (values) => {
    if (connectedWallet) {
      const manifest = JSON.stringify({
        logo: values.logo,
        website: values.website
      });
      try {
        if (isAdmin) {
          const res = await new SmithContract(network).adminUpdate(
            connectedWallet,
            contractHash,
            manifest
          );
          setUpdateModalActive(false);
          setAdmin(false);
          setTxid(res);
        } else {
          const res = await new SmithContract(network).updateManifest(
            connectedWallet,
            contractHash,
            manifest
          );
          setUpdateModalActive(false);
          setTxid(res);
        }
      } catch (e: any) {
        toast.error(handleError(e));
      }
    } else {
      toast.error("Please connect wallet.");
    }
  };

  const onClickMint = () => {
    if (connectedWallet) {
      if (connectedWallet.account.address === data.owner) {
        setMintModalActive(contractHash);
      } else {
        toast.error("Only contract owner can mint");
      }
    } else {
      toast.error("Please connect your wallet");
    }
  };
  const onMint = async (values) => {
    if (connectedWallet) {
      try {
        const res = await new SmithContract(network).mintNFT(
          connectedWallet,
          contractHash,
          values.name,
          values.description,
          values.image,
          JSON.stringify(values.attributes)
        );
        setMintModalActive("");
        setTxid(res);
      } catch (e: any) {
        toast.error(handleError(e));
      }
    } else {
      toast.error("Please connect wallet.");
    }
  };

  const onSubmitSuccess = () => {
    setRefresh(refresh + 1);
    setTxid("");
  };

  if (!isLoaded) return <div></div>;
  if (error) return <div>{error}</div>;

  const manifest = data.manifest ? JSON.parse(data.manifest) : {};
  return (
    <>
      <PageLayout>
        <div className="columns ">
          <div className="column is-2">
            <Link
              to={NEO_ROUTES.SMITH_PATH_NEP11}
              className="button mb-3 is-rounded"
            >
              Back to Main
            </Link>
          </div>
          <div className="column is-8">
            <div className="box is-shadowless">
              <h3 className="title is-5">{data.name}</h3>
              <div className="media">
                {manifest && manifest.logo ? (
                  <div className="media-left">
                    <div className="image is-128x128 mb-2">
                      <img
                        onError={(e) => {
                          // @ts-ignore
                          e.target.src = UNKNOWN_TOKEN_IMAGE;
                        }}
                        src={
                          manifest && manifest.logo
                            ? manifest.logo
                            : UNKNOWN_TOKEN_IMAGE
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                <div className="media-content">
                  <div className="content">
                    <strong>Contract Hash</strong>
                    <br />
                    0x{contractHash}{" "}
                    <a
                      target="_blank"
                      href={`https://${
                        network === GLOBAL.MAINNET
                          ? "explorer.onegate.space"
                          : "testmagnet.explorer.onegate.space"
                      }/contractinfo/${contractHash}`}
                      rel="noreferrer"
                    >
                      <FaExternalLinkAlt />
                    </a>
                    <br />
                    <strong>Contract Owner</strong>
                    <br />
                    {data.owner}
                    <br />
                    <strong>Website</strong>
                    <br />
                    {manifest && manifest.website ? (
                      <a
                        className="has-text-dark"
                        target="_blank"
                        href={manifest.website}
                        rel="noreferrer"
                      >
                        {manifest.website}
                      </a>
                    ) : (
                      "Unknown"
                    )}
                  </div>
                  <div className="field is-grouped is-grouped-multiline">
                    <div className="control">
                      <div className="tags has-addons">
                        <span className="tag is-dark">Symbol</span>
                        <span className="tag is-info">{data.symbol}</span>
                      </div>
                    </div>
                    <div className="control">
                      <div className="tags has-addons">
                        <span className="tag is-dark">Total supply</span>
                        <span className="tag is-info">{data.totalSupply}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="box is-shadowless">
              <h3 className="title is-5">Collection</h3>
              <Tokens contractHash={contractHash} />
            </div>
          </div>
          <div className="column is-2">
            <div className="box is-shadowless">
              <div className="block">
                <button
                  onClick={onClickMint}
                  className="button is-primary is-fullwidth"
                >
                  Mint
                </button>
              </div>
              <div className="block">
                <button
                  onClick={() => setUpdateModalActive(true)}
                  className="button is-primary  is-fullwidth"
                >
                  Update
                </button>
              </div>
              {process.env.NODE_ENV === "development" ? (
                <div className="block">
                  <button
                    onClick={() => {
                      setAdmin(true);
                      setUpdateModalActive(true);
                    }}
                    className="button is-danger  is-fullwidth"
                  >
                    Admin
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </PageLayout>
      {isMintModalActive && (
        <NEP11MintFormModal
          onMint={onMint}
          contractHash={isMintModalActive}
          onClose={() => setMintModalActive("")}
        />
      )}

      {isUpdateModalActive && (
        <NEP17UpdateFormModal
          manifest={manifest}
          onUpdate={onUpdate}
          onClose={() => {
            setAdmin(false);
            setUpdateModalActive(false);
          }}
        />
      )}

      {txid && (
        <Modal onClose={() => setTxid("")}>
          <AfterTransactionSubmitted
            network={network}
            txid={txid}
            onSuccess={onSubmitSuccess}
            onError={() => setTxid("")}
          />
        </Modal>
      )}
    </>
  );
};

export default NEP11InfoPage;
