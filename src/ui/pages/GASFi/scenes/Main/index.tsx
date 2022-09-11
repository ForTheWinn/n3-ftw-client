import React, {useEffect, useState} from "react";
import StakeHeader from "./StakeHeader";
import { useWallet } from "../../../../../packages/provider";
import { GasFiContract } from "../../../../../packages/neo/contracts/ftw/gas-fi";
import {IStakeResult} from "../../../../../packages/neo/contracts/ftw/gas-fi/interfaces";

export interface IMainData {
	staking: IStakeResult
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

	        <StakeHeader isLoading={isLoading} data={data} />

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

export default Main;
