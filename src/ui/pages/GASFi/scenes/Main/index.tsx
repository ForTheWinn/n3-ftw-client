import React, { useEffect, useState } from "react";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { GasFiContract } from "../../../../../packages/neo/contracts/ftw/gas-fi";
import { useApp } from "../../../../../common/hooks/use-app";
import { Modal, Space, message } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import Spin from "./Spin";
import NFTAds from "../../../../components/Ad";
import FreeSpinInfo from "./FreeSpinInfo";
import CountdownRender from "../../../Locker/components/CountdownRender";

export interface IStatusForSpin {
  neo: number;
  gas: number;
  userbNEOBalance: number;
  isUserStaked: boolean;
  isTimeToSpin: boolean;
  nextAvailableToSpin: number;
}

export interface IStatusForSpinForFree {
  nep: string;
  isTimeToSpin: boolean;
  nextAvailableToSpin: number;
}

const Main = () => {
  const { network, refreshCount } = useApp();
  const { connectedWallet } = useNeoWallets();
  const [isLoading, setLoading] = useState(true);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showInfoModal, setInfoModal] = useState(false);
  const [data, setData] = useState<IStatusForSpinForFree | undefined>(
    undefined
  );
  const [error, setError] = useState();
  const [txid, setTxid] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const res = await new GasFiContract(network).getStatusForFreeSpin(
          connectedWallet
        );
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

  const onSpin = async () => {
    if (connectedWallet) {
      try {
        const res = await new GasFiContract(network).spinForFree(
          connectedWallet
        );
        console.log(res);
        setTxid(res);
        message.success("Transaction sent successfully");
      } catch (e: any) {
        console.error(e);
        message.error(e.message);
      }
    }
  };
  console.log(data);
  return (
    <>
      <div className="columns is-centered">
        <div className="column is-half">
          <div className=" is-shadowless">
            {txid && data ? (
              <Spin txid={txid} onClose={() => setTxid(undefined)} />
            ) : (
              <Space direction="vertical" size={"large"}>
                <NFTAds />
                <div className="has-text-centered">
                  <h1 className="title is-6">Are you feeling lucky today?</h1>
                  <div className="subtitle is-7 is-accent mb-0">
                    <Space>
                      <span>Free spin to win {data?.nep} NEP</span>
                      <button
                        onClick={() => setInfoModal(true)}
                        className=" is-light is-small"
                      >
                        <InfoCircleOutlined />
                      </button>
                    </Space>
                  </div>
                </div>
                <button
                  style={{ maxWidth: "300px", margin: "0 auto" }}
                  disabled={connectedWallet ? !data?.isTimeToSpin : true}
                  className="button is-primary is-fullwidth is-large"
                  onClick={() => onSpin()}
                >
                  {connectedWallet ? "I am feeling lucky" : "Connect Wallet"}
                </button>
                {data && data.nextAvailableToSpin > 0 && (
                  <CountdownRender timestamp={data.nextAvailableToSpin} />
                )}
              </Space>
            )}
          </div>
        </div>
      </div>
      {showInfoModal && (
        <Modal
          open={showInfoModal}
          onCancel={() => setInfoModal(false)}
          footer={[]}
        >
          <FreeSpinInfo network={network} />
        </Modal>
      )}
      {/* {showStakeModal && (
        <Modal
          open={showStakeModal}
          onCancel={() => setShowStakeModal(false)}
          footer={[]}
        >
          {data && <Stake data={data} />}
        </Modal>
      )} */}
    </>
  );
};

export default Main;
