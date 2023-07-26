import { u } from "@cityofzion/neon-core";
import React, { useEffect, useState } from "react";
import { swapRouter } from "../../../../../common/routers";
import { CHAINS } from "../../../../../consts/chains";
import { INetworkType } from "../../../../../packages/neo/network";
import { numberTrim } from "../../../../../packages/neo/utils";
import { IFarmPair } from "../../../../../common/routers/farm/interfaces";
import { GLOBAL_NEP_CONTRACT_ADDRESS } from "../../../../../consts/contracts";

interface IDisplayAPRProps {
  chain: CHAINS;
  network: INetworkType;
  pair: IFarmPair;
}

const ONE_YEAR_IN_SECONDS = 31536000;

const DisplayAPR = ({ chain, network, pair }: IDisplayAPRProps) => {
  const {
    tokenA,
    tokenB,
    tokensStaked,
    nepTokensPerSecond,
    bonusTokensPerSecond,
    bonusToken,
    hasBonusRewards,
  } = pair;
  const [APR, setAPR] = useState(0);
  const nepAddress = GLOBAL_NEP_CONTRACT_ADDRESS[chain][network];

  useEffect(() => {
    async function checkTxid() {
      try {
        const { reserveA, reserveB, shares } = await swapRouter.getReserves(
          chain,
          network,
          tokenA,
          tokenB
        );

        let nepRewards = parseFloat(nepTokensPerSecond) * ONE_YEAR_IN_SECONDS;

        let nepStaked = 0;

        if (tokenA === nepAddress) {
          nepStaked =
            ((parseFloat(reserveA) * parseFloat(tokensStaked)) /
              parseFloat(shares)) *
            2;
        } else if (tokenB === nepAddress) {
          nepStaked =
            ((parseFloat(reserveB) * parseFloat(tokensStaked)) /
              parseFloat(shares)) *
            2;
        } else {
          const r = await swapRouter.getReserves(
            chain,
            network,
            nepAddress,
            tokenA
          );
          const estimated =
            (1_00000000 * parseFloat(r.reserveB)) / parseFloat(r.reserveA);

          nepStaked =
            ((parseFloat(reserveA) * parseFloat(tokensStaked)) /
              parseFloat(shares)) *
            2;

          nepStaked = nepStaked * (1_00000000 / estimated);
        }
        if (hasBonusRewards) {
          const r = await swapRouter.getReserves(
            chain,
            network,
            nepAddress,
            bonusToken
          );

          const estimated =
            (1_00000000 * parseFloat(r.reserveB)) / parseFloat(r.reserveA);

          let bonusRewards =
            parseFloat(bonusTokensPerSecond) * ONE_YEAR_IN_SECONDS;

          nepRewards = nepRewards + bonusRewards * (1_00000000 / estimated);
        }

        setAPR((nepRewards / nepStaked) * 100);
      } catch (e: any) {
        console.error(e);
      }
    }
    checkTxid();
  }, []);

  return <span className="has-text-success-dark">{numberTrim(APR)}%</span>;
};

export default DisplayAPR;
