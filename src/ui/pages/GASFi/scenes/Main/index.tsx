import React, { useEffect, useState } from "react";
import StakeHeader from "./StakeHeader";
import { useWallet } from "../../../../../packages/provider";
import { GasFiContract } from "../../../../../packages/neo/contracts/ftw/gas-fi";
import {
  IStakeResult,
  IStatusResult,
} from "../../../../../packages/neo/contracts/ftw/gas-fi/interfaces";
import DrawHistory from "./DrawHistory";

export interface IMainData {
  status: IStatusResult;
  staking?: IStakeResult;
}
const Main = (props) => {
  const { network, connectedWallet } = useWallet();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<IMainData | undefined>(undefined);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const res1 = await new GasFiContract(network).getStatus();
        const res2 = connectedWallet
          ? await new GasFiContract(network).getStake(connectedWallet)
          : undefined;
        setData({
          status: res1,
          staking: res2,
        });
        setLoading(false);
      } catch (e: any) {
        console.log(e);
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
          <StakeHeader isLoading={isLoading} data={data} />
          <div className="columns content has-text-centered">
	          <div className="column">
		          <div className="box is-shadowless">
			          <h6>Last draw #</h6>
			          <p>{data ? data.status.lastDrawNo : ""}</p>
		          </div>
	          </div>
            <div className="column">
              <div className="box is-shadowless">
                <h6>Last position</h6>
                <p>{data ? data.status.lastPosition : ""}</p>
              </div>
            </div>
            <div className="column">
              <div className="box is-shadowless">
                <h6>Next drawing</h6>
                <p>{data ? data.status.lastReward : ""}</p>
              </div>
            </div>
          </div>
          <div className="box is-shadowless">
	          <DrawHistory network={network} />

					</div>
        </div>
      </div>
    </div>
  );
};

export default Main;
