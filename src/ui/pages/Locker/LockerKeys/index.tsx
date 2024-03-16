import React, { useEffect, useState } from "react";
import { useNeoWallets } from "../../../../common/hooks/use-neo-wallets";
import { ILockerKeyToken } from "../../../../packages/neo/contracts/ftw/locker/interface";
import { LockerContract } from "../../../../packages/neo/contracts/ftw/locker";
import LockerKeyCard from "./LockerKeyCard";
import ConnectWalletButton from "../../../components/ConnectWalletButton";
import { useApp } from "../../../../common/hooks/use-app";
import { message } from "antd";

const LockerKeys = () => {
  const { network, setTxid, refreshCount } = useApp();
  const { connectedWallet } = useNeoWallets();
  const [data, setData] = useState<{
    items: ILockerKeyToken[];
  }>();

  const handleUnLock = async (lockerNo: string | number) => {
    if (connectedWallet) {
      try {
        const res = await new LockerContract(network).unLock(
          connectedWallet,
          lockerNo
        );
        setTxid(res);
      } catch (e: any) {
        message.error(e.message);
      }
    } else {
      message.error("Connect your wallet");
    }
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
  }, [network, connectedWallet, refreshCount]);

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
    </div>
  );
};

export default LockerKeys;
