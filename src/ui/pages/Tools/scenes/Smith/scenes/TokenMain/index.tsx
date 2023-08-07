import React, { useEffect, useState } from "react";
import { List } from "antd";
import { writeContract } from "@wagmi/core";
import { SmithContract } from "../../../../../../../packages/neo/contracts/ftw/smith";
import { useApp } from "../../../../../../../common/hooks/use-app";
import { NEO_CHAIN } from "../../../../../../../consts/global";
import {
  getTokenList,
  setTokenData,
} from "../../../../../../../packages/polygon/contracts/smith";

import TokenCard from "./TokenCard";
import Pagination from "bulma-pagination-react";
import Banner from "../../components/Header";
import PageLayout from "../../../../../../components/Commons/PageLayout";
import TokenMetaUpdateModal from "../../components/UpdateTokenMetadataModal";
import { useWalletRouter } from "../../../../../../../common/hooks/use-wallet-router";

const TokenMainPage = () => {
  const { chain, network, setTxid, refreshCount } = useApp();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updateModalObj, setUpdateModalObj] = useState<
    { contractHash: string; website: string; icon: string } | undefined
  >();
  const { address, client } = useWalletRouter(chain);

  const onUpdate = async (values) => {
    try {
      let res;
      if (chain === NEO_CHAIN) {
        res = await new SmithContract(network).updateManifest(
          client,
          values.contractHash,
          JSON.stringify({
            logo: values.icon,
            website: values.website,
          })
        );
      } else {
        const script = await setTokenData(
          chain,
          network,
          values.contractHash,
          values.icon,
          values.website
        );
        const tx = await writeContract(script as any);
        res = tx.hash;
      }
      setTxid(res);
    } catch (e) {}
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        let res;
        if (chain === NEO_CHAIN) {
          res = await new SmithContract(network).getNEP17Records(page);
        } else {
          res = await getTokenList(chain, network);
        }
        setData(res.items);
        setTotalPages(res.totalPages);
      } catch (e) {
        console.error(e);
        setError(true);
      }
      setLoading(false);
      setUpdateModalObj(undefined);
    };
    fetch();
  }, [page, refreshCount]);

  return (
    <>
      <PageLayout>
        <div className="columns is-centered">
          <div className="column is-8">
            <div className="">
              <Banner />
              <div className="box is-shadowless">
                {/* <ListTabs /> */}
                <List
                  itemLayout="horizontal"
                  dataSource={data}
                  loading={loading}
                  renderItem={(item: any, index) => {
                    return (
                      <TokenCard
                        key={index}
                        chain={chain}
                        network={network}
                        owner={item.owner}
                        tokenAddress={item.tokenAddress}
                        name={item.name}
                        symbol={item.symbol}
                        website={item.website}
                        icon={item.icon}
                        isContractOwner={address === item.owner}
                        onUpdate={() => {
                          setUpdateModalObj({
                            contractHash: item.tokenAddress,
                            website: item.website,
                            icon: item.icon,
                          });
                        }}
                      />
                    );
                  }}
                />

                {totalPages > 1 && (
                  <>
                    <hr />
                    <Pagination
                      pages={data.totalPages}
                      currentPage={page}
                      onChange={(v) => {
                        if (page !== v) {
                          setPage(v);
                        }
                      }}
                    />
                  </>
                )}

                {updateModalObj && (
                  <TokenMetaUpdateModal
                    {...updateModalObj}
                    onUpdate={onUpdate}
                    onClose={() => setUpdateModalObj(undefined)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default TokenMainPage;
