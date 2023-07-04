import React, { useEffect, useState } from "react";
import { claim, getfNEODetail } from "../../../packages/ftwNEO";
import { IfNEODetail } from "../../../packages/ftwNEO/interfaces";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { CONNECT_WALLET, WENT_WRONG } from "../../../consts/messages";
import { useApp } from "../../../common/hooks/use-app";
import TxidModal from "./TxidModal";

interface IFNEOCardProps {
  name: string;
  hash: string;
  chainId: number;
  perBlock: number;
}
const FNEOCard = ({ name, hash, chainId, perBlock }: IFNEOCardProps) => {
  const { isConnected, address } = useAccount();
  const { refreshCount, increaseRefreshCount } = useApp();
  const [txid, setTxid] = useState<string | undefined>();
  const [data, setData] = useState<IfNEODetail>({
    totalSupply: "0",
    apr: "0",
    claimable: "0",
  });

  const onClaim = async () => {
    try {
      const _txid = await claim(hash);
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
      try {
        const res = await getfNEODetail(chainId, hash, address);
        setData(res);
        console.log(res);
      } catch (e) {
        console.error(e);
      }
    };
    fetchToken();
  }, [refreshCount]);

  return (
    <>
      <div className="box is-shadowless">
        <h5 className="title is-6">{name}</h5>
        <table className="table is-fullwidth">
          <tbody>
            <tr>
              <td style={{ border: 0 }}>
                <div style={{ float: "left", width: "50%", textAlign: "left" }}>
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
                <div style={{ float: "left", width: "50%", textAlign: "left" }}>
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
                <div style={{ float: "left", width: "50%", textAlign: "left" }}>
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
                <div style={{ float: "left", width: "50%", textAlign: "left" }}>
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
        <button
          onClick={onClaim}
          disabled={data.claimable === "0" || !isConnected}
          className="button is-primary is-fullwidth"
        >
          Claim
        </button>

        {txid && (
          <TxidModal
            txid={txid}
            resetTxid={handleTxModalClose}
            chainId={chainId}
          />
        )}
      </div>
    </>
  );
};

export default FNEOCard;
