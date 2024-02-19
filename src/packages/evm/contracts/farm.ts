import {
  readContract,
  writeContract,
  simulateContract,
} from "@wagmi/core";
import { IClaimable, IFarmPair } from "../../../common/routers/farm/interfaces";
import { TOKEN_LIST } from "../../../consts/tokens";
import { IClaimableRewards } from "../../neo/contracts/ftw/farm-v2/interfaces";
import FTWFarmABI from "./abi/FTWFarm.json";
import { getTokenURI } from "./swap";
import { INetworkType } from "../../neo/network";
import { ISwapLPToken } from "../../../common/routers/swap/interfaces";
import { FARM } from "../../../consts/global";
import { formatAmount } from "../../../common/helpers";
import { EVM_CONTRACT_MAP } from "..";
import { CHAINS, CONFIGS } from "../../../consts/chains";
import { wagmiConfig } from "../../../wagmi-config";

export const getPools = async (
  chain: CHAINS,
  network: INetworkType
): Promise<IFarmPair[]> => {
  const contractAddress = EVM_CONTRACT_MAP[chain][network][FARM];
  const chainId = CONFIGS[network][chain].chainId;

  const res: any = await readContract(wagmiConfig, {
    address: contractAddress,
    abi: FTWFarmABI,
    functionName: "getAllPoolIds",
    args: [],
    chainId,
  });

  const pools: IFarmPair[] = [];

  for (const pairId of res) {
    const pool: any = await readContract(wagmiConfig, {
      address: contractAddress,
      abi: FTWFarmABI,
      functionName: "getPool",
      args: [pairId],
      chainId,
    });

    const tokenA = TOKEN_LIST[chain][network][pool.tokenA];
    const tokenB = TOKEN_LIST[chain][network][pool.tokenB];
    const bonusToken = TOKEN_LIST[chain][network][pool.bonusToken];

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
      bonusTokenDecimals: bonusToken
        ? bonusToken.decimals.toString()
        : "Unknown",
      bonusTokensPerSecond: pool.bonusTokensPerSecond.toString(),
      nepRewardsPerDay: formatAmount(
        (Number(pool.nepTokensPerSecond) * 86400).toString(),
        8
      ),
      bonusRewardsPerDay: hasBonusRewards
        ? formatAmount(
            pool.bonusTokensPerSecond,
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
  chain: CHAINS,
  network: INetworkType,
  address: string
): Promise<ISwapLPToken[]> => {
  const contractAddress = EVM_CONTRACT_MAP[chain][network][FARM];
  const chainId = CONFIGS[network][chain].chainId;

  const res: any = await readContract(wagmiConfig, {
    address: contractAddress,
    abi: FTWFarmABI,
    functionName: "getStakedTokens",
    args: [address],
    chainId,
  });
  const tokens: ISwapLPToken[] = [];

  for (const tokenId of res) {
    const token = await getTokenURI(chain, network, tokenId.toString());
    tokens.push(token);
  }

  return tokens;
};

export const getClaimable = async (
  chain: CHAINS,
  network: INetworkType,
  address: string
): Promise<IClaimable> => {
  const contractAddress = EVM_CONTRACT_MAP[chain][network][FARM];
  const chainId = CONFIGS[network][chain].chainId;

  const res: any = await readContract(wagmiConfig, {
    address: contractAddress,
    abi: FTWFarmABI,
    functionName: "getClaimable",
    args: [address],
    chainId,
  });

  const rewards: IClaimableRewards[] = [];
  res.map((reward: any) => {
    const userShare = reward.shares.toString();
    if (userShare !== "0") {
      const tokenList = TOKEN_LIST[chain][network];
      const tokenAAddress = reward.tokenA;
      const tokenBAddress = reward.tokenB;
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
  chain: CHAINS,
  network: INetworkType,
  tokenId: string
): Promise<string> => {
  const contractAddress = EVM_CONTRACT_MAP[chain][network][FARM];
  const chainId = CONFIGS[network][chain].chainId;
  const args = {
    address: contractAddress,
    abi: FTWFarmABI,
    functionName: "stake",
    args: [tokenId],
    chainId,
  };

  await simulateContract(wagmiConfig, args);
  return await writeContract(wagmiConfig, args);
};

export const unStake = async (
  chain: CHAINS,
  network: INetworkType,
  tokenId: string
): Promise<string> => {
  const args = {
    address: EVM_CONTRACT_MAP[chain][network][FARM],
    abi: FTWFarmABI,
    functionName: "unStake",
    args: [tokenId],
    chainId: CONFIGS[network][chain].chainId,
  };
  await simulateContract(wagmiConfig, args);
  return await writeContract(wagmiConfig, args);
};

export const claim = async (
  chain: CHAINS,
  network: INetworkType,
  items: IClaimableRewards[]
): Promise<string> => {
  const pairs: [string, string][] = [];
  const pairIds: any[] = [];
  items.forEach((item) => {
    pairs.push([item.tokenA, item.tokenB]);
    pairIds.push(item.pairId as any);
  });
  const args = {
    address: EVM_CONTRACT_MAP[chain][network][FARM],
    abi: FTWFarmABI,
    functionName: "claimMany",
    args: [pairIds],
    chainId: CONFIGS[network][chain].chainId,
  };
  await simulateContract(wagmiConfig, args);
  return await writeContract(wagmiConfig, args);
};
