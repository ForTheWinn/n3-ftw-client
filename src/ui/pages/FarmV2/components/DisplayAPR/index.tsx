import React, { useEffect, useState } from "react";
import { swapRouter } from "../../../../../common/routers";
import { CHAINS } from "../../../../../consts/chains";
import { INetworkType } from "../../../../../packages/neo/network";
import { numberTrim } from "../../../../../packages/neo/utils";
import { IFarmPair } from "../../../../../common/routers/farm/interfaces";
import { NEP_ADDRESSES } from "../../../../../consts/contracts";

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
    nepTokensPerSecond,
    bonusTokensPerSecond,
    bonusToken,
    hasBonusRewards,
  } = pair;
  const [APR, setAPR] = useState(0);
  const nepAddress = NEP_ADDRESSES[chain][network];

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
          nepStaked = parseFloat(reserveA) * 2;
        } else if (tokenB === nepAddress) {
          nepStaked = parseFloat(reserveB) * 2;
        } else {
          // No NEP in the pool, need to calculate the NEP value. This is hardcode for now.
          const r = await swapRouter.getReserves(
            chain,
            network,
            nepAddress,
            tokenA
          );

          // This is harccoed for now. We need to change when we have non NEP pools that has different decimals than 8.
          const estimated =
            (1_00000000 * parseFloat(r.reserveB)) / parseFloat(r.reserveA);

          nepStaked = parseFloat(reserveA) * 2;

          nepStaked = nepStaked * (1_00000000 / estimated);
        }

        if (hasBonusRewards) {
          // This is harccoed for now. We need to change when we have non NEP pools that has different decimals than 8.

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
  }, [chain, network]);

  return <span className="has-text-success-dark">{numberTrim(APR)}%</span>;
};

export default DisplayAPR;
