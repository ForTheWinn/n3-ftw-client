import React from "react";
import { FaCog } from "react-icons/fa";
import AddLiquidityButton from "./AddLiquidityButton";
import RemoveLiquidityButton from "./RemoveLiquidityButton";

interface ISwapNavProps {
  rootPath: string;
  search?: string;
  onSettingClick?: () => void;
}
const SwapNav = ({ rootPath, search, onSettingClick }: ISwapNavProps) => {
  return (
    <div className="level is-mobile">
      <div className="level-left is-hidden-mobile">
        <div className="level-item">
          <h1 className="title is-5 is-marginless ">Swap</h1>
        </div>
      </div>

      <div className="level-right">
        <div className="level-item">
          <div className="buttons">
            <AddLiquidityButton rootPath={rootPath} search={search} />
            <RemoveLiquidityButton rootPath={rootPath} />
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
  );
};

export default SwapNav;
