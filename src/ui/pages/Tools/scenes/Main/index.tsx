import React from "react";
import { TOOLS_PAGE_ROUTE } from "../../../../../consts/neoRoutes";
import { Link } from "react-router-dom";
import { useApp } from "../../../../../common/hooks/use-app";
import PageLayout from "../../../../components/Commons/PageLayout";
import { Avatar } from "antd";

const ToolsMain = () => {
  const { chain, network } = useApp();
  return (
    <PageLayout>
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="box is-shadowless">
            <h1 className="title is-5">Web3 Tools</h1>
          </div>

          {TOOLS_PAGE_ROUTE.category.map((p: any) => {
            const _chain: any = p.chain[chain];
            if (!_chain) return <></>;
            if (!_chain.includes(network)) return <></>;
            if (p.noShow) return false;
            return (
              <div className="media box is-shadowless" key={p.path}>
                <div className="media-left">
                  <Avatar
                    size={64}
                    icon={typeof p.icon === "string" ? undefined : <p.icon color="black" background="white" />}
                    src={typeof p.icon === "string" ? p.icon : undefined}
                  />
                </div>
                <div className="media-content">
                  <Link to={p.path} className="has-text-dark">
                    <strong>{p.label}</strong>
                    <p>{p.description}</p>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

export default ToolsMain;
