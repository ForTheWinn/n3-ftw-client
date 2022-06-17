import React from "react";
import { RUNE_PRICE } from "../../../packages/neo/contracts/ftw/rune/consts";
import { INetworkType } from "../../../packages/neo/network";
import DisplayRandomRune from "../../components/RandomRune";
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
          <div>
            <h1 className="title">FTW Runes</h1>
            <p className="subtitle">Algorithms-generated, stored onchain NFT</p>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
