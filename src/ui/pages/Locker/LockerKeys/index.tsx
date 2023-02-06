import React, { useEffect, useState } from "react";
import { useWallet } from "../../../../packages/provider";
import { ILockerKeyToken } from "../../../../packages/neo/contracts/ftw/locker/interface";
import { LockerContract } from "../../../../packages/neo/contracts/ftw/locker";
import LockerKeyCard from "./LockerKeyCard";
import ConnectWalletButton from "../../../components/ConnectWalletButton";
import toast from "react-hot-toast";
import Modal from "../../../components/Modal";
import AfterTransactionSubmitted from "../../../components/NeoComponents/AfterTransactionSubmitted";

const LockerKeys = () => {
  const { network, connectedWallet } = useWallet();
  const [data, setData] = useState<{
    items: ILockerKeyToken[];
  }>();

  const [txid, setTxid] = useState("");
  const [refresh, setRefresh] = useState(0);
  const handleUnLock = async (lockerNo: string | number) => {
    if (connectedWallet) {
      try {
        const res = await new LockerContract(network).unLock(
          connectedWallet,
          lockerNo
        );
        setTxid(res);
      } catch (e: any) {
        toast.error(e.message);
      }
    } else {
      toast.error("Connect your wallet");
    }
  };
  const handleAfterTx = () => {
    setRefresh(refresh + 1);
    setTxid("");
  };

  useEffect(() => {
    async function fetch(address) {
      try {
        const items = await new LockerContract(network).getLockerKeys(address);
        setData({
          items,
        });
      } catch (e: any) {
        console.error(e);
      }
    }
    if (connectedWallet) {
      fetch(connectedWallet.account.address);
    }
  }, [network, connectedWallet, refresh]);

  return (
    <div>
      <div className="columns is-centered">
        <div className="column is-8">
          <div className="box  is-shadowless">
            <h1 className="title is-5">Locker keys</h1>
            {connectedWallet ? (
              <div className="table-container">
                <table className="table is-fullwidth">
                  <thead>
                    <tr>
                      <th>Locker no</th>
                      <th>Contract hash</th>
                      <th>Symbol</th>
                      <th>Amount</th>
                      <th>Release at</th>
                      <th>Time left</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data ? (
                      data.items.length > 0 ? (
                        data.items.map((locker) => {
                          return (
                            <LockerKeyCard
                              network={network}
                              onUnLock={handleUnLock}
                              {...locker}
                            />
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6}>No keys</td>
                        </tr>
                      )
                    ) : (
                      <></>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>
                <ConnectWalletButton />
              </div>
            )}
          </div>
        </div>
      </div>
      {txid && (
        <Modal onClose={() => setTxid("")}>
          <AfterTransactionSubmitted
            txid={txid}
            network={network}
            onSuccess={handleAfterTx}
            onError={() => setTxid("")}
          />
        </Modal>
      )}
    </div>
  );
};

export default LockerKeys;
