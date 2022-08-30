import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useWallet } from "../../../../../packages/provider";
import { SmithContract } from "../../../../../packages/neo/contracts/ftw/smith";
import {
  MAINNET,
  UNKNOWN_TOKEN_IMAGE,
} from "../../../../../packages/neo/consts";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { toast } from "react-hot-toast";
import Modal from "../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../../packages/ui/AfterTransactionSubmitted";
import NEP17UpdateFormModal from "./NEP17UpdateFormModal";
import PageLayout from "../../../../components/PageLayout";
import { SMITH_PATH, SMITH_PATH_NEP11 } from "../../../../../consts";
import {handleError} from "../../../../../packages/neo/utils/errors";

const NEP17InfoPage = () => {
  const params = useParams();
  const { contractHash } = params as any;
  const { connectedWallet, network } = useWallet();
  const [isUpdateModalActive, setUpdateModalActive] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [txid, setTxid] = useState<string>();
  const [isAdmin, setAdmin] = useState(false);

  const { isLoaded, error, data } = useOnChainData(() => {
    return new SmithContract(network).getNep17ContractInfo(contractHash);
  }, [connectedWallet, network, refresh]);

  const onSubmitSuccess = () => {
    setRefresh(refresh + 1);
    setTxid("");
  };

  const onUpdate = async (values) => {
    if (connectedWallet) {
      const manifest = JSON.stringify({
        logo: values.logo,
        website: values.website,
      });
      try {
        if (isAdmin) {
          const res = await new SmithContract(network).adminUpdate(
            connectedWallet,
            contractHash,
            manifest
          );
          setAdmin(false);
          setUpdateModalActive(false);
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
  if (!isLoaded) return <div></div>;
  if (error) return <div>{error}</div>;

  const manifest = data.manifest ? JSON.parse(data.manifest) : {};
  return (
    <>
      <PageLayout>
        <div className="columns ">
          <div className="column is-2">
            <Link to={SMITH_PATH} className="button mb-3 is-rounded">
              Back to Main
            </Link>
          </div>
          <div className="column is-8">
            <div className="box is-shadowless">
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
                  <h3 className="title is-5">{data.name}</h3>
                  <div className="content">
                    <p>{data.description}</p>
                    <br />

                    <h6>Contract Hash</h6>
                    <p>
                      0x{contractHash}{" "}
                      <a
                        target="_blank"
                        href={`https://${
                          network === MAINNET
                            ? "explorer.onegate.space"
                            : "testnet.explorer.onegate.space"
                        }/contractinfo/0x${contractHash}`}
                      >
                        <FaExternalLinkAlt />
                      </a>
                    </p>
                    <h6>Contract Owner</h6>
                    <p>{data.owner}</p>

                    <h6>Author</h6>
                    <p>{data.author ? data.author : "Unknown"}</p>

                    <h6>Email</h6>
                    <p>{data.email ? data.email : "Unknown"}</p>

                    <h6>Website</h6>
                    <p>
                      {manifest && manifest.website
                        ? manifest.website
                        : "Unknown"}
                    </p>
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
                        <span className="tag is-dark">Decimals</span>
                        <span className="tag is-info">{data.decimals}</span>
                      </div>
                    </div>

                    <div className="control">
                      <div className="tags has-addons">
                        <span className="tag is-dark">Total supply</span>
                        <span className="tag is-info">
                          {parseFloat(data.totalSupply).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="column is-2">
            <div className="box is-shadowless">
              <div className="block">
                <button
                  onClick={() => {
                    setUpdateModalActive(true);
                  }}
                  className="button is-primary is-fullwidth"
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
                    className="button is-danger is-fullwidth"
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

      {isUpdateModalActive && (
        <NEP17UpdateFormModal
	        manifest={manifest}
          onUpdate={onUpdate}
          onClose={() => setUpdateModalActive(false)}
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

export default NEP17InfoPage;
