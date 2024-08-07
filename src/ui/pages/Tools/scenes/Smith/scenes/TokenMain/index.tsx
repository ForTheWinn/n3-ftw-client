import React, { useState, useEffect } from "react";
import { Card, Flex, List, Pagination, Radio, Result, Space } from "antd";

import PageLayout from "../../../../../../components/Commons/PageLayout";
import Banner from "../../components/Header";
import TokenCard from "./TokenCard";
import TokenMetaUpdateModal from "../../components/UpdateTokenMetadataModal";

import { useTokenData } from "./hooks";
import { useApp } from "../../../../../../../common/hooks/use-app";
import { useWalletRouter } from "../../../../../../../common/hooks/use-wallet-router";
import { ISmithTokenProps } from "../../../../../../../common/routers/smith/interfaces";
import { SMITH } from "../../../../../../../consts/global";
import { SMITH_BLACKLIST_HASHES, SMITH_BLACKLIST_NAMES } from "./consts";

export interface ITokenStateProps {
  contractHash: string;
  website?: string;
  icon?: string;
}

const TokenMainPage = () => {
  const { chain, network } = useApp();
  const { address } = useWalletRouter(chain);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"filtered" | "all">("filtered");
  const [updateModalObj, setUpdateModalObj] = useState<ITokenStateProps>();
  const { data, loading, error, totalPages, prices, fetchData }: any =
    useTokenData(chain, network, page);

  useEffect(() => {
    fetchData();
  }, [page, fetchData]);

  if (error) {
    return (
      <Result status="warning" title="There are some problems to load data." />
    );
  }

  let filteredData = [];

if (data) {
  if (viewMode === "filtered") {
    const blacklistNames = SMITH_BLACKLIST_NAMES.map((name) =>
      name.toLowerCase()
    );
    const blacklistHashes = SMITH_BLACKLIST_HASHES;
    filteredData = data.filter((item: ISmithTokenProps) => {
      // Check if the token address matches any hash in the blacklist
      const isHashBlacklisted = blacklistHashes.includes(item.tokenAddress);

      // Check if the name contains any blacklisted word
      const isNameBlacklisted = blacklistNames.some((blacklistName) =>
        item.name.toLowerCase().includes(blacklistName)
      );

      return !isHashBlacklisted && !isNameBlacklisted;
    });
  } else {
    filteredData = data;
  }
}

  return (
    <PageLayout>
      <div className="columns is-centered">
        <div className="column is-8">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Banner />
            <Card>
              <Flex justify="space-between" align="center">
                <h6 className="title is-6 is-marginless">Showcases</h6>
                <Space>
                  <Radio.Group
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                  >
                    <Radio.Button value="filtered">List</Radio.Button>
                    <Radio.Button value="all">All</Radio.Button>
                  </Radio.Group>
                </Space>
              </Flex>
            </Card>
            <List
              itemLayout="vertical"
              grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 4,
                lg: 4,
                xl: 6,
                xxl: 3,
              }}
              dataSource={filteredData}
              loading={loading}
              renderItem={(item: ISmithTokenProps, index) => (
                <TokenCard
                  key={index}
                  chain={chain}
                  network={network}
                  price={prices?.[item.tokenAddress]}
                  {...item}
                  isContractOwner={address === item.owner}
                  onUpdate={() =>
                    setUpdateModalObj({
                      contractHash: item.tokenAddress,
                      website: item.website,
                      icon: item.icon,
                    })
                  }
                />
              )}
            />
            {totalPages > 1 && (
              <Pagination
                total={totalPages}
                current={page}
                onChange={(_page) => {
                  if (page !== _page) {
                    setPage(_page);
                  }
                }}
              />
            )}
          </Space>

          {updateModalObj && (
            <TokenMetaUpdateModal
              data={updateModalObj}
              onClose={() => setUpdateModalObj(undefined)}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default TokenMainPage;
