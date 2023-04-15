export interface IClaimableRewards {
  pairId: string;
  tokenA: string;
  tokenB: string;
  tokenASymbol: string;
  tokenBSymbol: string;
  bonusToHarvest: string;
  bonusTokenHash: string;
  bonusTokenSymbol: string;
  rewardsToHarvest: string;
  share: string;
  tokensStaked: string;
  nepTokensPerSecond: string;
  bonusTokensPerSecond: string;
}

export interface IPool {
  tokenA: string;
  tokenB: string;
  tokenASymbol: string;
  tokenBSymbol: string;
  lastRewardedAt: string;
  tokensStaked: number;
  nepTokensPerSecond: number;
  bonusToken: string;
  bonusTokenSymbol: string;
  bonusTokenDecimals: number;
  bonusTokensPerSecond: number;
}

// export interface IPoolEnhanced extends IPool {
//   nepRewardsPerDay: string;
//   bonusRewardsPerDay: string;
//   hasBonusRewards: boolean;
//   tokenALogo: string
//   tokenBLogo: string
// }

export interface ILPTokens {
  contractHash: string;
  tokenA: string;
  tokenB: string;
  tokenId: string;
  amount: number;
}

export interface IBoyStaked {
  lotNo: string;
  tokenId: string;
  tier: string;
  createdAt: string;
}
