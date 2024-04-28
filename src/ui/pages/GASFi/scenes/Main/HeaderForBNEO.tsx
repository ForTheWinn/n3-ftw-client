import { Button } from "antd";
import React from "react";

interface IHeaderProps {
  data?: {
    neo: number;
    gas: number;
    isUserStaked: boolean;
  };
  openStakeModal: () => void;
}
const Header = ({ data, openStakeModal }: IHeaderProps) => {
  return (
    <div className="columns is-multiline">
      <div className="column">
        <div className="media" style={{ alignItems: "center" }}>
          <div className="media-left">
            <figure className="image is-64x64">
              <img src="/symbols/bneo.jpeg" alt="bNEO logo" />
            </figure>
          </div>
          <div className="media-content">
            {data ? data.neo : ""} bNEO
            <br />
            {data ? data.gas : ""} GAS
          </div>
        </div>
      </div>
      <div
        className="column is-narrow"
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {data && (
          <>
            {data.isUserStaked ? (
              <Button type="default" onClick={openStakeModal}>
                Unstake
              </Button>
            ) : (
              <Button type="primary" onClick={openStakeModal}>
                Stake
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
