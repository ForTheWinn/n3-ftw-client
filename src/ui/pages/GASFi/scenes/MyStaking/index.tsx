import React, { useEffect, useState } from "react";
import { useWallet } from "../../../../../packages/provider";
import { GasFiContract } from "../../../../../packages/neo/contracts/ftw/gas-fi";
import { IStakeResult } from "../../../../../packages/neo/contracts/ftw/gas-fi/interfaces";
import HeaderBetween from "../../../../components/HeaderBetween";
import { GASFI_PATH } from "../../../../../consts";

export interface IMainData {
  staking: IStakeResult;
}
const MyStaking = (props) => {
  const { network, connectedWallet } = useWallet();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<IMainData | undefined>(undefined);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const res = await new GasFiContract(network).getStake(connectedWallet);
        setData(res);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    }
    fetch();
  }, [connectedWallet, network]);

  return (
    <div>
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="box is-shadowless">
            <HeaderBetween path={GASFI_PATH} title={"My staking"} />
            <div className="box is-shadowless">History</div>
          </div>

          <div className="columns">
            <div className="column">
              <div className="box is-shadowless">Last position</div>
            </div>
            <div className="column">
              <div className="box is-shadowless">Next drawing at</div>
            </div>
          </div>

          <div className="box is-shadowless">History</div>
        </div>
      </div>
    </div>
  );
};

export default MyStaking;
