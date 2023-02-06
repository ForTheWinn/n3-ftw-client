import React from "react";
import { useApp } from "../../../../../common/hooks/use-app";

import {
  NEO_CHAIN,
  POLYGON_CHAIN,
} from "../../../../../packages/chains/consts";

import NEOLiquidity from "./NEO";
import PolygonLiquidity from "./Polygon";

interface ISwapProps {
  rootPath: string;
}

const AddLiquidity = ({ rootPath }: ISwapProps) => {
  const { chain } = useApp();

  return (
    <div>
      {chain === NEO_CHAIN ? <NEOLiquidity rootPath={rootPath} /> : false}

      {chain === POLYGON_CHAIN ? (
        <PolygonLiquidity rootPath={rootPath} />
      ) : (
        false
      )}
    </div>
  );
};

export default AddLiquidity;
