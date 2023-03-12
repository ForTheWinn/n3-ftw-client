import React, { useState } from "react";
import toast from "react-hot-toast";
import { useApp } from "../../../common/hooks/use-app";
import { useOnChainData } from "../../../common/hooks/use-onchain-data";
import { RestAPI } from "../../../packages/neo/api";
import { GMContract } from "../../../packages/neo/contracts/gm";
import { useWallet } from "../../../packages/provider";
import AfterTransactionSubmitted from "../../../packages/ui/AfterTransactionSubmitted";
import Level from "../../components/Level";
import Modal from "../../components/Modal";
import PageLayout from "../../components/PageLayout";
import KeyCard from "./components/KeyCard";

const NEPKeys = () => {
  const { network, connectedWallet } = useWallet();
  const { toggleWalletSidebar } = useApp();
  const [txid, setTxid] = useState("");
  const { data } = useOnChainData(
    () =>
      new RestAPI(network).getGMAssets({
        "creators[]": "NYqGJqeAKCdzqZBjhSTtsLwnsRTrhDsHsC",
      }),
    []
  );

  const onBuy = async (tokenId: string, amount: string) => {
    if (connectedWallet) {
      try {
        const res = await new RestAPI(network).getGMOrders({
          tokenId: tokenId,
        });
        const tx = await new GMContract(network).buy(
          connectedWallet,
          res.orders[0].contractAuctionId,
          amount
        );
        setTxid(tx);
      } catch (e: any) {
        toast.error(e.message);
      }
    } else {
      toggleWalletSidebar()
    }
  };

  return (
    <>
      <PageLayout>
        <div className="columns is-centered">
          <div className="column is-8">
            <div className="box is-shadowless">
              <Level
                isMobile
                left={
                  <div className="is-block">
                    <h1 className="title is-5 is-marginless">NEP Keys</h1>
                    <p>
                      Discover high-value lockers with incredible potential!
                    </p>
                  </div>
                }
              />
            </div>
            <div className="box is-shadowless">
              <div className="table-container">
                <table className="table is-fullwidth is-striped">
                  <thead>
                    <tr>
                      <th>Locker no</th>
                      <th>Price</th>
                      <th>Fee</th>
                      <th>Value</th>
                      <th>Unlock at</th>
                      <th>Duration</th>
                      <th />
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      data.assets.map((evt) => {
                        return (
                          <KeyCard
                            onClick={() =>
                              onBuy(evt.tokenId, evt.lowestOrder.price)
                            }
                            key={evt.tokenId}
                            price={evt.lowestOrder.price}
                            network={network}
                            lockerId={evt.tokenId}
                          />
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
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
    </>
  );
};

export default NEPKeys;
