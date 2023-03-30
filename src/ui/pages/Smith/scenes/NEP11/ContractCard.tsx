import React, { useState } from "react";
import { ISmithNEP11Record } from "../../../../../packages/neo/contracts/ftw/smith/interfaces";
import {
  MAINNET,
  UNKNOWN_TOKEN_IMAGE
} from "../../../../../packages/neo/consts";
import { useWallet } from "../../../../../packages/neo/provider";
import { FaExternalLinkAlt } from "react-icons/fa";
import Tokens from "./Tokens";
import {
  SMITH_CONTRACT_NEP11_PATH,
  SMITH_CONTRACT_NEP17_PATH
} from "../../../../../consts";
import { Link } from "react-router-dom";

interface IContractCardProps {
  data: ISmithNEP11Record;
}
const ContractCard = ({ data }: IContractCardProps) => {
  const manifest = data.manifest ? JSON.parse(data.manifest) : {};
  return (
    <div>
      <Link to={`${SMITH_CONTRACT_NEP11_PATH}/${data.contractHash}`}>
        <div className="has-text-centered">
          <div
            className="image is-64x64 mb-2"
            style={{ margin: "auto", borderRadius: "50%", width: "40px" }}
          >
            <img
              onError={(e) => {
                // @ts-ignore
                e.target.src = UNKNOWN_TOKEN_IMAGE;
              }}
              src={
                manifest && manifest.logo ? manifest.logo : UNKNOWN_TOKEN_IMAGE
              }
            />
          </div>
          <p className="heading">{data.symbol}</p>
        </div>
      </Link>
    </div>
  );
};

export default ContractCard;
