import React from "react";
import PageLayout from "../../../components/Commons/PageLayout";
import { NFT_ROUTE } from "../../../../consts/routes";
import { useApp } from "../../../../common/hooks/use-app";
import { Avatar, List } from "antd";
import { Link } from "react-router-dom";

const NFTCollectionMain = () => {
  const { chain, network } = useApp();
  return (
    <PageLayout>
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="box is-shadowless">
            <h1 className="title is-5">NFT Collections</h1>
            <List
              itemLayout="horizontal"
              dataSource={NFT_ROUTE.category}
              renderItem={(item: any, index) => {
                const _chain: any = item.chain[chain];
                if (!_chain) return <></>;
                if (!_chain.includes(network)) return <></>;
                if (item.noShow) return false;
                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Link to={item.path}>
                          <Avatar size="large" src={item.icon} />
                        </Link>
                      }
                      title={
                        <Link to={item.path}>
                          <strong>{item.label}</strong>
                        </Link>
                      }
                      description={item.description}
                    />
                  </List.Item>
                );
              }}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NFTCollectionMain;
