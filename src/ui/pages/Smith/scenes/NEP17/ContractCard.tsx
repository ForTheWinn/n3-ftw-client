import React from "react";
import { ISmithNEP17Record } from "../../../../../packages/neo/contracts/ftw/smith/interfaces";
import {
  UNKNOWN_TOKEN_IMAGE,
} from "../../../../../packages/neo/consts";
import { Link } from "react-router-dom";
import { SMITH_CONTRACT_NEP17_PATH } from "../../../../../consts";

interface IContractCardProps {
  data: ISmithNEP17Record;
}
const ContractCard = ({ data }: IContractCardProps) => {
  const manifest = data.manifest ? JSON.parse(data.manifest) : {};
  return (
    <div>
      <Link to={`${SMITH_CONTRACT_NEP17_PATH}/${data.contractHash}`}>
        <div className="has-text-centered">
          <div
            className="image mb-3"
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
