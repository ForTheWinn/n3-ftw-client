
export interface IStatusResult {
  totalNEO: number; // current
  position1: number; // current
  position2: number; // current
  position3: number; // current
  lastDrawNo: number; // past
  lastPosition: number; // past
  lastReward: number; // past
	nextDrawingAt: number; // future
}

export interface IStakeResult {
  position: number;
  amount: number;
  startAt: number; // quality draw no from
  stakeAt: number;
}

export interface IDrawsResult {
  totalItems: number;
  totalPages: number;
  items: IDraw[];
}

export interface IDraw {
  drawNo: number;
  totalReward: number;
  position: number;
  createdAt: number;
}
