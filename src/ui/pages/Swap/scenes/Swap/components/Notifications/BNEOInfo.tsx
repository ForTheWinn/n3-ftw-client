import React from "react";
import {
  BNEO_SCRIPT_HASH,
  NEO_SCRIPT_HASH,
} from "../../../../../../../packages/neo/consts/nep17-list";
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
        tokenA.hash === NEO_SCRIPT_HASH &&
        tokenB &&
        tokenB.hash === BNEO_SCRIPT_HASH[network] && (
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

      {tokenB && tokenB.hash === NEO_SCRIPT_HASH && (
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
