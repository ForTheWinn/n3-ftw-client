import React from 'react'
import { ITokenState } from '../../interfaces';

interface IPriceComparisonProps {
  tokenA: ITokenState;
  tokenB: ITokenState;
  amountIn: number;
}

const PriceComparison = ({tokenA, tokenB, amountIn}: IPriceComparisonProps) => {
  return <div>PriceComparison</div>;
};

export default PriceComparison