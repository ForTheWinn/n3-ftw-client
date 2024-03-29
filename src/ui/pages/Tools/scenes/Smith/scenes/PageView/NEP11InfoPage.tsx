import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNeoWallets } from "../../../../../../../common/hooks/use-neo-wallets";
import { SmithContract } from "../../../../../../../packages/neo/contracts/ftw/smith";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useOnChainData } from "../../../../../../../common/hooks/use-onchain-data";
import NEP11MintFormModal from "./NEP11MintFormModal";
import PageLayout from "../../../../../../components/Commons/PageLayout";
import {
  MAINNET,
  UNKNOWN_TOKEN_IMAGE
} from "../../../../../../../consts/global";
import { useApp } from "../../../../../../../common/hooks/use-app";
import { SMITH_PATH_NEP11 } from "../../../../../../../consts/routes";
import { WENT_WRONG } from "../../../../../../../consts/messages";
import { message } from "antd";

const NEP11InfoPage = () => {
  const params = useParams();
  const { contractHash } = params as any;
  const { network, setTxid, refreshCount } = useApp();
  const { connectedWallet } = useNeoWallets();
  const [isMintModalActive, setMintModalActive] = useState("");
  const [isUpdateModalActive, setUpdateModalActive] = useState(false);
  const [isAdmin, setAdmin] = useState(false);

  const { isLoaded, error, data } = useOnChainData(() => {
    return new SmithContract(network).getNep11ContractInfo(contractHash);
  }, [connectedWallet, network, refreshCount]);
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
        message.error(e.message ? e.message : WENT_WRONG);
      }
    } else {
      message.error("Please connect wallet.");
    }
  };

  const onClickMint = () => {
    if (connectedWallet) {
      if (connectedWallet.account.address === data.owner) {
        setMintModalActive(contractHash);
      } else {
        message.error("Only contract owner can mint");
      }
    } else {
      message.error("Please connect your wallet");
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
        message.error(e.message ? e.message : WENT_WRONG);
      }
    } else {
      message.error("Please connect wallet.");
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
            <Link to={SMITH_PATH_NEP11} className="button mb-3 is-rounded">
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
                    {contractHash}{" "}
                    <a
                      target="_blank"
                      href={`https://${
                        network === MAINNET
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
              {/* <Tokens contractHash={contractHash} /> */}
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
              {/* {process.env.NODE_ENV === "development" ? (
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
              )} */}
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

      {/* {isUpdateModalActive && (
        <NEP17UpdateFormModal
          manifest={manifest}
          onUpdate={onUpdate}
          onClose={() => {
            setAdmin(false);
            setUpdateModalActive(false);
          }}
        />
      )} */}
    </>
  );
};

export default NEP11InfoPage;
