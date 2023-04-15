import React from "react";

const BridgeMain = (props) => {
  return (
    <div>
      <div className="level is-mobile">
        <div className="level-left">
          <div className="level-item">
            <h1 className="title is-5 is-marginless ">Bridge</h1>
          </div>
        </div>
        <div className="level-right is-hidden-mobile">
          <div className="level-item"></div>
        </div>
      </div>

	    <div className="columns is-multiline">
		    <div className="column is-12">
			    <div className="heading">Asset</div>
					<button className="button is-fullwidth">
						NEP
					</button>
		    </div>
		    <div className="column is-6">
			    <div className="heading">From</div>
			    <button className="button is-fullwidth">
				    NEP
			    </button>
		    </div>

		    <div className="column is-6">
			    <div className="heading">To</div>
			    <button className="button is-fullwidth">
				    NEP
			    </button>
		    </div>
		    <div className="column is-12">
			    <div className="heading">Amount</div>
			    <button className="button is-fullwidth">
				    NEP
			    </button>
		    </div>
	    </div>
	    <hr/>
	    <button className="button is-primary is-fullwidth">Next</button>
    </div>
  );
};

export default BridgeMain;
