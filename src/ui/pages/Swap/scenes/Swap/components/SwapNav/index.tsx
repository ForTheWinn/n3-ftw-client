import React from "react";
import { FaCog } from "react-icons/fa";
import AddLiquidityButton from "./AddLiquidityButton";
import RemoveLiquidityButton from "./RemoveLiquidityButton";
import { CHAINS, CONFIGS } from "../../../../../../../consts/chains";
import { Avatar, Button, Dropdown, MenuProps, Space } from "antd";
import { INetworkType } from "../../../../../../../packages/neo/network";
import { SettingOutlined } from "@ant-design/icons";

interface ISwapNavProps {
  chain: CHAINS;
  network: INetworkType;
  search?: string;
  onSettingClick?: () => void;
}
const SwapNav = ({ chain, search, network, onSettingClick }: ISwapNavProps) => {
  const items: MenuProps["items"] = [
    {
      label: <AddLiquidityButton search={search} />,
      key: "0",
    },
    {
      label: <RemoveLiquidityButton />,
      key: "1",
    },
  ];
  return (
    <div className="box is-shadowless mb-1">
      <div className="level is-mobile is-marginless">
        <div className="level-left">
          <div className="level-item">
            <Space>
              <Avatar src={CONFIGS[network][chain].icon} />
              <h1 className="title is-5 is-marginless">Swap</h1>
            </Space>
          </div>
        </div>

        <div className="level-right">
          <div className="level-item">
            <Space>
              <Dropdown
                menu={{ items }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Button onClick={(e) => e.preventDefault()} type="text">
                  Liquidity
                </Button>
              </Dropdown>
              {onSettingClick ? (
                <Button onClick={onSettingClick} type="text">
                  <SettingOutlined />
                </Button>
              ) : (
                <></>
              )}
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapNav;
