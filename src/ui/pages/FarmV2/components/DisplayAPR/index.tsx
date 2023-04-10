import { u } from "@cityofzion/neon-core";
import React, { useEffect, useState } from "react";
import { swapRouter } from "../../../../../common/routers";
import { CHAINS } from "../../../../../consts/chains";
import { INetworkType } from "../../../../../packages/neo/network";
import { numberTrim } from "../../../../../packages/neo/utils";
import { IFarmPair } from "../../../../../common/routers/farm/interfaces";
import { NEP_CONTRACT_HASH } from "../../../../../consts/contracts";
import { getLPEstimate } from "../../../../../packages/polygon/contracts/swap";

interface IDisplayAPRProps {
  chain: CHAINS;
  network: INetworkType;
  pair: IFarmPair;
  // prices: IPrices;
  // nepPrice: number;
}

const ONE_YEAR_IN_SECONDS = 31536000;

const DisplayAPR = ({
  chain,
  network,
  // prices,
  pair
}: // nepPrice
IDisplayAPRProps) => {
  const {
    tokenA,
    tokenB,
    tokensStaked,
    nepTokensPerSecond,
    bonusTokensPerSecond,
    bonusToken,
    hasBonusRewards
  } = pair;
  const [APR, setAPR] = useState(0);
  const nepAddress = NEP_CONTRACT_HASH[chain][network];

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
          const estimated = getLPEstimate(1_00000000, r.reserveA, r.reserveB);

          nepStaked =
            ((parseFloat(reserveA) * parseFloat(tokensStaked)) /
              parseFloat(shares)) *
            2;

          nepStaked = nepStaked * (1_00000000 / parseFloat(estimated));
        }
        if (hasBonusRewards) {
          const r = await swapRouter.getReserves(
            chain,
            network,
            nepAddress,
            bonusToken
          );
           const estimated = getLPEstimate(1_00000000, r.reserveA, r.reserveB);

          let bonusRewards = parseFloat(bonusTokensPerSecond) * ONE_YEAR_IN_SECONDS;

          nepRewards = nepRewards + (bonusRewards * (1_00000000 / parseFloat(estimated)));

        }

        setAPR((nepRewards / nepStaked) * 100);
      } catch (e: any) {
        console.error(e);
      }
    }
    checkTxid();
  }, []);

  return <>{numberTrim(APR)}%</>;
};

export default DisplayAPR;
