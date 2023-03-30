import React from "react";
import { useApp } from "../../../../../common/hooks/use-app";

import { NEO_CHAIN, POLYGON_CHAIN } from "../../../../../consts/chains";

import NEORemoveLiquidity from "./NEO";
import PolygonRemoveLiquidity from "./Polygon";

interface IRemoveLiquidityProps {
  rootPath: string;
}

const RemoveLiquidity = ({ rootPath }: IRemoveLiquidityProps) => {
  const { chain } = useApp();
  return (
    <div>
      {chain === NEO_CHAIN ? <NEORemoveLiquidity rootPath={rootPath} /> : false}

      {chain === POLYGON_CHAIN ? (
        <PolygonRemoveLiquidity rootPath={rootPath} />
      ) : (
        false
      )}
    </div>
  );
};

export default RemoveLiquidity;
