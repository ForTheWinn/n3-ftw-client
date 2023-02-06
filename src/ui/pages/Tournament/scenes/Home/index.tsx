import React from "react";
import { Link } from "react-router-dom";
import { TOURNAMENT_PATH } from "../../../../../consts";
import PageLayout from "../../../../components/Commons/PageLayout";
import { useWallet } from "../../../../../packages/provider";
import { MAINNET } from "../../../../../packages/neo/consts";

const ArenaHome = (props) => {
  const { network } = useWallet();
  let ARENA_LIST = ["4", "8", "16", "32", "64", "128", "256"];
  if (network === MAINNET) {
    ARENA_LIST = ["8", "16", "32", "64", "128"];
  }
  return (
    <div
      style={{
        backgroundImage: 'url("/assets/arena-bg.jpeg")',
        backgroundSize: "cover",
        height: "calc(100vh - 52px)",
        backgroundPosition: "center",
      }}
    >
      <PageLayout>
        {/*<div className="columns is-multiline">*/}
        {ARENA_LIST.map((arena) => {
          return (
            <div
              key={arena}
              // className="column is-4"
            >
              <div
                className="has-text-centered"
                // className={`notification has-text-centered ${ARENA_COLOR[arena]}`}
              >
                <Link
                  to={TOURNAMENT_PATH + "/" + arena}
                  className="title has-text-white"
                >
                  ARENA {arena}
                </Link>
              </div>
            </div>
          );
        })}
      </PageLayout>
    </div>
  );
};

export default ArenaHome;
