import React, { useEffect, useState } from "react";
import { List, Pagination } from "antd";
import { SmithContract } from "../../../../../../../packages/neo/contracts/ftw/smith";
import { useApp } from "../../../../../../../common/hooks/use-app";
import { NEO_CHAIN } from "../../../../../../../consts/global";
import { setTokenData } from "../../../../../../../packages/evm/contracts/smith";

import ListTabs from "../../components/ListTabs";
import TokenCard from "./TokenCard";
import Banner from "../../components/Header";
import PageLayout from "../../../../../../components/Commons/PageLayout";
import { useWalletRouter } from "../../../../../../../common/hooks/use-wallet-router";
import { useNeoWallets } from "../../../../../../../common/hooks/use-neo-wallets";
import UpdateTokenMetadataModal from "../../components/UpdateTokenMetadataModal";

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
  const { address } = useWalletRouter(chain);
  const { connectedWallet } = useNeoWallets();

  const onUpdate = async (values) => {
    try {
      let res;
      if (chain === NEO_CHAIN) {
        if (connectedWallet) {
          res = await new SmithContract(network).updateManifest(
            connectedWallet,
            values.contractHash,
            JSON.stringify({
              logo: values.icon,
              website: values.website,
            })
          );
        }
      } else {
        return await setTokenData(
          chain,
          network,
          values.contractHash,
          values.icon,
          values.website
        );
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
          res = await new SmithContract(network).getNEP11Records(page);
        } else {
          // res = await getTokenList(chain, network);
          res = [];
          res.totalPages = 1;
        }
        setData(res.items);
        setTotalPages(res.totalPages);
      } catch (e) {
        setError(true);
      }
      setLoading(false);
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
                <ListTabs />

                <List
                  itemLayout="horizontal"
                  dataSource={data}
                  loading={loading}
                  renderItem={(item: any, index) => (
                    <TokenCard
                      key={index}
                      chain={chain}
                      network={network}
                      owner={item.owner}
                      contractHash={item.contractHash}
                      name={item.name}
                      symbol={item.symbol}
                      website={item.website}
                      icon={item.icon}
                      isContractOwner={address === item.owner}
                      onUpdate={() => {
                        setUpdateModalObj({
                          contractHash: item.contractHash,
                          website: item.website,
                          icon: item.icon,
                        });
                      }}
                    />
                  )}
                />

                {totalPages > 1 && (
                  <>
                    <hr />
                    <Pagination
                      total={data.totalPages}
                      current={page}
                      onChange={(v) => {
                        if (page !== v) {
                          setPage(v);
                        }
                      }}
                    />
                  </>
                )}

                {updateModalObj && (
                  <UpdateTokenMetadataModal
                    data={updateModalObj}
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
