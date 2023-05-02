import React from "react";
import PageLayout from "../../../components/Commons/PageLayout";
import { NFT_ROUTE } from "../../../../consts/neoRoutes";
import { useApp } from "../../../../common/hooks/use-app";
import { Avatar } from "antd";
import { Link } from "react-router-dom";

const NFTCollectionMain = () => {
  const { chain, network } = useApp();
  return (
    <PageLayout>
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="box is-shadowless">
            <h1 className="title is-5">NFT Collections</h1>
          </div>

          {NFT_ROUTE.category.map((p: any) => {
            const _chain: any = p.chain[chain];
            if (!_chain) return <></>;
            if (!_chain.includes(network)) return <></>;
            if (p.noShow) return false;
            return (
              <div className="media box is-shadowless" key={p.path}>
                <div className="media-left">
                  <Avatar size={64} src={p.icon} />
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

          <div className="media box is-shadowless">
            <div className="media-left">
              <Avatar size={80} src={"/boyz/sample-matic-boy.png"} />
            </div>
            <div className="media-content">
              <strong>Matic Boyz</strong>
              <p>Coming soon on Polygon</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NFTCollectionMain;