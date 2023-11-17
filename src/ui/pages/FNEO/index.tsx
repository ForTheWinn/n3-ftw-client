import React from "react";
import PageLayout from "../../components/Commons/PageLayout";
import FNEOCard from "./FNEOCard";
import { useApp } from "../../../common/hooks/use-app";
import Level from "../../components/Level";
import { EVM_FNEO_MAP } from "../../../packages/evm";
import { getChainIdByChain } from "../../../common/helpers";

const FNEO = () => {
  const { network } = useApp();
  const fneoList = Object.keys(EVM_FNEO_MAP).map((key: any) => {
    return {
      chain: key,
      ...EVM_FNEO_MAP[key],
    };
  });
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
              {fneoList.map((c) => {
                return (
                  <div key={c.name} className="column is-6">
                    <FNEOCard
                      chain={c.chain}
                      chainId={getChainIdByChain(c.chain, network)}
                      network={network}
                      name={c.name}
                      hash={c.address[network]}
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
