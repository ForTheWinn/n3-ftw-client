import {
  IBoyStaked,
  IClaimableRewards
} from "../../../packages/neo/contracts/ftw/farm-v2/interfaces";

// export interface IFarmLPToken {
//   name: string;
//   tokenId: string;
//   tokenA: string;
//   tokenB: string;
//   symbolA: string;
//   symbolB: string;
//   amountA: string; // formatted
//   amountB: string; // formatted
//   sharesPercentage: string; // BPS
// }

export interface IClaimable {
  rewards: IClaimableRewards[];
  boyz: IBoyStaked[];
  bonus: number;
}
