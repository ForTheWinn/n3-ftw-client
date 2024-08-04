import React, { useState } from "react";
import { Divider, Input, Modal } from "antd";

import { IToken } from "../../../../consts/tokens";
import { CHAINS } from "../../../../consts/chains";
import { INetworkType } from "../../../../packages/neo/network";
import { ethers } from "ethers";
import DisplayTokenList from "./DisplayTokenList";
import DisplayCustomToken from "./DisplayCustomToken";
import { getTokenList } from "../../../../common/helpers";

interface IAssetListModalProps {
  chain: CHAINS;
  network: INetworkType;
  activeTokenInput: "A" | "B" | undefined;
  tokenAHash?: string;
  tokenBHash?: string;
  onClose: () => void;
  onAssetClick: (token: IToken) => void;
}

const TokenList = ({
  chain,
  network,
  onAssetClick,
  onClose,
}: IAssetListModalProps) => {
  const [customContract, setCustomContract] = useState<string | undefined>();
  const [symbol, setSymbol] = useState<string | undefined>();
  let tokenList: any = getTokenList(chain, network);
  const onSearch = (value, _e, info) => {
    if (info.source === "clear") {
      onReset();
      return;
    }
    if (ethers.isAddress(value)) {
      setCustomContract(value);
    } else {
      setSymbol(value);
    }
  };

  const onReset = () => {
    setCustomContract(undefined);
    setSymbol(undefined);
  };

  if (symbol) {
    tokenList = tokenList.filter((token) =>
      token.symbol.toLowerCase().includes(symbol.toLowerCase())
    );
  } else {
    tokenList = getTokenList(chain, network);
  }

  return (
    <>
      <Modal
        title="Select a token"
        centered
        open={true}
        onCancel={onClose}
        footer={null}
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
            tokenList={tokenList}
            chain={chain}
            network={network}
            onClick={onAssetClick}
          />
        )}
        <Divider />
        <Input.Search
          placeholder="0x.."
          allowClear
          onSearch={onSearch}
          onPressEnter={(e: any) =>
            onSearch(e.target.value, e, { source: "input" })
          }
        />
      </Modal>
    </>
  );
};

export default TokenList;
