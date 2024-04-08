import React from "react";
import DisplayConnectedWallet from "./DisplayConnectedWallet";
import { Connector, useAccount, useConnect } from "wagmi";
import { useApp } from "../../../../../common/hooks/use-app";
import { WALLET_CONNECTED, WENT_WRONG } from "../../../../../consts/messages";
import { Avatar, Button, Space, message } from "antd";
import { getWalletIcon } from "../NEOWallets/helpers";

function ConnectorButton({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector, setReady]);

  return (
    <Button
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      disabled={!ready}
      onClick={onClick}
    >
      <Space>
        <Avatar
          style={{ display: "flex" }}
          size={20}
          src={connector.icon ? getWalletIcon(connector.icon) : ""}
        />
        {connector.name}
      </Space>
      {connector.name}
    </Button>
  );
}

const ETHWallets = () => {
  const { toggleWalletSidebar } = useApp();
  const { isConnected } = useAccount();
  const { connectAsync, connectors, error } = useConnect();

  const onConnect = async (connector) => {
    try {
      await connectAsync({ connector });
      toggleWalletSidebar();
      message.success(WALLET_CONNECTED);
    } catch (e: any) {
      message.error(e.message ? e.meesage : WENT_WRONG);
    }
  };

  return (
    <div>
      <h1 className="title is-6">ETH wallets</h1>
      {isConnected ? (
        <DisplayConnectedWallet />
      ) : (
        <Space direction="vertical" style={{ width: "100%" }}>
          {connectors.map((connector) => {
            return (
              <ConnectorButton
                key={connector.name}
                connector={connector}
                onClick={() => onConnect(connector)}
              />
            );
          })}
        </Space>
      )}
    </div>
  );
};

export default ETHWallets;
