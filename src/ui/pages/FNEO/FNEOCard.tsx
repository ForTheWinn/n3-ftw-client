import React, { useEffect, useState } from "react";
import {
  IfNEODetail,
  claim,
  getfNEODetail,
} from "../../../packages/evm/contracts/fneo";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { WENT_WRONG } from "../../../consts/messages";
import { useApp } from "../../../common/hooks/use-app";
import TxidModal from "./TxidModal";
import { Spin } from "antd";
import { CHAINS } from "../../../consts/chains";
import { INetworkType } from "../../../packages/neo/network";

interface IFNEOCardProps {
  chain: CHAINS;
  network: INetworkType;
  name: string;
  hash: string;
  perBlock: number;
}
const FNEOCard = ({ name, hash, chain, perBlock, network }: IFNEOCardProps) => {
  const { isConnected, address } = useAccount();
  const { refreshCount, increaseRefreshCount } = useApp();
  const [txid, setTxid] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IfNEODetail>({
    totalSupply: "0",
    apr: "0",
    claimable: "0",
  });

  const onClaim = async () => {
    try {
      const _txid = await claim(chain, network, hash);
      if (_txid) {
        setTxid(_txid);
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e && e.messages ? e.messages : WENT_WRONG);
    }
  };

  const handleTxModalClose = () => {
    setTxid(undefined);
    increaseRefreshCount();
  };
  useEffect(() => {
    const fetchToken = async () => {
      setLoading(true);
      try {
        const res = await getfNEODetail(
          chain,
          network,
          hash,
          perBlock,
          address
        );
        setData(res);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchToken();
  }, [refreshCount]);

  return (
    <>
      <div className="box is-shadowless">
        <h5 className="title is-6">{name}</h5>
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
                    {perBlock} NEP
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
