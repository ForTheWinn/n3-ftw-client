import React, { useEffect, useState } from "react";
import {
  IfNEODetail,
  claim,
  getfNEODetail,
} from "../../../packages/evm/contracts/fneo";
import { useAccount } from "wagmi";
import { WENT_WRONG } from "../../../consts/messages";
import { useApp } from "../../../common/hooks/use-app";
import TxidModal from "./TxidModal";
import { Button, Spin, message } from "antd";
import { INetworkType } from "../../../packages/neo/network";
import { CHAINS } from "../../../consts/chains";
import Level from "../../components/Level";
import AddTokenButton from "../../components/AddTokenOnMetaMaskButton";
import { getChainNameByChain, getExplorer } from "../../../common/helpers";

interface IFNEOCardProps {
  chain: CHAINS;
  chainId: number;
  network: INetworkType;
  name: string;
  hash: string;
}
const FNEOCard = ({ name, hash, network, chain, chainId }: IFNEOCardProps) => {
  const { isConnected, address } = useAccount();
  const { refreshCount, increaseRefreshCount } = useApp();
  const [txid, setTxid] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IfNEODetail>({
    totalSupply: "0",
    apr: "0",
    claimable: "0",
    nepPerBlock: "0",
  });

  const onClaim = async () => {
    try {
      const _txid = await claim(chainId, hash);
      if (_txid) {
        setTxid(_txid);
      }
    } catch (e: any) {
      console.error(e);
      message.error(e.messages ? e.messages : WENT_WRONG);
    }
  };

  const handleTxModalClose = () => {
    setTxid(undefined);
    increaseRefreshCount();
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getfNEODetail(chainId, hash, address);
        setData(res);
      } catch (e: any) {
        message.error(e.messages ? e.messages : WENT_WRONG);
      }
      setLoading(false);
    })();
  }, [refreshCount]);

  return (
    <>
      <div className="box is-shadowless">
        <Level
          left={<h5 className="title is-6">{name}</h5>}
          right={
            <AddTokenButton
              address={hash}
              symbol={"ftwNEO"}
              decimals={8}
              image={"https://forthewin.network/symbols/fneo.svg"}
              chainId={chainId}
              chainName={getChainNameByChain(chain)}
            />
          }
        />

        {loading ? (
          <div className="is-center box is-shadowless">
            <Spin />
          </div>
        ) : (
          <table className="table is-fullwidth">
            <tbody>
              <tr>
                <td style={{ border: 0 }}>
                  <div
                    style={{ float: "left", width: "50%", textAlign: "left" }}
                  >
                    Total supply
                  </div>
                  <div
                    style={{ float: "left", width: "50%", textAlign: "right" }}
                  >
                    {data.totalSupply}
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ border: 0 }}>
                  <div
                    style={{ float: "left", width: "50%", textAlign: "left" }}
                  >
                    APR
                  </div>
                  <div
                    style={{ float: "left", width: "50%", textAlign: "right" }}
                  >
                    {data.apr}
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ border: 0 }}>
                  <div
                    style={{ float: "left", width: "50%", textAlign: "left" }}
                  >
                    Claimable
                  </div>
                  <div
                    style={{ float: "left", width: "50%", textAlign: "right" }}
                  >
                    {data.claimable}
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ border: 0 }}>
                  <div
                    style={{ float: "left", width: "50%", textAlign: "left" }}
                  >
                    NEP per block
                  </div>
                  <div
                    style={{ float: "left", width: "50%", textAlign: "right" }}
                  >
                    {data.nepPerBlock} NEP
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ border: 0 }}>
                  <div
                    style={{ float: "left", width: "50%", textAlign: "left" }}
                  >
                    Contract
                  </div>
                  <div
                    style={{ float: "left", width: "50%", textAlign: "right" }}
                  >
                    <Button
                      size="small"
                      target="_blank"
                      href={`${getExplorer(
                        chain,
                        network,
                        "contract"
                      )}/${hash}`}
                    >
                      View
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        )}

        <button
          onClick={onClaim}
          disabled={data.claimable === "0" || !isConnected}
          className="button is-primary is-fullwidth"
        >
          Claim
        </button>

        {txid && (
          <TxidModal
            network={network}
            txid={txid}
            resetTxid={handleTxModalClose}
            chain={chain}
          />
        )}
      </div>
    </>
  );
};

export default FNEOCard;
