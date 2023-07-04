import { readContract, prepareWriteContract, writeContract } from "@wagmi/core";
import { IClaimable, IFarmPair } from "../../../common/routers/farm/interfaces";
import { TOKEN_LIST } from "../../../consts/tokens";
import { CONTRACT_LIST } from "../consts";
import { IClaimableRewards } from "../../neo/contracts/ftw/farm-v2/interfaces";
import { withDecimal } from "../../neo/utils";
import FTWFarmABI from "./abi/FTWFarm.json";
import { getTokenURI } from "./swap";
import { Buffer } from "buffer";
import { INetworkType } from "../../neo/network";
import { ISwapLPToken } from "../../../common/routers/swap/interfaces";
import { FARM, POLYGON_CHAIN } from "../../../consts/global";
import { ethers } from "ethers";

export const getPools = async (network: INetworkType): Promise<IFarmPair[]> => {
  const res: any = await readContract({
    address: CONTRACT_LIST[network][FARM] as any,
    abi: FTWFarmABI,
    functionName: "getAllPoolIds",
    args: [],
  });

  const pools: IFarmPair[] = [];

  for (const pairId of res) {
    const pool: any = await readContract({
      address: CONTRACT_LIST[network][FARM] as any,
      abi: FTWFarmABI,
      functionName: "getPool",
      args: [pairId],
    });

    const tokenA =
      TOKEN_LIST[POLYGON_CHAIN][network][pool.tokenA.toLowerCase()];
    const tokenB =
      TOKEN_LIST[POLYGON_CHAIN][network][pool.tokenB.toLowerCase()];
    const bonusToken =
      TOKEN_LIST[POLYGON_CHAIN][network][pool.bonusToken.toLowerCase()];

    const hasBonusRewards = pool.bonusTokensPerSecond > 0;
    pools.push({
      tokenA: pool.tokenA,
      tokenB: pool.tokenB,
      symbolA: tokenA ? tokenA.symbol : "Unknown",
      symbolB: tokenB ? tokenB.symbol : "Unknown",
      iconA: tokenA ? tokenA.icon : "",
      iconB: tokenB ? tokenB.icon : "",
      tokensStaked: pool.tokensStaked.toString(),
      nepTokensPerSecond: pool.nepTokensPerSecond.toString(),
      bonusToken: pool.bonusToken,
      bonusTokenSymbol: bonusToken ? bonusToken.symbol : "Unknown",
      bonusTokenDecimals: bonusToken ? bonusToken.decimals : "Unknown",
      bonusTokensPerSecond: pool.bonusTokensPerSecond.toString(),
      nepRewardsPerDay: ethers.utils.formatUnits(
        Number(pool.nepTokensPerSecond) * 86400,
        8
      ),
      bonusRewardsPerDay: hasBonusRewards
        ? ethers.utils.formatUnits(
            Number(pool.bonusTokensPerSecond),
            bonusToken ? bonusToken.decimals : 0
          )
        : "0",
      hasBonusRewards: hasBonusRewards,
      lastRewardedAt: pool.lastRewardedAt.toString(),
    });
  }
  return pools;
};

export const getStakedTokens = async (
  network: INetworkType,
  address: string
): Promise<ISwapLPToken[]> => {
  const res: any = await readContract({
    address: CONTRACT_LIST[network][FARM] as any,
    abi: FTWFarmABI,
    functionName: "getStakedTokens",
    args: [address],
  });
  const tokens: ISwapLPToken[] = [];

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
    address: CONTRACT_LIST[network][FARM] as any,
    abi: FTWFarmABI,
    functionName: "getClaimable",
    args: [address],
  });
  const rewards: IClaimableRewards[] = [];
  res.map((reward: any) => {
    const userShare = reward.shares.toString();
    if (userShare !== "0") {
      const tokenList = TOKEN_LIST[POLYGON_CHAIN][network];
      const tokenAAddress = reward.tokenA.toLowerCase();
      const tokenBAddress = reward.tokenB.toLowerCase();
      const tokenA = tokenList[tokenAAddress];
      const tokenB = tokenList[tokenBAddress];
      const bonusToken = tokenList[reward.bonusToken];
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
        bonusTokensPerSecond: reward.bonusTokensPerSecond.toString(),
      };
      rewards.push(obj);
    }
  });

  return {
    rewards: rewards,
    boyz: [],
    bonus: 0,
  };
};

export const stake = async (
  network: INetworkType,
  tokenId: string
): Promise<string> => {
  const config = await prepareWriteContract({
    address: CONTRACT_LIST[network][FARM] as any,
    abi: FTWFarmABI,
    functionName: "stake",
    args: [tokenId],
  });
  const { hash } = await writeContract(config);
  return hash as string;
};

export const unStake = async (
  network: INetworkType,
  tokenId: string
): Promise<string> => {
  const config = await prepareWriteContract({
    address: CONTRACT_LIST[network][FARM] as any,
    abi: FTWFarmABI,
    functionName: "unStake",
    args: [tokenId],
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
  const config = await prepareWriteContract({
    address: CONTRACT_LIST[network][FARM] as any,
    abi: FTWFarmABI,
    functionName: "claimMany",
    args: [pairIds],
  });
  const { hash } = await writeContract(config);
  return hash as string;
};
