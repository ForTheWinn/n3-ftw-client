import React, { useState } from "react";
import { Link } from "react-router-dom";
import ModalCard from "../../../../../components/Modal";
import SmithInfo from "./SmithInfo";
import {
  SMITH_CREATE_NEP11_PATH,
  SMITH_CREATE_NEP17_PATH
} from "../../../../../../consts/routes";
import Level from "../../../../../components/Level";
import { Avatar, Space } from "antd";
import { CONFIGS } from "../../../../../../consts/chains";
import { useApp } from "../../../../../../common/hooks/use-app";

const Header = () => {
  const { network, chain } = useApp();
  const [isInfoModalActive, setInfoModalActive] = useState(false);
  return (
    <div className="box is-shadowless">
      <Level
        left={
          <Space>
            <Avatar src={CONFIGS[network][chain].icon} />
            <div className="is-block">
              <h1 className="title is-5">Smith</h1>
              <p>Launch your tokens without codes.</p>
              <button
                onClick={() => setInfoModalActive(true)}
                className="button is-light is-small mt-3"
              >
                Learn more
              </button>
            </div>
          </Space>
        }
        right={
          <div className="buttons">
            <Link
              to={SMITH_CREATE_NEP17_PATH}
              className="button is-primary is-light"
            >
              Create
            </Link>
            {/* <Link
              to={SMITH_CREATE_NEP11_PATH}
              className="button is-success is-light"
            >
              NFT Contract
            </Link> */}
          </div>
        }
      />

      {isInfoModalActive && (
        <ModalCard onClose={() => setInfoModalActive(false)}>
          <SmithInfo />
        </ModalCard>
      )}
    </div>
  );
};

export default Header;
