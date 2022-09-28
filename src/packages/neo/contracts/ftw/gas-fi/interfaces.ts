export interface IGASFiStatus {
  status: IStatusResult;
  claimable?: IClaimableResult;
  staking?: IStakeResult;
  bNEOBalance?: number;
}

export interface IStatusResult {
  totalNEO: number; // current
  lastDrawNo: number; // past
  lastPosition: number; // past
  lastReward: number; // past
  nextDrawingAt: number; // future
  positions: number[];
}

export interface IClaimableResult {
  claimableAmount: number;
  claimableNumbers: number[];
}

export interface IStakeResult {
  position: number;
  amount: number;
  startAt: number; // quality draw no from
  stakedAt: string;
}

export interface IDrawsResult {
  totalItems: number;
  totalPages: number;
  items: IDraw[];
}

export interface IClaim {
  no: number;
  reward: number;
}

export interface IDraw {
  drawNo: number;
  totalReward: number;
  position: number;
  createdAt: number;
}
