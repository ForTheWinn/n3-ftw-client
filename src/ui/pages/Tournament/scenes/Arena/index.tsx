import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import PageLayout from "../../../../components/PageLayout";
import { ARENA_PATH } from "../../pageRoutes";
import { Route, useLocation } from "react-router-dom";
import Players from "./Players";
import History from "./History";
import { useWallet } from "../../../../../packages/provider";
import { TournamentContract } from "../../../../../packages/neo/contracts/ftw/tournament";

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
          <PageLayout>
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
          </PageLayout>
        );
      }, [status, isLoading])}
    </div>
  );
};

export default Arena;
