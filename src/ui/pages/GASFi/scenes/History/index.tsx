import React, { useState } from "react";
import DrawHistory from "./DrawHistory";
import ClaimHistory from "./ClaimHistory";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { useApp } from "../../../../../common/hooks/use-app";

const historyRoutes = ["DRAWS", "CLAIMS"];

const History = () => {
  const { connectedWallet } = useNeoWallets();
  const { network } = useApp();
  const [route, setRoute] = useState(historyRoutes[0]);
  return (
    <div>
      <div className="tabs is-small">
        <ul>
          {historyRoutes.map((r) => (
            <li key={r} className={route === r ? "is-active" : ""}>
              <a onClick={() => setRoute(r)}>
                {r === historyRoutes[0] ? "Past results" : "My claims"}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {route === "DRAWS" ? (
        <DrawHistory connectedWallet={connectedWallet} network={network} />
      ) : (
        <ClaimHistory connectedWallet={connectedWallet} network={network} />
      )}
    </div>
  );
};

export default History;
