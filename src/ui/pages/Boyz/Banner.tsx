import React from "react";
const Banner = () => {
  return (
    <section className="hero is-white">
      <div className="hero-body">
        <div className="container">
          <div className="columns">
            <div className="column">
              <div>
                <h1 className="title has-text-primary">Neo Boyz</h1>
                <p className="subtitle">
	                3333 unique collectible characters stored on Neo blockchain.
                </p>
                <div className="content is-small">
                  <p>
                    <strong>Smart contract</strong>
                    <br />
                    <a
                      className="has-text-dark is-size-7"
                      href="https://explorer.onegate.space/contractinfo/0xbebd4eb7c09ca5b59004aa8b58c9bfc81270e5d6"
                    >
                      0xbebd4eb7c09ca5b59004aa8b58c9bfc81270e5d6
                    </a>
                  </p>
                  <p>
                    <strong>Markets</strong>
                    <br />
                    <a
                      // className="has-text-dark is-size-7"
                      href="https://tothemoonuniverse.com/marketplace/rune"
                    >
                      TTM, &nbsp;
                    </a>
                    <a
                      // className="has-text-dark is-size-7"
                      href="https://ghostmarket.io/collection/forthewin-runes/"
                    >
                      GM
                    </a>
                  </p>
                </div>
              </div>
            </div>
	          <div className="column is-flex" style={{ alignItems: "center" }}>
                <figure
                  className="image"
                  style={{ width: "218px", margin: "0 auto" }}
                >
                  <img src="/boyz/FTWBoy.png" />
                </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
