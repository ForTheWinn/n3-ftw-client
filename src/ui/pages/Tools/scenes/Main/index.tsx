import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../../../../common/hooks/use-app";
import PageLayout from "../../../../components/Commons/PageLayout";
import { Avatar, List } from "antd";
import { TOOLS_PAGE_ROUTE } from "../../../../../consts/routes";

const ToolsMain = () => {
  const { chain, network } = useApp();
  return (
    <PageLayout>
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="box is-shadowless">
            <h1 className="title is-5">Web3 Tools</h1>
            <List
              itemLayout="horizontal"
              dataSource={TOOLS_PAGE_ROUTE.category}
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

export default ToolsMain;
