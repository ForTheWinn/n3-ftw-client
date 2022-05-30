import React, { useState, useEffect, useRef } from "react";
import { FaCog } from "react-icons/fa";
import NumberFormat from "react-number-format";
import {DEFAULT_SLIPPAGE} from "../../../../../packages/neo/contracts/ftw/swap/consts";

interface ISettingDropdownProps {
  slippage: number;
  setSlippage: (val: number) => void;
}
function useOutsideAlerter(ref, handler) {
	useEffect(() => {
		/**
		 * Alert if clicked on outside of element
		 */
		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target)) {
				handler()
			}
		}
		// Bind the event listener
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref]);
}

const SettingDropdown = ({ slippage, setSlippage }: ISettingDropdownProps) => {
  const [isActive, setActive] = useState(false);
	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef, () => setActive(false));
  return (
    <div ref={wrapperRef} className={`dropdown is-right ${isActive ? "is-active" : ""}`}>
      <div className="dropdown-trigger">
        <button
          onClick={() => setActive(!isActive)}
          className="button is-white is-small"
        >
          <FaCog />
        </button>
      </div>
      <div className="dropdown-menu">
        <div className="dropdown-content">
          <div className="dropdown-item">
            <div className="field">
              <label className="label is-size-7">Slippage tolerance</label>
              <NumberFormat
                autoFocus={true}
                decimalScale={2}
                inputMode="decimal"
                className="input is-small"
                value={slippage}
                onValueChange={(value) => {
                  if (value.floatValue) {
                    setSlippage(value.floatValue);
                  }else{
	                  setSlippage(DEFAULT_SLIPPAGE);
                  }
                }}
                isAllowed={(values) => {
                  const { floatValue } = values;
                  if (floatValue) {
                    return floatValue >= 0.01 && floatValue <= 50;
                  }
                  return true;
                }}
                thousandSeparator={true}
                suffix={"%"}
                allowLeadingZeros={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingDropdown;
