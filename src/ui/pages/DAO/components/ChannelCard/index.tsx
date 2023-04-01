import React from "react";
import { UNKNOWN_TOKEN_IMAGE } from "../../../../../consts/global";
interface IChannelCardProps {
  logo?: string;
  symbol: string;
}
const ChannelCard = ({ logo, symbol }: IChannelCardProps) => {
  return (
    <div className="box is-shadowless has-text-centered">
      <div
        className="image is-64x64 mb-2"
        style={{ margin: "auto", borderRadius: "50%" }}
      >
        <img
          onError={(e) => {
            // @ts-ignore
            e.target.src = UNKNOWN_TOKEN_IMAGE;
          }}
          src={logo ? logo : UNKNOWN_TOKEN_IMAGE}
        />
      </div>
      <strong>{symbol}</strong>
    </div>
  );
};

export default ChannelCard;
