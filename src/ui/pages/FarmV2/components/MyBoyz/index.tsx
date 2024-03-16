import React, { useEffect, useState } from "react";
import { BoyzContract } from "../../../../../packages/neo/contracts/ftw/boyz";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import DisplayBoy from "./DisplayBoy";
import { useApp } from "../../../../../common/hooks/use-app";
import { Spin } from "antd";

interface IMyBoyzProps {
  onStake: (tokenId: string) => void;
}
const MyBoyz = ({ onStake }: IMyBoyzProps) => {
  const { connectedWallet } = useNeoWallets();
  const { network } = useApp();
  const [tokens, setTokens] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await new BoyzContract(network).getTokens(connectedWallet);
        setTokens(res);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    }
    load();
  }, []);
  return (
    <div>
      {isLoading ? (
        <div className="has-text-centered">
          <Spin />
        </div>
      ) : tokens.length > 0 ? (
        <>
          <h1 className="title is-5">Click a boy to stake</h1>
          <div className="columns is-multiline">
            {tokens.map((id) => {
              return (
                <div className="column is-2" key={id}>
                  <DisplayBoy
                    onClick={() => {
                      onStake(id);
                    }}
                    id={id}
                    network={network}
                  />
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MyBoyz;
