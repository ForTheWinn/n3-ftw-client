import { readContract, prepareWriteContract, writeContract } from "@wagmi/core";
import { POLYGON_FARM_CONTRACT_HASH } from ".";
import { IClaimable, IFarmLPToken } from "../../common/routers/farm/interfaces";
import { TOKEN_LIST } from "../../consts/tokens";
import { POLYGON_CHAIN } from "../../consts/chains";
import {
  IClaimableRewards,
  IPoolEnhanced
} from "../neo/contracts/ftw/farm-v2/interfaces";
import { withDecimal } from "../neo/utils";
import FTWFarmABI from "./FTWFarm.json";
import { getTokenURI } from "./swap";
import { Buffer } from "buffer";
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

    const tokenA = TOKEN_LIST[POLYGON_CHAIN][pool.tokenA];
    const tokenB = TOKEN_LIST[POLYGON_CHAIN][pool.tokenB];
    const bonusToken = TOKEN_LIST[POLYGON_CHAIN][pool.bonusToken];

    if (tokenA && tokenB) {
      const hasBonusRewards = pool.bonusTokensPerSecond > 0;
      pools.push({
        tokenA: pool.tokenA,
        tokenB: pool.tokenB,
        tokenASymbol: tokenA.symbol,
        tokenBSymbol: tokenB.symbol,
        lastRewardedAt: pool.lastRewardedAt,
        tokensStaked: pool.tokensStaked,
        nepTokensPerSecond: pool.nepTokensPerSecond,
        bonusToken: pool.bonusToken,
        bonusTokenSymbol: bonusToken.symbol,
        bonusTokenDecimals: bonusToken.decimals,
        bonusTokensPerSecond: pool.bonusTokensPerSecond,
        nepRewardsPerDay: withDecimal(
          pool.nepTokensPerSecond.toNumber() * 86400,
          8,
          true
        ),
        bonusRewardsPerDay: hasBonusRewards
          ? withDecimal(
              pool.bonusTokensPerSecond.toNumber() * 86400,
              bonusToken.decimals
            )
          : "0",
        hasBonusRewards: hasBonusRewards,
        tokenALogo: tokenA.icon,
        tokenBLogo: tokenB.icon
      });
    }
  }

  return pools;
};

export const getStakedTokens = async (
  address: string
): Promise<IFarmLPToken[]> => {
  const res: any = await readContract({
    address: POLYGON_FARM_CONTRACT_HASH,
    abi: FTWFarmABI,
    functionName: "getStakedTokens",
    args: [address]
  });
  const tokens: IFarmLPToken[] = [];

  for (const tokenId of res) {
    const token = await getTokenURI(tokenId.toString());
    tokens.push(token);
  }

  return tokens;
};

//   tokenA: string;
//   tokenB: string;
//   tokenASymbol: string;
//   tokenBSymbol: string;
//   bonusToHarvest: number;
//   bonusTokenHash: string;
//   bonusTokenSymbol: string;
//   rewardsToHarvest: number;
//   share: number;
//   tokensStaked: number;
//   nepTokensPerSecond: number;
// bonusTokensPerSecond: number;

export const getClaimable = async (address: string): Promise<IClaimable> => {
  const res: any = await readContract({
    address: POLYGON_FARM_CONTRACT_HASH,
    abi: FTWFarmABI,
    functionName: "getClaimable",
    args: [address]
  });
  console.log(res);
  const rewards: IClaimableRewards[] = [];
  res.map((reward: any) => {
    const obj = {
      pairId: reward.pairId,
      tokenA: reward.tokenA,
      tokenB: reward.tokenB,
      tokenASymbol: "",
      tokenBSymbol: "",
      bonusToHarvest: reward.bonusToHarvest.toString(),
      bonusTokenHash: reward.bonusToken,
      bonusTokenSymbol: "",
      rewardsToHarvest: reward.nepToHarvest.toString(),
      share: reward.shares.toString(),
      tokensStaked: reward.tokensStaked.toString(),
      nepTokensPerSecond: reward.nepTokensPerSecond.toNumber(),
      bonusTokensPerSecond: reward.bonusTokensPerSecond.toNumber()
    };
    console.log(obj);
    rewards.push(obj);
  });
  return {
    rewards: rewards,
    boyz: [],
    bonus: 0
  };
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

export const unStake = async (tokenId: string): Promise<string> => {
  const config = await prepareWriteContract({
    address: POLYGON_FARM_CONTRACT_HASH,
    abi: FTWFarmABI,
    functionName: "unStake",
    args: [tokenId]
  });
  const { hash } = await writeContract(config);
  return hash as string;
};

export const claim = async (items: IClaimableRewards[]): Promise<string> => {
  const pairs: [string, string][] = [];
  const pairIds: any[] = [];
  items.forEach((item) => {
    pairs.push([item.tokenA, item.tokenB]);
    pairIds.push(item.pairId as any);
  });
  const formattedPairs: [string, string][][] = [pairs];
  console.log(formattedPairs);
  const config = await prepareWriteContract({
    address: POLYGON_FARM_CONTRACT_HASH,
    abi: FTWFarmABI,
    functionName: "claimMany",
    args: [pairIds]
  });
  const { hash } = await writeContract(config);
  return hash as string;
};
