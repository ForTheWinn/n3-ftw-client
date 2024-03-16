import Decimal from "decimal.js";

export const priceImpactFormat = (p: number) => {
  if (p < 0.01) {
    return "<0.01%";
  } else {
    return p.toFixed(2) + "%";
  }
};

/**
 * Calculate the price impact of a swap.
 * @param {string|number|Decimal} amountIn - The amount of the input token being swapped.
 * @param {string|number|BigInt} reserveIn - The reserve of the input token in the pool.
 * @param {string|number|BigInt} reserveOut - The reserve of the output token in the pool.
 * @returns {number} The non-negative price impact as a percentage.
 */
export function calculatePriceImpact(
  amountIn: string,
  reserveIn: string,
  reserveOut: string
) {
  // Convert all inputs to Decimal for high precision arithmetic
  const amountInDecimal = new Decimal(amountIn);
  const reserveInDecimal = new Decimal(reserveIn); // Using toString() to convert BigInt to string if necessary
  const reserveOutDecimal = new Decimal(reserveOut);

  // Calculate the input amount with fee applied (assuming a 0.3% fee like in Uniswap V2)
  // If your AMM uses a different fee structure, adjust this accordingly
  const amountInWithFee = amountInDecimal.mul(9975).div(10000);

  // Calculate the amount of output token that will be received
  const numerator = amountInWithFee.mul(reserveOutDecimal);
  const denominator = reserveInDecimal
    .mul(10000)
    .div(9975)
    .add(amountInWithFee);
  const amountOut = numerator.div(denominator);

  // Calculate the price before the swap (reserveOut / reserveIn)
  const priceBefore = reserveOutDecimal.div(reserveInDecimal);

  // Calculate the price after the swap (reserveOut - amountOut) / (reserveIn + amountIn)
  const priceAfter = reserveOutDecimal
    .sub(amountOut)
    .div(reserveInDecimal.add(amountInDecimal));

  // Calculate price impact as the absolute difference in price, relative to the price before the swap
  const priceImpact = priceBefore
    .sub(priceAfter)
    .abs()
    .div(priceBefore)
    .mul(100);

  // Return the non-negative price impact as a percentage
  return priceImpact.toNumber();
}
