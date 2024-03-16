import React, { useState, useEffect } from "react";
import { List, Pagination, Result } from "antd";

import PageLayout from "../../../../../../components/Commons/PageLayout";
import Banner from "../../components/Header";
import TokenCard from "./TokenCard";
import TokenMetaUpdateModal from "../../components/UpdateTokenMetadataModal";

import { useTokenData } from "./hooks";
import { useApp } from "../../../../../../../common/hooks/use-app";
import { useWalletRouter } from "../../../../../../../common/hooks/use-wallet-router";
import { ISmithTokenProps } from "../../../../../../../common/routers/smith/interfaces";

export interface ITokenStateProps {
  contractHash: string;
  website?: string;
  icon?: string;
}

const TokenMainPage = () => {
  const { chain, network } = useApp();
  const { address } = useWalletRouter(chain);
  const [page, setPage] = useState(1);
  const [updateModalObj, setUpdateModalObj] = useState<ITokenStateProps>();
  const { data, loading, error, totalPages, fetchData }: any = useTokenData(
    chain,
    network,
    page
  );

  useEffect(() => {
    fetchData();
  }, [page, fetchData]);

  if (error) {
    return (
      <Result status="warning" title="There are some problems to load data." />
    );
  }

  return (
    <PageLayout>
      <div className="columns is-centered">
        <div className="column is-8">
          <Banner />
          <div className="box is-shadowless">
            <h6 className="title is-6">Showcases</h6>
            <List
              itemLayout="horizontal"
              dataSource={data}
              loading={loading}
              renderItem={(item: ISmithTokenProps, index) => (
                <TokenCard
                  key={index}
                  chain={chain}
                  network={network}
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
            {updateModalObj && (
              <TokenMetaUpdateModal
                data={updateModalObj}
                onClose={() => setUpdateModalObj(undefined)}
              />
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TokenMainPage;
