import React from "react";
import PageLayout from "./Commons/PageLayout";
import { TESTNET } from "../../packages/neo/consts";
import { useWallet } from "../../packages/provider";

interface TestnetOnlyRouteProps {
  title: string;
  date?: string;
}
const TestnetOnlyRoute = ({ title, date }: TestnetOnlyRouteProps) => {
  const { switchNetwork } = useWallet();
  return (
    <PageLayout>
      <div className="box is-shadowless">
        <strong>{title}</strong> is not on Mainnet yet.
        <br />
        {date ? (
          <>
            {" "}
            Swap launch is schedule on June 21st 6PM (UTC)
            <br />
          </>
        ) : (
          <></>
        )}
        Before the launch, try it on our testnet.
        <br />
        <br />
        <button
          className="button is-danger"
          onClick={() => switchNetwork(TESTNET)}
        >
          Switch to Testnet
        </button>
      </div>
    </PageLayout>
  );
};

export default TestnetOnlyRoute;
