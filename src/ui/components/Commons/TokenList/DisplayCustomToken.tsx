import React, { useEffect, useState } from "react";
import { Avatar, Space } from "antd";
import { ITokenState } from "../../../pages/Swap/scenes/Swap/interfaces";
import { globalRouter } from "../../../../common/routers";
import { CHAINS } from "../../../../consts/chains";
import { INetworkType } from "../../../../packages/neo/network";
import CustomTokenWarning from "./CustomTokenWarning";
import { SWAP_TOKEN_LIST } from "../../../../consts/tokens";

interface IDisplayCustomTokenProps {
  chain: CHAINS;
  network: INetworkType;
  token: string;
  onClick: (token: ITokenState) => void;
  onCancel: () => void;
}
const DisplayCustomToken = ({
  chain,
  network,
  token,
  onClick,
  onCancel
}: IDisplayCustomTokenProps) => {
  const [customToken, setCustomToken] = useState<ITokenState | undefined>();
  const [hasError, setError] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  useEffect(() => {
    const fetchToken = async () => {
      setError(false);
      try {
        let target;
        SWAP_TOKEN_LIST[chain][network].forEach((t) => {
          if (t.hash === token) {
            target = t;
          }
        });
        if (target) {
          setIsVerified(true);
          setCustomToken(target);
        } else {
          const res = await globalRouter.fetchTokenInfo(chain, network, token);
          setCustomToken({
            hash: token,
            decimals: res.decimals,
            symbol: res.symbol,
            icon: ""
          });
        }
      } catch (e) {
        console.error(e);
        setError(true);
      }
    };
    if (token) {
      fetchToken();
    }
  }, [token]);

  const handleClick = () => {
    if (isVerified && customToken) {
      onClick(customToken);
    } else {
      setShowConfirm(true);
    }
  };

  if (hasError) return <div className="panel-block">No result</div>;
  if (!customToken) return <></>;
  if (showConfirm)
    return (
      <CustomTokenWarning
        onOk={onClick}
        onCancel={onCancel}
        chain={chain}
        network={network}
        token={customToken}
      />
    );
  return (
    <>
      <a onClick={handleClick} className="panel-block is-clickable">
        <Space>
          <Avatar size="small" src={customToken.icon} />
          {customToken.symbol}
        </Space>
      </a>
    </>
  );
};

export default DisplayCustomToken;
