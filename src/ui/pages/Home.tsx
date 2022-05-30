import React from "react";
import PageLayout from "../components/PageLayout";
import BgContainer from "../components/BgContainer";
import {
  GALLERY_PATH,
  SMITH_PATH,
  SWAP_PATH,
  TOURNAMENT_PATH,
} from "../../consts";
import { ARENA_PATH } from "./Tournament/pageRoutes";
import { Link } from "react-router-dom";
import { useWallet } from "../../packages/provider";
import { TESTNET } from "../../packages/neo/consts";
import toast from "react-hot-toast";

const CARDS = [
  {
    title: "FTW Swap",
    type: "DeFi",
    desc: "Coming soon. Try on our Testnet.",
    img: "symbols/nep.png",
    link: SWAP_PATH,
  },
  {
    title: "FTW Smith",
    type: "Utility",
    desc: "Deploy fungible/Non-fungible token smart contracts without any codes.",
	  img: "symbols/smith.png",
    link: SMITH_PATH,
  },
  {
    title: "FTW Rune",
    type: "NFT",
    desc: "An algorithmically generated NFT created and stored onchain.",
    img: "assets/runes.png",
    link: GALLERY_PATH,
  },
  {
    title: "FTW Arena",
    type: "GameFi",
    desc: "FTW Runes against each other with the victor earning a GAS prize.",
    img: "assets/arena-bg.jpeg",
    link: TOURNAMENT_PATH,
  },
  // {
  //   title: "FTW Lab",
  //   type: "Testnet",
  //   desc: "Preview FTW future apps.",
  //   img: "assets/testnet.png",
  //   link: SMITH_PATH,
  // },
];

const Home = () => {
  return (
    <div>
      <section className="hero is-black">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Forthewin Network</h1>
            <p className="subtitle">
              Building some cool decentralized stuff on NEO blockchain.{" "}
            </p>
          </div>
        </div>
      </section>
      <PageLayout>
        <div className="columns is-multiline">
          {CARDS.map((card) => {
            return (
              <div key={card.title} className="column is-2">
                <div className="card">
                  <div className="card-image is-clickable">
                    <Link to={card.link}>
                      <figure className="image">
                        <BgContainer src={card.img} height="250px" />
                      </figure>
                    </Link>
                  </div>
                  <div className="card-content">
                    <div className="media">
                      <div className="media-content">
                        <p className="title is-6 heading">
                          <Link className={"has-text-dark"} to={card.link}>
                            {card.title}
                          </Link>
                        </p>
                        <span className="tag is-primary">{card.type}</span>
                      </div>
                    </div>
                    <div className="content" style={{ minHeight: "100px" }}>
                      {card.desc}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PageLayout>
    </div>
  );
};

export default Home;
