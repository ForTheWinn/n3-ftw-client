import React from "react";
import { INetworkType } from "../../../packages/neo/network";
interface IBannerProps {
  network: INetworkType;
  filter: string;
  onMint: () => void;
  onFilterChange: (val: string) => void;
}
const Banner = ({ onMint, network }: IBannerProps) => {
  return (
    <section className="hero is-white">
      <div className="hero-body">
        <div className="container">
          <div className="columns">
            <div className="column">
              <div>
                <h1 className="title">FTW Runes</h1>
                <p className="subtitle">
                  Algorithms-generated, stored onchain NFT
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
                    <strong>Max supply</strong>
                    <br />
                    500 runes (Sold out)
                  </p>
                  <p>
                    <strong>Attribute #1</strong>
                    <br />
                    Dark, Light, Fire, Water, Wood, Earth, Metal
                  </p>
                  <p>
                    <strong>Attribute #2</strong>
                    <br /> Luck (1 ~ 10)
                  </p>
                  <p>
                    <strong>Press</strong>
                    <br />
                    <a
                      // className="has-text-dark is-size-7"
                      href="https://neonewstoday.com/general/forthewin-network-launches-token-generator-and-ftw-rune-with-image-stored-onchain"
                    >
                      Article 1, &nbsp;
                    </a>
                    <a
                      // className="has-text-dark is-size-7"
                      href="https://neonewstoday.com/nft/ftw-arena-tickets-now-on-sale/"
                    >
                      Article 2
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
                  style={{ width: "250px", margin: "0 auto" }}
                >
                  <img src="/logo/NEP_Logo_Runes.svg" />
                </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
