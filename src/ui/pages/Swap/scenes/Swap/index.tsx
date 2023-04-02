import React from "react";
import { useApp } from "../../../../../common/hooks/use-app";

import { NEO_CHAIN, POLYGON_CHAIN } from "../../../../../consts/chains";

import NEOSwap from "./NEO";
import PolygonSwap from "./Polygon";

interface ISwapProps {
  rootPath: string;
}

const Swap = ({ rootPath }: ISwapProps) => {
  const { chain } = useApp();
  
  return (
    <div>
      {chain === NEO_CHAIN ? <NEOSwap rootPath={rootPath} /> : false}
      {chain === POLYGON_CHAIN ? <PolygonSwap rootPath={rootPath} /> : false}
    </div>
  );
};

export default Swap;
