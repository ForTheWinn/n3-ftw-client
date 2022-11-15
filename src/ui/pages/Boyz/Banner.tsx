import React from "react";
import { FaSearch } from "react-icons/fa";
interface IBanner {
  filter: any;
  setFilterActive: () => void;
	setFilter: (newFilter: any) => void
}
const Banner = ({ filter, setFilter, setFilterActive }: IBanner) => {
	const onFilterChange = (key: string, val: string) => {
		let arr = [...filter[key]];
		arr = arr.filter((item) => item !== val);
		// newFilter[key] = arr;
		setFilter({
			...filter,
			[key]: arr,
		});
	};
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
                    <a href="https://ghostmarket.io/collection/neo-boyz/">GM</a>
                  </p>
                </div>
                <div className="notification">
                  <div className="field is-grouped is-grouped-multiline">
                    {Object.keys(filter).map((key) => {
                      return filter[key].map((i, index) => {
                        if (!i) return false;
                        return (
                          <div key={`${i}-${index}`} className="control">
                            <div className="tags has-addons">
                              <span className="tag is-primary is-light is-capitalized">
                                {key}
                              </span>
                              <span className="tag is-white">{i}</span>
	                            <span onClick={() => onFilterChange(key, i)} className="tag is-white is-delete"></span>
                            </div>
                          </div>
                        );
                      });
                    })}
                  </div>
                  <button
                    onClick={setFilterActive}
                    className="button is-black"
                  >
                    <span className="icon">
                      <FaSearch />
                    </span>
                    <span>Change filter</span>
                  </button>
                </div>
              </div>
            </div>
            <div
              className="column is-flex is-hidden-mobile"
              style={{ alignItems: "center" }}
            >
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
