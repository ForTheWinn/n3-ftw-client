import React from 'react';
import {ETH_WALLET_LIST} from "../../../eth/consts";
import { getWalletIcon } from './helpers';

const ETHWallets = (props) => {

	return (
		<div>
			<h1 className="title is-6">ETH wallets</h1>
			{ETH_WALLET_LIST.map((_wallet) => {
				return (
					<div key={_wallet.key} className="mb-1">
						<button
							className="button is-fullwidth"
						>
							<span className="panel-icon">
								<img src={getWalletIcon(_wallet.key)} />
							</span>
							{_wallet.label}
						</button>
					</div>
				);
			})}
		</div>
	);

};

export default ETHWallets;
