import React from "react";
import PageLayout from "./Commons/PageLayout";

interface TestnetOnlyRouteProps {
  title: string;
  date?: string;
}
const TestnetOnlyRoute = ({ title, date }: TestnetOnlyRouteProps) => {
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
      </div>
    </PageLayout>
  );
};

export default TestnetOnlyRoute;
