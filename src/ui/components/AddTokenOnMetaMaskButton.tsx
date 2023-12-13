import React from "react";
import { Button, Space, message } from "antd";

interface IAddTokenButtonProps {
  address: string;
  symbol: string;
  decimals: number;
  image: string;
  chainId: number;
  chainName: string;
}
const AddTokenButton = (props: IAddTokenButtonProps) => {
  const handleClick = async () => {
    // Check if MetaMask is installed
    //@ts-ignore
    if (window.ethereum && window.ethereum.isMetaMask) {
      //@ts-ignore
      const currentChainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      if (parseInt(currentChainId, 16) !== props.chainId) {
        message.error(
          `Please switch your MetaMask network to ${props.chainName}`
        );
        return;
      }

      try {
        //@ts-ignore
        await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: props,
          },
        });
      } catch (error: any) {
        message.error("Error adding token:", error.message);
      }
    } else {
      message.error("MetaMask is not installed.");
    }
  };

  return (
    <Button onClick={handleClick}>
      <Space align="center">
        <div style={{ height: "15px", display: "flex", alignItems: "center" }}>
          <img src="/icons/metamask.svg" width={"15px"} />
        </div>
        Add Token to MetaMask
      </Space>
    </Button>
  );
};

export default AddTokenButton;
