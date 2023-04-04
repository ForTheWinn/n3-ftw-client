import React from "react";
import { FaCog } from "react-icons/fa";
import AddLiquidityButton from "./AddLiquidityButton";
import RemoveLiquidityButton from "./RemoveLiquidityButton";
import { NEO_ROUTES } from "../../../../../../../consts";

interface ISwapNavProps {
  search?: string;
  onSettingClick?: () => void;
}
const SwapNav = ({ search, onSettingClick }: ISwapNavProps) => {
  return (
    <div className="level is-mobile is-marginless">
      <div className="level-left is-hidden-mobile">
        <div className="level-item">
          <h1 className="title is-5 is-marginless ">Swap</h1>
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
  );
};

export default SwapNav;
