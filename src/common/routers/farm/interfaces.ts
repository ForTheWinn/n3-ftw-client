import {
  IBoyStaked,
  IClaimableRewards,
} from "../../../packages/neo/contracts/ftw/farm-v2/interfaces";

export interface IFarmPair {
  tokenA: string;
  tokenB: string;
  symbolA: string;
  symbolB: string;
  iconA: string;
  iconB: string;
  nepTokensPerSecond: string;
  nepRewardsPerDay: string;
  bonusToken: string;
  bonusTokensPerSecond: string;
  bonusRewardsPerDay: string;
  bonusTokenSymbol: string;
  bonusTokenDecimals: string;
  hasBonusRewards: boolean;
  tokensStaked: string;
  lastRewardedAt: string;
}

export interface IClaimable {
  rewards: IClaimableRewards[];
  boyz: IBoyStaked[];
  bonus: number;
  NEPInContract: string;
}
