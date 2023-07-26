import React from "react";
import PageLayout from "../../components/Commons/PageLayout";
import FNEOCard from "./FNEOCard";
import { useApp } from "../../../common/hooks/use-app";
import { FNEO_CHAINS } from "../../../packages/ftwNEO/consts";
import Level from "../../components/Level";

const FNEO = () => {
  const { network } = useApp();
  return (
    <div>
      <PageLayout>
        <div className="columns is-centered">
          <div className="column is-8">
            <div className="box is-shadowless">
              <Level
                left={
                  <>
                    <h5 className="title is-5">ftwNEO</h5>
                    <p className="subtitle is-7">
                      Parallelize NEO on EVM chains. Acquire your ftwNEO and
                      claim your NEP rewards.
                    </p>
                  </>
                }
                right={<button className="button is-light">Learn more</button>}
              />
            </div>
            <div className="columns">
              {FNEO_CHAINS.map((chain) => {
                return (
                  <div className="column is-6">
                    <FNEOCard
                      name={chain.name}
                      hash={chain.address[network]}
                      chainId={chain.chainId[network]}
                      perBlock={chain.perBlock[network]}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default FNEO;
