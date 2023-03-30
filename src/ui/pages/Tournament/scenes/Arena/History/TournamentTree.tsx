import React from "react";
import { IPlayer } from "../../../../../../packages/neo/contracts/ftw/arena/interfaces";
import DisplayRuneWithProperties from "../../../components/DisplayRuneWithProperties";
import { fight } from "../helpers";
import { useWallet } from "../../../../../../packages/neo/provider";

interface ITournamentTree {
  gameNo: string;
  champ: string;
  nonce: string;
  tree: IPlayer[];
  onClick: (obj) => void;
}

function* chunks(arr, n) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

const TournamentTree = ({
  gameNo,
  onClick,
  champ,
  tree,
  nonce
}: ITournamentTree) => {
  const { network } = useWallet();

  let capacity = tree.length;
  let stage: IPlayer[] = tree;
  let winners: IPlayer[] = [];
  let match: IPlayer[] = [];
  let rounds: any[] = [];
  while (capacity >= 2) {
    for (let i = 0; i < capacity; i++) {
      match.push(stage[i]);
      if (match.length === 2) {
        const res = fight(
          match[0].phase,
          match[0].luck,
          match[1].phase,
          match[1].luck,
          nonce,
          gameNo
        );
        if (res === "A") {
          winners.push(match[0]);
        } else {
          winners.push(match[1]);
        }
        match = [];
      }
    }
    // @ts-ignore
    rounds.push([...chunks(stage, 2)]);
    stage = winners;
    winners = [];
    capacity = capacity / 2;
  }
  rounds = rounds.reverse();

  return (
    <>
      <div className="is-flex mb-5" style={{ justifyContent: "safe center" }}>
        <DisplayRuneWithProperties
          network={network}
          onClick={(obj) => {
            onClick(obj);
          }}
          width={"128px"}
          height={"128px"}
          tokenId={champ}
        />
      </div>
      {rounds.map((arena) => {
        return (
          <div className="is-flex mb-5" style={{ justifyContent: "center" }}>
            {arena.map((arr, i) => {
              const winner = fight(
                arr[0].phase,
                arr[0].luck,
                arr[1].phase,
                arr[1].luck,
                nonce,
                gameNo
              );
              return (
                <div
                  className={`is-flex ${arena.length - 1 !== i ? "mr-5" : ""} `}
                >
                  <div style={{ opacity: winner === "A" ? "1" : "0.3" }}>
                    <DisplayRuneWithProperties
                      network={network}
                      onClick={(obj) => {
                        onClick(obj);
                      }}
                      width={"32px"}
                      height={"32px"}
                      tokenId={arr[0].tokenId}
                    />
                  </div>
                  <div style={{ opacity: winner === "B" ? "1" : "0.3" }}>
                    <DisplayRuneWithProperties
                      network={network}
                      onClick={(obj) => {
                        onClick(obj);
                      }}
                      width={"32px"}
                      height={"32px"}
                      tokenId={arr[1].tokenId}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

export default TournamentTree;
