export interface IStatusResult{
	totalNEO: number // current
	position1: number // current
	position2: number // current
	position3: number // current
	lastPosition: number // past
	lastReward: number// past
}

export interface IStakeResult{
	position: number
	amount: number
	startAt: number
	stakeAt: number
}
