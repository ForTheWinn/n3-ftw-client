import React from "react";
import { GASFI_SCRIPT_HASH } from "../../../../../packages/neo/contracts/ftw/gas-fi/consts";
import { INetworkType } from "../../../../../packages/neo/network";

const FreeSpinInfo = ({ network }: { network: INetworkType }) => {
  return (
    <div>
      <div className="content">
        <h6>Rules</h6>
        <ul>
          <li>Free to spin (except transaction fee)</li>
          <li>Whoever matches 777777, win all NEP</li>
          <li>One spin per day</li>
        </ul>
        <h6>CA</h6>
        <ul>
          <li>
            <p>
              <a
                target="_blank"
                href={`https://explorer.onegate.space/contractinfo/${GASFI_SCRIPT_HASH[network]}`}
              >
                {GASFI_SCRIPT_HASH[network]}
              </a>
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FreeSpinInfo;
