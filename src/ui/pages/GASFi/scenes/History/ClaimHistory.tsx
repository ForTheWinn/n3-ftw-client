import React, { useEffect, useState } from "react";
import { IClaim } from "../../../../../packages/neo/contracts/ftw/gas-fi/interfaces";
import { GasFiContract } from "../../../../../packages/neo/contracts/ftw/gas-fi";
import { INetworkType } from "../../../../../packages/neo/network";
import { IConnectedWallet } from "../../../../../packages/neo/wallets/interfaces";
import { withDecimal } from "../../../../../packages/neo/utils";
import { useApp } from "../../../../../common/hooks/use-app";

export interface IClaimHistoryProps {
  network: INetworkType;
  connectedWallet?: IConnectedWallet;
}

const ClaimHistory = ({ connectedWallet, network }: IClaimHistoryProps) => {
  const { toggleWalletSidebar } = useApp();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<IClaim[]>([]);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const res = connectedWallet
          ? await new GasFiContract(network).getClaims(connectedWallet)
          : [];
        setData(res);
        setLoading(false);
      } catch (e: any) {
        console.log(e);
        setError(e.message);
        setLoading(false);
      }
    }
    fetch();
  }, [connectedWallet, network]);
  if (!connectedWallet) {
    return (
      <div>
        <button
          onClick={toggleWalletSidebar}
          className="button is-fullwidth is-primary"
        >
          Connect wallet
        </button>
      </div>
    );
  }
  return (
    <div>
      <div className="table-container">
        <table className="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Draw #</th>
              <th>Reward</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4}>Loading..</td>
              </tr>
            ) : error ? (
              <div>{error}</div>
            ) : data.length > 0 ? (
              data.map((item, i) => {
                return (
                  <tr key={`claim-${i}`}>
                    <td>{item.drawNo}</td>
                    <td>{withDecimal(item.reward, 8, true)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={2}>No claim history</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClaimHistory;
