import React from 'react';

const About = (props) => {

	return (
		<div>
			<h5 className="title is-5">FTW GAS-Fi</h5>
			<p className="subtitle is-6">
				Stake your bNEO and bet your GAS dividends. Winners take all.
			</p>

			<div className="content">
				<h6>How to participate</h6>
				<ul>
					<li>Enter your bNEO amount you want to stake.</li>
					<li>Choose your position.</li>
					<li>Claim your GAS after drawings.</li>
				</ul>
				<h6>Rules</h6>
				<ul>
					<li>Drawing will be made a week after from the last drawing.</li>
					<li>Users can unstake your bNEO a week later from your stake.</li>
					{/*<li>Users can unstake your bNEO a week later from your stake.</li>*/}
				</ul>
				{/*<li>*/}
				{/*	<a target="_blank" href={"https://docs.forthewin.network/smith"}>*/}
				{/*		Tutorial for token contract*/}
				{/*	</a>*/}
				{/*</li>*/}
				{/*<li>*/}
				{/*	<a*/}
				{/*		target="_blank"*/}
				{/*		href={*/}
				{/*			"https://medium.com/@Forthewin_network/diy-nft-smart-contract-on-neo-without-codes-82957811f5ff"*/}
				{/*		}*/}
				{/*	>*/}
				{/*		Tutorial for NFT contract*/}
				{/*	</a>*/}
				{/*</li>*/}
				{/*<li>*/}
				{/*	<a*/}
				{/*		target="_blank"*/}
				{/*		href={"https://www.youtube.com/watch?v=yqZJE7NXu5o"}*/}
				{/*	>*/}
				{/*		Tutorials on Youtube*/}
				{/*	</a>*/}
				{/*</li>*/}
			</div>
		</div>
	);

};

export default About;
