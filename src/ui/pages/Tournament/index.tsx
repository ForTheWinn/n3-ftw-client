import React, { useEffect } from "react";

const Tournament = () => {
  useEffect(() => {
    document.title = "FTW | Arenas";
  }, []);
  return (
    <section className="hero is-white is-fullheight-with-navbar">
      <div className="hero-body">
        <div className="container">
          <div className="columns">
            <div className="column">
              <div>
                <h1 className="title">Arenas</h1>
                <p>New arenas will be hosted in TOTHEMOON Universe</p>
	              <p>-</p>
                <p>
                  TOTHEMOON is a strategic community-building NFT game built on
                  Neo N3, where collectors engage with a moon-themed metaverse.
                  The TOTHEMOON team aims to establish this metaverse by
                  layering and integrating NFTs in a way that establishes a
                  thriving supply and demand economy.
                  <br />
                  <a className="has-text-info" href="https://tothemoonuniverse.com/">click to the moon</a>
                </p>
                <p>-</p>
                <p className="mb-2">Review legacy arena</p>
                <div className="content is-small">
                  <a href="https://neonewstoday.com/nft/ftw-arena-tickets-now-on-sale/">
                    Article 1, &nbsp;
                  </a>
                  <a href="https://neonewstoday.com/gaming/forthewin-opens-the-arena-allowing-runes-to-battle-for-gas-prizes/">
                    2
                  </a>
                  <br />
                  <a
                    className="has-text-dark is-size-7"
                    href="https://explorer.onegate.space/contractinfo/0x0eb288c413b5d5ec4aa0df5aea34d9538b28dd29"
                  >
                    0x0eb288c413b5d5ec4aa0df5aea34d9538b28dd29
                  </a>
                </div>
              </div>
            </div>
            <div className="column">
              <figure className="image">
                <img src={"/assets/fusion.png"} />
              </figure>
              <p className="is-size-7 is-italic has-text-centered">
                Fused a cryptonaut and a rune
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tournament;
