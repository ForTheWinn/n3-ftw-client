import React from "react";
import {
  NEO_BNEO_CONTRACT_ADDRESS,
  NEO_NEO_CONTRACT_ADDRESS,
} from "../../../../../../../packages/neo/consts/tokens";
import { INetworkType } from "../../../../../../../packages/neo/network";
import { toDecimal } from "../../../../../../../packages/neo/utils";

interface IBNEOInfoProps {
  tokenA?: any;
  tokenB?: any;
  amountB?: number;
  network: INetworkType;
}
const BNEOInfo = ({ tokenA, tokenB, network, amountB }: IBNEOInfoProps) => {
  return (
    <>
      {tokenA &&
        tokenA.hash === NEO_NEO_CONTRACT_ADDRESS &&
        tokenB &&
        tokenB.hash === NEO_BNEO_CONTRACT_ADDRESS[network] && (
          <>
            <hr />
            <div className="notification is-success is-light">
              We are converting using bNEO contract. It is not swapping through
              our swap contract.
              <br />
              <a
                className="is-size-7"
                target="_blank"
                href={"https://neoburger.io"}
                rel="noreferrer"
              >
                [Learn more about bNEO]
              </a>
            </div>
          </>
        )}

      {tokenB && tokenB.hash === NEO_NEO_CONTRACT_ADDRESS && (
        <>
          <hr />
          <div className="notification is-success is-light">
            NEO are indivisible. We are using bNEO behind the scene. You will be
            paying extra gas fee for converting.
            <br />
            <a
              className="is-size-7"
              target="_blank"
              href={"https://neoburger.io"}
              rel="noreferrer"
            >
              [Learn more about bNEO]
            </a>
            {amountB ? (
              <>
                <br />
                <br />
                <span className="has-text-weight-bold">{`Extra fee: ${toDecimal(
                  amountB * 100000
                )} GAS`}</span>
              </>
            ) : (
              ""
            )}
          </div>
        </>
      )}
    </>
  );
};

export default BNEOInfo;
