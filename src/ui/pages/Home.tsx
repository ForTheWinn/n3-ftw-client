import React, { useEffect } from "react";
import Wave from "react-wavify";
import { Link } from "react-router-dom";
import SocialLinkGroup from "../components/Commons/SocialLinkGroup";
import { NEO_ROUTES } from "../../consts";

const CARDS: {
  title: string;
  type: string;
  desc?: string;
  img: string;
  link: string;
}[] = [
  {
    title: "Mint",
    type: "Utility",
    img: "520/smith.png",
    link: NEO_ROUTES.SMITH_PATH
  },
  {
    title: "Swap",
    type: "DeFi",
    img: "520/swap.png",
    link: NEO_ROUTES.SWAP_PATH
  },
  {
    title: "Staking",
    type: "DeFi",
    img: "520/farm.png",
    link: NEO_ROUTES.FARM_V2_PATH
  },
  {
    title: "Vesting",
    type: "Utility",
    img: "520/rune.png",
    link: NEO_ROUTES.LOCKER_PATH
  },
  {
    title: "DAO",
    type: "Utility",
    img: "520/dao.png",
    link: NEO_ROUTES.DAO_PATH
  },
  {
    title: "NEP",
    type: "Governance token",
    img: "520/nep.png",
    link: "/swap?tokenA=d2a4cff31913016155e38e474a2c06d08be276cf&tokenB=f853a98ac55a756ae42379a312d55ddfdf7c8514"
  }
];

const Home = () => {
  useEffect(() => {
    document.title = "FTW";
  }, []);
  return (
    <>
      <section className="hero is-white is-fullheight-with-navbar is-relative">
        <div className="hero-body">
          <div className="container">
            <div className="has-text-centered mb-6">
              <h1 className="title is-spaced is-size-4-mobile">
                Forthewin Network
              </h1>
              {/*<p className="subtitle is-size-6-mobile">The hub of NEP-17</p>*/}
              <p className="subtitle is-size-6-mobile">
                All-in-one solution for crypto startups
              </p>
            </div>

            <div className="columns is-multiline is-mobile">
              {CARDS.map((card) => {
                return (
                  <div
                    key={card.title}
                    className="column is-2-desktop is-4-mobile"
                  >
                    <div className="is-shadowless">
                      <Link to={card.link}>
                        <figure
                          className="image is-128x128-desktop"
                          style={{ margin: "auto" }}
                        >
                          <img src={card.img} />
                        </figure>
                      </Link>
                      <p className="is-size-6 is-size-7-mobile has-text-centered">
                        <Link className={"has-text-dark"} to={card.link}>
                          {card.title}
                        </Link>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="hero-foot is-hidden-mobile">
          <Wave
            fill="#000"
            paused={false}
            options={{
              height: 10,
              amplitude: 30,
              speed: 0.15
            }}
          />
          <div
            style={{
              width: "100%",
              height: "10px",
              bottom: 0,
              position: "absolute",
              backgroundColor: "black",
              zIndex: 999
            }}
          ></div>
        </div>
      </section>

      <div
        className="section has-background-black"
        style={{ paddingBottom: "100px" }}
      >
        <div className="container">
          <div className="columns">
            <div className="column is-4">
              <div>
                <img
                  alt="FORTHEWIN"
                  src="/kit/FORTHEWIN_White.png"
                  width={"150px"}
                />
              </div>
              <br />
              <SocialLinkGroup inverted={true} />
            </div>
            <div className="column is-2">
              <h6 className="title is-6 has-text-white">DeFi</h6>
              <ul className="footer-links">
                <li>
                  <Link to={NEO_ROUTES.SWAP_PATH} className="has-text-white">
                    Swap
                  </Link>
                </li>
                <li>
                  <Link to={NEO_ROUTES.FARM_V2_PATH} className="has-text-white">
                    Farm
                  </Link>
                </li>
                <li>
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href={"https://bridge.poly.network/"}
                    className="has-text-white"
                  >
                    NEP Bridge
                  </a>
                </li>
              </ul>
            </div>
            <div className="column is-2">
              <h6 className="title is-6 has-text-white">Web3 tools</h6>
              <ul className="footer-links">
                <li>
                  <Link to={NEO_ROUTES.SMITH_PATH} className="has-text-white">
                    Token Launcher
                  </Link>
                </li>
                <li>
                  <Link to={NEO_ROUTES.SMITH_PATH} className="has-text-white">
                    Locker
                  </Link>
                </li>
              </ul>
            </div>
            <div className="column is-2">
              <h6 className="title is-6 has-text-white">NFTs</h6>
              <ul className="footer-links">
                <li>
                  <Link to={NEO_ROUTES.GALLERY_PATH} className="has-text-white">
                    Runes
                  </Link>
                </li>
                <li>
                  <Link to={NEO_ROUTES.BOYZ_PATH} className="has-text-white">
                    Neo Boyz
                  </Link>
                </li>
                <li>
                  <a
                    href={"https://tothemoonuniverse.com/fusion"}
                    className="has-text-white"
                  >
                    Fusion Portal
                  </a>
                </li>
              </ul>
            </div>
            <div className="column is-2">
              <h6 className="title is-6 has-text-white">General</h6>
              <ul className="footer-links">
                <li>
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href="https://docs.forthewin.network/"
                    className="has-text-white"
                  >
                    Document
                  </a>
                </li>
                <li>
                  <Link
                    to={NEO_ROUTES.BRAND_KIT_PATH}
                    className="has-text-white"
                  >
                    Brand Kit
                  </Link>
                </li>
                <li>
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href={"https://neonewstoday.com/?s=forthewin"}
                    className="has-text-white"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href={"https://test.forthewin.network"}
                    className="has-text-white"
                  >
                    TestNet
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
