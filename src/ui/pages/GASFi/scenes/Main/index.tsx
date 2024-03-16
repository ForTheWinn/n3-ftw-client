import React, { useEffect, useState } from "react";
import StakeHeader from "./StakeHeader";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { GasFiContract } from "../../../../../packages/neo/contracts/ftw/gas-fi";
import {
  IClaimableResult,
  IStakeResult,
  IStatusResult
} from "../../../../../packages/neo/contracts/ftw/gas-fi/interfaces";
import { withDecimal } from "../../../../../packages/neo/utils";
import History from "../History";
import { useApp } from "../../../../../common/hooks/use-app";
import { message } from "antd";

export interface IMainData {
  status: IStatusResult;
  staking?: IStakeResult;
  claimable?: IClaimableResult;
  bNEOBalance?: number;
}

const Main = (props) => {
  const { network, setTxid, refreshCount } = useApp();
  const { connectedWallet } = useNeoWallets();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<IMainData | undefined>(undefined);
  const [error, setError] = useState();
  const onClaimAll = async () => {
    if (connectedWallet) {
      try {
        const tx = await new GasFiContract(network).claimAll(connectedWallet);
        setTxid(tx);
      } catch (e: any) {
        message.error(e.message);
      }
    } else {
      // toggleWalletSidebar();
    }
  };
  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const res = await new GasFiContract(network).getStatus(connectedWallet);
        setData(res);
        setLoading(false);
      } catch (e: any) {
        console.error(e);
        setError(e.message);
        setLoading(false);
      }
    }
    fetch();
  }, [connectedWallet, network, refreshCount]);
  return (
    <div>
      <div className="columns is-centered">
        <div className="column is-half">
          <StakeHeader
            isLoading={isLoading}
            data={data}
            connectedWallet={connectedWallet}
          />
          {data && data.status ? (
            <div className="columns is-hidden-mobile">
              {data.status.positions.map((amount, i) => {
                const percentage = (amount * 100) / data.status.totalNEO;
                return (
                  <div
                    key={`positions${i}`}
                    className="column has-text-centered"
                  >
                    <div className="box is-shadowless">
                      <strong>{`Position ${i + 1}`}</strong> <br />
                      {withDecimal(amount, 8, true)} ({Math.round(percentage)}%)
                      bNEO
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div></div>
          )}

          {connectedWallet && data && data.staking ? (
            <div className="box is-shadowless">
              <div className="columns is-mobile content has-text-centered">
                <div className="column">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      {" "}
                      <h6>Claimable GAS</h6>
                      <p>
                        {data.claimable
                          ? withDecimal(data.claimable.claimableAmount, 8, true)
                          : "0"}{" "}
                        GAS
                      </p>
                    </div>
                  </div>
                </div>

                {data.claimable ? (
                  <div
                    className="column"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <button
                      // disabled={data.claimable.claimableAmount === 0}
                      onClick={onClaimAll}
                      className="button is-primary"
                    >
                      Claim GAS
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          ) : (
            <div></div>
          )}

          <div className="box is-shadowless">
            <h6 className="title is-6">History</h6>
            {/*<div className="level">*/}
            {/*  <div className="level-left">*/}
            {/*    <div className="level-item">*/}
            {/*      <h6 className="title is-6">History</h6>*/}
            {/*    </div>*/}
            {/*  </div>*/}

            {/*  <div className="level-right">*/}
            {/*    <div className="level-item has-text-right">*/}
            {/*      {data ? (*/}
            {/*        <div className="has-text-info is-size-7">*/}
            {/*          Next drawing after &nbsp;*/}
            {/*          {moment(data.status.nextDrawingAt).format("lll")} <br />*/}
            {/*          <Countdown*/}
            {/*            // date={Date.now() + 500000}*/}
            {/*            date={data && data.status.nextDrawingAt}*/}
            {/*            renderer={renderer}*/}
            {/*          >*/}
            {/*            <DrawBtn />*/}
            {/*          </Countdown>*/}
            {/*        </div>*/}
            {/*      ) : (*/}
            {/*        <></>*/}
            {/*      )}*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}

            <History />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
