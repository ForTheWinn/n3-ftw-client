import React from "react";
import PageLayout from "../../../components/Commons/PageLayout";

const Fusion = () => {
  return (
    <PageLayout>
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="box is-shadowless">
            <h1 className="title">Fusion</h1>
            <p className="subtitle heading">
              Fuse a Rune & Cryptonaut NFT to create a Fusion Cryptonaut. <br />{" "}
              Battle to earn Experience, Rank, Rewards and Glory.
            </p>

            <div className="columns is-mobile">
              <div className="column">
                <img src="/assets/cryptonaut.png" />
              </div>
              <div className="column">
                <img src="/assets/rune.svg" />
              </div>
              <div className="column">
                <img src="/assets/fusion.png" />
              </div>
            </div>

            <div className="content is-small">
              <h6>2 Components required to form a Fusion Cryptonaut</h6>
              <ul>
                <li>Rune</li>
                <li>Cryptonaut</li>
              </ul>
              <h6>
                28 Different Possible Fusion Cryptonaut Types exist and can be
                fused
              </h6>
              <p>
                The Type of Fusion Cryptonaut you can fuse is determined by the
                Rune Attributes (Phase and Luck) as well as Cryptonaut
                Attributes (Total Cryptonaut Points)
              </p>
              <h6>Fusion Attributes</h6>
              <ol>
                <li>
                  Fusion attributes 1. Fusion Phase = Rune Phase (Element)
                </li>
                <li>Battle Position = Total Cryptonaut Points + Luck</li>
              </ol>
              <ul>
                <li>4–7 (Total Cryptonaut Points + Luck) = Attack</li>
                <li> 8–11 (Total Cryptonaut Points + Luck) = Defense</li>
                <li>12–15 (Total Cryptonaut Points + Luck) = Agility</li>
                <li>16–19 (Total Cryptonaut Points + Luck) = Endurance</li>
              </ul>

              <h6>Where to fuse</h6>
              <p>
                <a
                  target="_blank"
                  href="https://tothemoonuniverse.com/fusion"
                  rel="noreferrer"
                >
                  TTM Fusion Portal
                </a>
              </p>
              <h6>Markets</h6>
              <p>
                <a
                  href="https://tothemoonuniverse.com/marketplace/fusion"
                >
                  TTM, &nbsp;
                </a>
                <a
                  href="https://ghostmarket.io/collection/fusion/"
                >
                  GM
                </a>
              </p>
              <p>
                <strong>Press</strong>
                <br />
                <a
                  href="https://neonewstoday.com/nft/tothemoon-and-forthewin-launch-new-fused-cryptonaut-collaboration/"
                >
                  Article 1, &nbsp;
                </a>
                <a
                  href="https://neonewstoday.com/gaming/tothemoon-launches-arenas-for-fused-cryptonaut-nfts-to-compete-for-gas/"
                >
                  Article 2
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Fusion;
