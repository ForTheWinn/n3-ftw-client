import React, { useState } from "react";
import PageLayout from "../../../../components/Commons/PageLayout";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import { useApp } from "../../../../../common/hooks/use-app";
import { swapRouter } from "../../../../../common/routers";
import { ISwapLPToken } from "../../../../../common/routers/swap/interfaces";
import LPTokenCard from "../../../../components/LPTokenCard";
import { WENT_WRONG } from "../../../../../consts/messages";
import {
  Divider,
  Row,
  Col,
  Input,
  Typography,
  Alert,
  Spin,
  Card,
  Space,
} from "antd";


const LPTokens = () => {
  const location = useLocation();
  const history = useHistory();
  const params = queryString.parse(location.search);
  const { chain, network } = useApp();
  const [token, setToken] = useState<ISwapLPToken | undefined>();
  const [error, setError] = useState("");
  const [isSearching, setSearching] = useState(false);

  const onSearch = async (tokenId) => {
    if (tokenId) {
      try {
        setSearching(true);
        setError("");
        const token: ISwapLPToken | undefined = await swapRouter.getLPToken(
          chain,
          network,
          tokenId
        );
        setToken(token);
        let search = `?id=${tokenId}`;
        history.push(search);
      } catch (e: any) {
        setError(e.message ? e.message : WENT_WRONG);
      }
      setSearching(false);
    }
  };

  return (
    <PageLayout>
      <Row justify="center">
        <Col xs={24} sm={18} md={8}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Card>
              <h1 className="title is-5">LP Value Finder</h1>
              <p className="subtitle is-7">
                Enter LP token ID to find the token value.
              </p>
              <Divider />
              <Input.Search
                defaultValue={params && params.id ? (params.id as any) : ""}
                placeholder="Enter LP token ID"
                onSearch={onSearch}
                enterButton="Search"
              />
            </Card>
            {error && (
              <Alert
                message={"Failed to load. Check your token id and try again."}
                type="error"
                showIcon
              />
            )}
            {isSearching ? (
              <Card>
                <Spin tip="Searching..." />
              </Card>
            ) : token ? (
              <LPTokenCard {...token} />
            ) : null}
          </Space>
        </Col>
      </Row>
    </PageLayout>
  );
};

export default LPTokens;
