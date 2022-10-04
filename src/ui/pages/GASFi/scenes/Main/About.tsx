import React from "react";

const About = (props) => {
  return (
    <div>
      <h5 className="title is-5">FTW GAS-Fi</h5>
      <p className="subtitle is-6">
        Stake your bNEO. Bet your GAS dividends. Winners take all.
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
          <li>Drawing will be held a week after from the last drawing.</li>
	        <li>
		        Drawing frequency can be changed anytime by admin.
	        </li>
          <li>Users can unstake bNEO a week later from the staking.</li>
          <li>
            Winners can share all GAS dividend proportionally depending on
            staking amount.
          </li>
        </ul>
        <h6>Contract info</h6>
        <ul>
          <li>
	          <p>
		          <a target="_blank" href={"https://explorer.onegate.space/contractinfo/0xbc54874a9505e668bc0af9301ff261fcc4a640ee"}>
			          0xbc54874a9505e668bc0af9301ff261fcc4a640ee
		          </a>
	          </p>

          </li>
        </ul>
      </div>
    </div>
  );
};

export default About;
