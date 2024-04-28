import { Button } from "antd";
import React from "react";

interface IHeaderProps {
  nep: string;
}
const FreeSpinHeader = ({ nep }: IHeaderProps) => {
  return (
    <div className="columns is-multiline">
      <div className="column">
        <div className="media" style={{ alignItems: "center" }}>
          <div className="media-left">
            <figure className="image is-64x64">
              <img src="/symbols/nep.png" alt="NEP logo" />
            </figure>
          </div>
          <div className="media-content title is-5">
            Free spin to win {nep ? nep : ""} NEP
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeSpinHeader;
