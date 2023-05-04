import React, { useState } from "react";

// import Modal from "../../Modal";
import { Input, Modal } from "antd";

import { FaSearch } from "react-icons/fa";

import { ITokenState } from "../../../pages/Swap/scenes/Swap/interfaces";
import { CHAINS } from "../../../../consts/chains";
import { INetworkType } from "../../../../packages/neo/network";
import { ethers } from "ethers";
import DisplayTokenList from "./DisplayTokenList";
import DisplayCustomToken from "./DisplayCustomToken";

interface IAssetListModalProps {
  chain: CHAINS;
  network: INetworkType;
  activeTokenInput: "A" | "B" | undefined;
  tokenAHash?: string;
  tokenBHash?: string;
  onClose: () => void;
  onAssetClick: (token: ITokenState) => void;
}

const TokenList = ({
  chain,
  network,
  onAssetClick,
  onClose
}: IAssetListModalProps) => {
  const [search, setSearch] = useState<string | undefined>();
  const [customContract, setCustomContract] = useState<string | undefined>();

  const searchContract = async (value: string) => {
    if (value && ethers.utils.isAddress(value)) {
      setCustomContract(value);
    } else {
      if (!value) {
        setCustomContract(undefined);
      }
      setSearch(value);
    }
  };

  const onReset = () => {
    setCustomContract(undefined);
    setSearch(undefined);
  };

  return (
    <>
      <Modal
        style={{ padding: "0!important" }}
        title="Select a token"
        centered
        open={true}
        onCancel={onClose}
        // footer={null}
        bodyStyle={{ padding: "-10px" }}
        footer={
          <nav
            className="panel is-shadowless"
            style={{
              border: "1px solid #eee",
              height: "500px",
              overflowY: "auto"
            }}
          >
            {customContract ? (
              <DisplayCustomToken
                chain={chain}
                network={network}
                token={customContract}
                onClick={onAssetClick}
                onCancel={onReset}
              />
            ) : (
              <DisplayTokenList
                keyword={search}
                chain={chain}
                network={network}
                onClick={onAssetClick}
              />
            )}
          </nav>
        }
      >
        <Input
          onChange={(e) => searchContract(e.target.value)}
          placeholder="Search symbol or paste contract address"
          prefix={<FaSearch />}
        />

        <hr />
      </Modal>
    </>
  );
};

export default TokenList;
