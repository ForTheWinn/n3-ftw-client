import React from "react";
import { FaSearch } from "react-icons/fa";
interface IBanner {
  filter: any;
  setFilterActive: () => void;
}
const Banner = ({ filter, setFilterActive }: IBanner) => {
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
                      href="https://explorer.onegate.space/contractinfo/0xcab9f861120e6fe725995878c2024e66c0be1306"
                    >
                      0xcab9f861120e6fe725995878c2024e66c0be1306
                    </a>
                  </p>
                  <p>
                    <strong>Markets</strong>
                    <br />
                    <a
                      href="https://ghostmarket.io/collection/neo-boyz/"
                    >
                      GM
                    </a>
                  </p>
                </div>
                <button onClick={setFilterActive} className="button is-primary">
                  <span className="icon">
                    <FaSearch />
                  </span>
                  <span>Filter</span>
                </button>
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
      <div className="hero-foot pb-5">
        <div className="container">
          <div className="field is-grouped is-grouped-multiline">
            {Object.keys(filter).map((key) => {
              return filter[key].map((i, index) => {
                if (!i) return false;
                return (
                  <div key={`${i}-${index}`} className="control">
                    <div className="tags has-addons">
                      <span className="tag is-primary is-light is-capitalized">{key}</span>
                      <span className="tag is-light">{i}</span>
                    </div>
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
