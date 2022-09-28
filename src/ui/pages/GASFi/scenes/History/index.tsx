import React, { useState } from "react";
import DrawHistory from "./DrawHistory";
import ClaimHistory from "./ClaimHistory";
import { useWallet } from "../../../../../packages/provider";

const historyRoutes = ["DRAWS", "CLAIMS"];

const History = () => {
  const { connectedWallet, network } = useWallet();
  const [route, setRoute] = useState(historyRoutes[0]);
  return (
    <div>
      <div className="tabs is-small">
        <ul>
          {historyRoutes.map((r) => (
            <li key={r} className={route === r ? "is-active" : ""}>
              <a onClick={() => setRoute(r)}>{r === historyRoutes[0] ? "Past results" : "My claims"}</a>
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
