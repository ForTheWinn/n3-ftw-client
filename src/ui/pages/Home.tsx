import React, { useEffect } from "react";
import Wave from "react-wavify";
import { Link } from "react-router-dom";
import SocialLinkGroup from "../components/Commons/SocialLinkGroup";
import { useApp } from "../../common/hooks/use-app";
import {
  BOYZ_PATH,
  BRAND_KIT_PATH,
  FARM_V2_PATH,
  RUNE_PATH,
  SMITH_PATH,
  SWAP_PATH,
} from "../../consts/routes";
import { NEO_CHAIN, POLYGON_CHAIN } from "../../consts/global";

const Home = () => {
  useEffect(() => {
    document.title = "FTW";
  }, []);
  const { chain } = useApp();
  return (
    <>
      <section className="hero is-white is-fullheight-with-navbar is-relative">
        <div className="hero-body">
          <div className="container">
            <div className="has-text-centered mb-6">
              <h1 className="title is-spaced is-size-4-mobile">
                Forthewin Network
              </h1>
              <p className="is-accent is-size-6-mobile">
                DeFi / Web3 Tools / Cool NFTs
              </p>

              <>
                <p>-</p>
                <div className="mt-3">
                  <img alt="Neo Boyz #1065" width={150} src="/boyz/1065.png" />
                  <br />
                  <p className="is-accent is-size-6-mobile">Neo Boyz #1065</p>
                </div>
              </>
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
              speed: 0.15,
            }}
          />
          <div
            style={{
              width: "100%",
              height: "10px",
              bottom: 0,
              position: "absolute",
              backgroundColor: "black",
              zIndex: 999,
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
                  <Link to={SWAP_PATH} className="has-text-white">
                    Swap
                  </Link>
                </li>
                <li>
                  <Link to={FARM_V2_PATH} className="has-text-white">
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
                  <Link to={SMITH_PATH} className="has-text-white">
                    Token Launcher
                  </Link>
                </li>
                <li>
                  <Link to={SMITH_PATH} className="has-text-white">
                    Locker
                  </Link>
                </li>
              </ul>
            </div>
            <div className="column is-2">
              <h6 className="title is-6 has-text-white">NFTs</h6>
              <ul className="footer-links">
                <li>
                  <Link to={RUNE_PATH} className="has-text-white">
                    Runes
                  </Link>
                </li>
                <li>
                  <Link to={BOYZ_PATH} className="has-text-white">
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
                  <Link to={BRAND_KIT_PATH} className="has-text-white">
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
