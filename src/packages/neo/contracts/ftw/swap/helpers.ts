import { u } from "@cityofzion/neon-core";
import { base64ToHash160, parseMapValue, toDecimal } from "../../../utils";
import moment from "moment";
import { IReserve } from "./interfaces";
import { DEFAULT_SLIPPAGE } from "./consts";

//TODO:Concider later
// export const getEstimate = (
//   amount: string,
//   reserveA: number,
//   reserveB: number
// ): number => {
//   const fixed8TokenAmount = u.BigInteger.fromDecimal(amount, 8).toString();
//   let estimated = (parseFloat(fixed8TokenAmount) * reserveB) / reserveA;
//   estimated = Math.floor(estimated);
//   return toDecimal(estimated.toString());
// };
//
// export const getUserShare = (totalShares, userShare, poolA, poolB) => {
//   return {
//     amountA: (poolA * userShare) / totalShares,
//     amountB: (poolB * userShare) / totalShares,
//   };
// };
//
// export const parseUserStake = (stackItem) => {
//   return {
//     tokenA: base64ToHash160(stackItem.value[0].value as string),
//     tokenB: base64ToHash160(stackItem.value[1].value as string),
//     amountA: toDecimal(stackItem.value[2].value),
//     amountB: toDecimal(stackItem.value[3].value),
//   };
// };

// export const parseReserve = (map): IReserve => parseMapValue(map);

export const defaultDeadLine = () =>
  moment().utc().add("10", "minutes").valueOf();

export const getAfterSlippage = (amountB: string, slippage: number): string => {
  return (parseFloat(amountB) - (parseFloat(amountB) * slippage) / 100).toString();
};

// Slippage for swapB
export const getMaxTokenAAmount = (
  amountA: string,
  slippage: number
): string => {
  return (parseFloat(amountA) + (parseFloat(amountA) * slippage) / 100).toString();
};
