import React, { useState } from "react";
import {
  SMITH_CREATE_NEP11_PATH,
  SMITH_CREATE_NEP17_PATH,
} from "../../../consts";
import { Link, useLocation } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import ModalCard from "../../components/Modal";
import SmithInfo from "./components/SmithInfo";

const Banner = () => {
  const [isInfoModalActive, setInfoModalActive] = useState(false);
  return (
    <div className="box is-shadowless">
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <div className="is-block">
              <h1 className="title is-5 is-marginless">Smith</h1>
              <p>Launch your tokens without codes</p>
            </div>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <div className="buttons">
              <Link
                to={SMITH_CREATE_NEP17_PATH}
                className="button is-success is-light"
              >
                Token Contract
              </Link>
              <Link
                to={SMITH_CREATE_NEP11_PATH}
                className="button is-info is-light"
              >
                NFT Contract
              </Link>
              <button
                onClick={() => setInfoModalActive(true)}
                className="button is-white"
              >
                <FaInfoCircle />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isInfoModalActive && (
        <ModalCard onClose={() => setInfoModalActive(false)}>
          <SmithInfo />
        </ModalCard>
      )}
    </div>
  );
};

export default Banner;
