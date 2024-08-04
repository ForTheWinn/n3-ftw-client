import React, { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  List,
  Space,
  Spin,
  Typography,
} from "antd";
import { IToken } from "../../../../consts/tokens";
import { CHAINS } from "../../../../consts/chains";
import { INetworkType } from "../../../../packages/neo/network";
import { fetchTokenInfo } from "../../../../common/routers/global";
import { TOKEN_FETCH_ERROR } from "../../../../consts/messages";
import { getExplorer, getTokenByHash } from "../../../../common/helpers";
import { LocalStorage } from "../../../../packages/neo/local-storage";

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
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let _token = getTokenByHash(chain, network, token);
        if (_token) {
          setIsVerified(true);
          setCustomToken(_token);
        } else {
          const res = await fetchTokenInfo(chain, network, token);
          if (res) {
            setCustomToken(res);
          } else {
            setError(TOKEN_FETCH_ERROR);
          }
        }
      } catch (error) {
        setError(TOKEN_FETCH_ERROR);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <Card size="small">
      <List>
        {isLoading && (
          <List.Item>
            <Spin />
          </List.Item>
        )}
        {error && (
          <List.Item
            actions={[
              <Button onClick={onCancel} size="small" type="link">
                Reset
              </Button>,
            ]}
          >
            <Alert showIcon type="error" message={error} />
          </List.Item>
        )}
        {customToken && (
          <List.Item onClick={() => onClick(customToken)}>
            <Space direction="vertical">
              <Space>
                <Avatar size="small" src={customToken.icon} />
                <Typography.Text>{customToken.symbol}</Typography.Text>
                {customToken.name && (
                  <Typography.Text>({customToken.name})</Typography.Text>
                )}
              </Space>
              {!isVerified && (
                <Alert
                  type="warning"
                  message={
                    <Space direction="vertical">
                      <Typography.Text>
                        Ensure that the token address is correct and from a
                        trusted source to prevent any potential security risks.
                      </Typography.Text>
                      <Space>
                        <Button
                          target="_blank"
                          href={`${getExplorer(chain, network, "contract")}/${
                            customToken.hash
                          }`}
                          size="small"
                        >
                          View Token Details
                        </Button>
                        <Button
                          onClick={() =>
                            LocalStorage.setToken(chain, network, {
                              ...customToken,
                            })
                          }
                          type="primary"
                          size="small"
                        >
                          Save Token
                        </Button>
                      </Space>
                    </Space>
                  }
                />
              )}
            </Space>
          </List.Item>
        )}
      </List>

      {/* <a onClick={handleClick} className="panel-block is-clickable">
        <Space>
          <Avatar size="small" src={customToken.icon} />
          <Typography.Text strong>{customToken.symbol}</Typography.Text>
          {customToken.name && (
            <Typography.Text>({customToken.name})</Typography.Text>
          )}
        </Space>
      </a> */}
    </Card>
  );
};

export default DisplayCustomToken;
