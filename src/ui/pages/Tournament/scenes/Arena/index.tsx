import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import { ARENA_PATH } from "../../pageRoutes";
import { Route, useLocation } from "react-router-dom";
import Players from "./Players";
import History from "./History";
import { useWallet } from "../../../../../packages/neo/provider";
import { TournamentContract } from "../../../../../packages/neo/contracts/ftw/arena";

const Arena = (props) => {
  const location = useLocation();
  let { arenaNo } = props.match.params;
  arenaNo = arenaNo ? arenaNo : props.defaultArena;
  const [status, setStatus] = useState<{
    prize: number;
    gameNo: number;
    previousChampWallet?: string;
    timeElapsedFromPreviousGame?: string;
  }>();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { network } = useWallet();
  useEffect(() => {
    async function fetchBetAmount() {
      setError("");
      setLoading(true);
      try {
        const res = await new TournamentContract(network).getCurrentPrize(
          arenaNo
        );
        setStatus(res);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBetAmount();
  }, [network, location.pathname]);
  return (
    <div>
      <Banner pathname={location.pathname} status={status} arenaNo={arenaNo} />
      {React.useMemo(() => {
        return (
          <>
            {isLoading ? (
              <div>Loading..</div>
            ) : (
              <>
                <Route
                  exact
                  path={ARENA_PATH}
                  component={() => (
                    <Players
                      arenaNo={arenaNo}
                      gameNo={status ? status.gameNo : undefined}
                    />
                  )}
                />
                <Route
                  path={ARENA_PATH + "/history"}
                  component={() => <History arenaNo={arenaNo} />}
                />
              </>
            )}
          </>
        );
      }, [status, isLoading])}
    </div>
  );
};

export default Arena;
