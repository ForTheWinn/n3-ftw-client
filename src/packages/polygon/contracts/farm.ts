import { readContract, prepareWriteContract, writeContract } from "@wagmi/core";
import {
  IClaimable,
  IFarmLPToken
} from "../../../common/routers/farm/interfaces";
import { TOKEN_LIST } from "../../../consts/tokens";
import { POLYGON_CHAIN } from "../../../consts/chains";
import {} from "../consts";
import {
  IClaimableRewards,
  IPoolEnhanced
} from "../../neo/contracts/ftw/farm-v2/interfaces";
import { withDecimal } from "../../neo/utils";
import FTWFarmABI from "./abi/FTWFarm.json";
import { getTokenURI } from "./swap";
import { Buffer } from "buffer";
import { INetworkType } from "../../neo/network";
import { CONSTS } from "..";
import { GLOBAL } from "../../../consts";

export const getPools = async (network: INetworkType): Promise<any> => {
  const res: any = await readContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.FARM] as any,
    abi: FTWFarmABI,
    functionName: "getAllPoolIds",
    args: []
  });

  const pools: IPoolEnhanced[] = [];

  for (const pairId of res) {
    const pool: any = await readContract({
      address: CONSTS.CONTRACT_LIST[network][GLOBAL.FARM] as any,
      abi: FTWFarmABI,
      functionName: "getPool",
      args: [pairId]
    });

    const tokenA = TOKEN_LIST[POLYGON_CHAIN][pool.tokenA];
    const tokenB = TOKEN_LIST[POLYGON_CHAIN][pool.tokenB];
    const bonusToken = TOKEN_LIST[POLYGON_CHAIN][pool.bonusToken];

    const hasBonusRewards = pool.bonusTokensPerSecond > 0;
    pools.push({
      tokenA: pool.tokenA,
      tokenB: pool.tokenB,
      tokenASymbol: tokenA ? tokenA.symbol : "Unknown",
      tokenBSymbol: tokenB ? tokenB.symbol : "Unknown",
      lastRewardedAt: pool.lastRewardedAt.toString(),
      tokensStaked: pool.tokensStaked.toString(),
      nepTokensPerSecond: pool.nepTokensPerSecond.toString(),
      bonusToken: pool.bonusToken,
      bonusTokenSymbol: bonusToken ? bonusToken.symbol : "Unknown",
      bonusTokenDecimals: bonusToken ? bonusToken.decimals : "Unknown",
      bonusTokensPerSecond: pool.bonusTokensPerSecond.toString(),
      nepRewardsPerDay: withDecimal(
        pool.nepTokensPerSecond.toNumber() * 86400,
        8,
        true
      ),
      bonusRewardsPerDay: hasBonusRewards
        ? withDecimal(
            pool.bonusTokensPerSecond.toNumber() * 86400,
            bonusToken ? bonusToken.decimals : 0
          )
        : "0",
      hasBonusRewards: hasBonusRewards,
      tokenALogo: tokenA ? tokenA.icon : "",
      tokenBLogo: tokenB ? tokenB.icon : ""
    });
  }
  return pools;
};

export const getStakedTokens = async (
  network: INetworkType,
  address: string
): Promise<IFarmLPToken[]> => {
  const res: any = await readContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.FARM] as any,
    abi: FTWFarmABI,
    functionName: "getStakedTokens",
    args: [address]
  });
  const tokens: IFarmLPToken[] = [];

  for (const tokenId of res) {
    const token = await getTokenURI(network, tokenId.toString());
    tokens.push(token);
  }

  return tokens;
};

export const getClaimable = async (
  network: INetworkType,
  address: string
): Promise<IClaimable> => {
  const res: any = await readContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.FARM] as any,
    abi: FTWFarmABI,
    functionName: "getClaimable",
    args: [address]
  });
  const rewards: IClaimableRewards[] = [];
  res.map((reward: any) => {
    const userShare = reward.shares.toString();
    if (userShare !== "0") {
      const tokenA = TOKEN_LIST[POLYGON_CHAIN][network][reward.tokenA];
      const tokenB = TOKEN_LIST[POLYGON_CHAIN][network][reward.tokenB];
      const bonusToken = TOKEN_LIST[POLYGON_CHAIN][network][reward.bonusToken];
      const obj = {
        pairId: reward.pairId,
        tokenA: reward.tokenA,
        tokenB: reward.tokenB,
        tokenASymbol: tokenA ? tokenA.symbol : "Unknown",
        tokenBSymbol: tokenB ? tokenB.symbol : "Unknown",
        bonusToHarvest: reward.bonusToHarvest.toString(),
        bonusTokenHash: reward.bonusToken,
        bonusTokenSymbol: bonusToken ? bonusToken.symbol : "Unknown",
        rewardsToHarvest: reward.nepToHarvest.toString(),
        share: reward.shares.toString(),
        tokensStaked: reward.tokensStaked.toString(),
        nepTokensPerSecond: reward.nepTokensPerSecond.toString(),
        bonusTokensPerSecond: reward.bonusTokensPerSecond.toString()
      };
      rewards.push(obj);
    }
  });

  return {
    rewards: rewards,
    boyz: [],
    bonus: 0
  };
};

export const stake = async (
  network: INetworkType,
  tokenId: string
): Promise<string> => {
  const config = await prepareWriteContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.FARM] as any,
    abi: FTWFarmABI,
    functionName: "stake",
    args: [tokenId]
  });
  const { hash } = await writeContract(config);
  return hash as string;
};

export const unStake = async (
  network: INetworkType,
  tokenId: string
): Promise<string> => {
  const config = await prepareWriteContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.FARM] as any,
    abi: FTWFarmABI,
    functionName: "unStake",
    args: [tokenId]
  });
  const { hash } = await writeContract(config);
  return hash as string;
};

export const claim = async (
  network: INetworkType,
  items: IClaimableRewards[]
): Promise<string> => {
  const pairs: [string, string][] = [];
  const pairIds: any[] = [];
  items.forEach((item) => {
    pairs.push([item.tokenA, item.tokenB]);
    pairIds.push(item.pairId as any);
  });
  const formattedPairs: [string, string][][] = [pairs];
  console.log(formattedPairs);
  console.log(pairIds);
  const config = await prepareWriteContract({
    address: CONSTS.CONTRACT_LIST[network][GLOBAL.FARM] as any,
    abi: FTWFarmABI,
    functionName: "claimMany",
    args: [pairIds]
  });
  const { hash } = await writeContract(config);
  return hash as string;
};
