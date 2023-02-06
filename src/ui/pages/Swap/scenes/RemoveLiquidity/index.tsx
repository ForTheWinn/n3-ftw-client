import React from "react";
import { useApp } from "../../../../../common/hooks/use-app";

import {
  NEO_CHAIN,
  POLYGON_CHAIN,
} from "../../../../../packages/chains/consts";

import NEORemoveLiquidity from "./NEO";
import PolygonRemoveLiquidity from "./NEO";

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