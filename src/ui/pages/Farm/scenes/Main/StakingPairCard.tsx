import React from "react";
import { useHistory } from "react-router-dom";
import { IStakingPairs } from "../../../../../packages/neo/contracts/ftw/farm/interfaces";
import PairIcons from "../../../../components/PairIcons";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { StakingContract } from "../../../../../packages/neo/contracts/ftw/farm";
import {
  NEO_BNEO_CONTRACT_ADDRESS,
  NEO_GAS_CONTRACT_ADDRESS,
} from "../../../../../packages/neo/consts/tokens";
import { useApp } from "../../../../../common/hooks/use-app";
import { FARM_STAKE_PATH } from "../../../../../consts/routes";

const StakingPairCard = (props: IStakingPairs) => {
  const history = useHistory();
  const { network, chain } = useApp();
  const isBNEOAndGAS =
    props.tokenA === NEO_BNEO_CONTRACT_ADDRESS[network] &&
    props.tokenB === NEO_GAS_CONTRACT_ADDRESS;

  const { isLoaded, error, data } = useOnChainData(() => {
    return new StakingContract(network).getTVL(props.tokenA, props.tokenB);
  }, []);

  if (isBNEOAndGAS && process.env.NODE_ENV !== "development") return <></>;
  return (
    <tr
      className="is-clickable"
      onClick={() =>
        history.push(
          `${FARM_STAKE_PATH}?tokenA=${props.tokenA}&tokenB=${props.tokenB}&tokenASymbol=${props.tokenASymbol}&tokenBSymbol=${props.tokenBSymbol}`
        )
      }
    >
      <td>
        <div className="level is-mobile">
          <div className="level-left">
            <div className="level-item">
              <PairIcons
                chain={chain}
                network={network}
                tokenA={props.tokenA}
                tokenB={props.tokenB}
              />
            </div>
            <div className="level-item has-text-weight-medium is-size-7">
              {props.tokenASymbol} / {props.tokenBSymbol}
            </div>
          </div>
        </div>
      </td>
      <td>
        <div className="has-text-right ">
          {props.currentAPR / 100}% <small>APR</small>
        </div>
      </td>
    </tr>
  );
};

export default StakingPairCard;
