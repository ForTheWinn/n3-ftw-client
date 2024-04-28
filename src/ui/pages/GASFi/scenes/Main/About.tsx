import React from "react";
import { GASFI_SCRIPT_HASH } from "../../../../../packages/neo/contracts/ftw/gas-fi/consts";
import { INetworkType } from "../../../../../packages/neo/network";

const About = ({ network }: { network: INetworkType }) => {
  return (
    <div>
      <p className="subtitle is-6">
        Stake 1 bNEO. One spin per a day to win all $GAS.
      </p>

      <div className="content">
        <h6>Rules</h6>
        <ul>
          <li>Stake 1 bNEO</li>
          <li>One spin per day</li>
          <li>Unstake when you don't want to spin</li>
        </ul>
        <h6>Contract info</h6>
        <ul>
          <li>
            <p>
              <a
                target="_blank"
                href={
                  "https://explorer.onegate.space/contractinfo/0xbc54874a9505e668bc0af9301ff261fcc4a640ee"
                }
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

export default About;
