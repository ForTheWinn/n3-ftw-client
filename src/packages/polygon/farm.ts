import { readContract, prepareWriteContract, writeContract } from "@wagmi/core";
import { POLYGON_FARM_CONTRACT_HASH } from ".";
import { TOKEN_LIST } from "../../consts/tokens";
import { POLYGON_CHAIN } from "../chains/consts";
import { IPoolEnhanced } from "../neo/contracts/ftw/farm-v2/interfaces";
import { withDecimal } from "../neo/utils";
import FTWFarmABI from "./FTWFarm.json";

export const getPools = async (): Promise<any> => {
  const res: any = await readContract({
    address: POLYGON_FARM_CONTRACT_HASH,
    abi: FTWFarmABI,
    functionName: "getAllPoolIds",
    args: []
  });

  const pools: IPoolEnhanced[] = [];

  for (const pairId of res) {
    const pool: any = await readContract({
      address: POLYGON_FARM_CONTRACT_HASH,
      abi: FTWFarmABI,
      functionName: "getPool",
      args: [pairId]
    });
    const hasBonusRewards = pool.bonusTokensPerSecond > 0;
    pools.push({
      tokenA: pool.tokenA,
      tokenB: pool.tokenB,
      tokenASymbol: TOKEN_LIST[POLYGON_CHAIN][pool.tokenA].symbol,
      tokenBSymbol: TOKEN_LIST[POLYGON_CHAIN][pool.tokenB].symbol,
      lastRewardedAt: pool.lastRewardedAt,
      tokensStaked: pool.tokensStaked,
      nepTokensPerSecond: pool.nepTokensPerSecond,
      bonusToken: pool.bonusToken,
      bonusTokenSymbol: TOKEN_LIST[POLYGON_CHAIN][pool.bonusToken].symbol,
      bonusTokenDecimals: TOKEN_LIST[POLYGON_CHAIN][pool.bonusToken].decimals,
      bonusTokensPerSecond: pool.bonusTokensPerSecond,
      nepRewardsPerDay: withDecimal(pool.nepTokensPerSecond * 86400, 8, true),
      bonusRewardsPerDay: hasBonusRewards
        ? withDecimal(
            pool.bonusTokensPerSecond * 86400,
            pool.bonusTokenDecimals,
            true
          )
        : "0",
      hasBonusRewards: hasBonusRewards,
      tokenALogo: TOKEN_LIST[POLYGON_CHAIN][pool.tokenA].icon,
      tokenBLogo: TOKEN_LIST[POLYGON_CHAIN][pool.tokenB].icon
    });
  }

  return pools;
};

export const stake = async (tokenId: string): Promise<string> => {
  const config = await prepareWriteContract({
    address: POLYGON_FARM_CONTRACT_HASH,
    abi: FTWFarmABI,
    functionName: "stake",
    args: [tokenId]
  });
  const { hash } = await writeContract(config);
  return hash as string;
};
