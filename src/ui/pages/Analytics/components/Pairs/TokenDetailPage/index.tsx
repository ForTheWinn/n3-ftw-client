import React from "react";
import Swaps from "./Swaps";
import { CHAINS } from "../../../../../../consts/chains";
import CandleChart from "./CandleChart";

interface ITokenDetailPageProps {
  chain: CHAINS;
  tokens: string[];
  tokenHash?: string;
}
const TokenDetailPage = (props: ITokenDetailPageProps) => {
  return (
    <div>
      {props.tokenHash && (
        <CandleChart chain={props.chain} tokenHash={props.tokenHash} />
      )}
      <Swaps {...props} />
    </div>
  );
};

export default TokenDetailPage;
