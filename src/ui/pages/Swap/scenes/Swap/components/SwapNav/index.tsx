import React from "react";
import { FaCog } from "react-icons/fa";
import AddLiquidityButton from "./AddLiquidityButton";
import RemoveLiquidityButton from "./RemoveLiquidityButton";
import { CHAINS, CONFIGS } from "../../../../../../../consts/chains";
import { Avatar, Space } from "antd";
import { INetworkType } from "../../../../../../../packages/neo/network";

interface ISwapNavProps {
  chain: CHAINS;
  network: INetworkType;
  search?: string;
  onSettingClick?: () => void;
}
const SwapNav = ({ chain, search, network, onSettingClick }: ISwapNavProps) => {
  return (
    <div className="box is-shadowless mb-1">
      <div className="level is-mobile is-marginless">
        <div className="level-left is-hidden-mobile">
          <div className="level-item">
            <h1 className="title is-5 is-marginless ">
              <Space>
                <Avatar src={CONFIGS[network][chain].icon} />
                <h1 className="title is-5 is-marginless">Swap</h1>
              </Space>
            </h1>
          </div>
        </div>

        <div className="level-right">
          <div className="level-item">
            <div className="buttons">
              <AddLiquidityButton search={search} />
              <RemoveLiquidityButton />
              {onSettingClick ? (
                <button
                  onClick={onSettingClick}
                  className="button is-white is-small"
                >
                  <FaCog />
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapNav;
