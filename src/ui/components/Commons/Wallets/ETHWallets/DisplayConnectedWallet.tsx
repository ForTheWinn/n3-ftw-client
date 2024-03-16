import { Button, Dropdown, MenuProps } from "antd";
import React from "react";
import { useAccount, useDisconnect } from "wagmi";

function formatAddress(address?: string) {
  if (!address) return null;
  return `${address.slice(0, 6)}…${address.slice(38, 42)}`;
}

const DisplayConnectedWallet = () => {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const formattedAddress = formatAddress(address);

  const items: MenuProps["items"] = [
    {
      label: <a onClick={() => disconnect()}>Disconnect</a>,
      key: "0",
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <Button
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
        onClick={(e) => e.preventDefault()}
        icon={<img width="14px" src={connector?.icon} />}
      >
        {formattedAddress}
      </Button>
    </Dropdown>
  );
};

export default DisplayConnectedWallet;
