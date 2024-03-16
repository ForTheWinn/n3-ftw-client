import React, { useEffect, useState } from "react";
import { Avatar, Space } from "antd";
import { IToken } from "../../../../consts/tokens";
import { CHAINS } from "../../../../consts/chains";
import { INetworkType } from "../../../../packages/neo/network";
import CustomTokenWarning from "./CustomTokenWarning";
import { fetchTokenInfo } from "../../../../common/routers/global";
import { TOKEN_FETCH_ERROR } from "../../../../consts/messages";
import { getTokenByHash } from "../../../../common/helpers";

interface IDisplayCustomTokenProps {
  chain: CHAINS;
  network: INetworkType;
  token: string;
  onClick: (token: IToken) => void;
  onCancel: () => void;
}
const DisplayCustomToken = ({
  chain,
  network,
  token,
  onClick,
  onCancel,
}: IDisplayCustomTokenProps) => {
  const [customToken, setCustomToken] = useState<IToken | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  useEffect(() => {
    const fetchToken = async () => {
      setError(undefined);
      let _token = getTokenByHash(chain, network, token);
      if (_token) {
        setIsVerified(true);
        setCustomToken(_token);
      } else {
        const res = await fetchTokenInfo(chain, network, token);
        if (res) {
          setCustomToken({
            hash: token,
            decimals: res.decimals,
            symbol: res.symbol,
            icon: "",
          });
        } else {
          setError(TOKEN_FETCH_ERROR);
        }
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

  if (error) return <div className="panel-block">{TOKEN_FETCH_ERROR}</div>;
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
