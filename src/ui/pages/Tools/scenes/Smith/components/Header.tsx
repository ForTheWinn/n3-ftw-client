import React, { useState } from "react";
import { Link } from "react-router-dom";
import ModalCard from "../../../../../components/Modal";
import SmithInfo from "./SmithInfo";
import { SMITH_CREATE_NEP17_PATH } from "../../../../../../consts/routes";
import Level from "../../../../../components/Level";
import { Avatar, Space } from "antd";
import { CONFIGS } from "../../../../../../consts/chains";
import { useApp } from "../../../../../../common/hooks/use-app";

const Header = () => {
  const [isInfoModalActive, setInfoModalActive] = useState(false);
  return (
    <div className="box is-shadowless">
      <Level
        left={
          <div>
            <h1 className="title is-5">Smith</h1>
            <p className="subtitle is-7">
              Effortlessly generate and launch your own token with Smith,
              eliminating the need for complex coding.
              <br />
              <a onClick={() => setInfoModalActive(true)}>Learn more</a>
            </p>
          </div>
        }
        right={
          <Link
            to={SMITH_CREATE_NEP17_PATH}
            className="button is-primary is-light is-fullwidth"
          >
            Create
          </Link>
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
