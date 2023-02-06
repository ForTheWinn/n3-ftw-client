import React from "react";
import ReactSwitch from "react-switch";
import DatePicker from "react-datepicker";
import { FaLock } from "react-icons/fa";
interface ITimeLockInputProps {
  toggleSwitch: () => void;
  isActive: boolean;
  lockUntil: Date;
  setLockUntil: (date: Date) => void;
}
const TimeLockInput = ({
  toggleSwitch,
  isActive,
  lockUntil,
  setLockUntil,
}: ITimeLockInputProps) => {
  return (
    <div className="is-block">
      {/*<div className="has-text-right">Lock liquidity</div>*/}

      <div className={`dropdown is-up is-right ${isActive ? "is-active" : ""}`}>
        <div className="dropdown-trigger">
          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <FaLock />
              </div>
              <div className="level-item">
                <ReactSwitch onChange={toggleSwitch} checked={isActive} />
              </div>
            </div>
            <div className="dropdown-menu">
              <div className="dropdown-content">
                <div className="dropdown-item">
                  <DatePicker
                    selected={lockUntil}
                    onChange={(date) => setLockUntil(date)}
                    timeInputLabel="Time:"
                    dateFormat="MM/dd/yyyy h:mm aa"
                    showTimeInput
                    minDate={lockUntil}
                    inline
                  />
                </div>
              </div>
            </div>
          </div>
          {/*<label style={{ display: "flex", alignItems: "center" }}>*/}
          {/*  <ReactSwitch onChange={toggleSwitch} checked={isActive} />*/}
          {/*</label>*/}

          {/*{isActive && (*/}
          {/*  <div className="level-item">*/}
          {/*    <DatePicker*/}
          {/*      selected={lockUntil}*/}
          {/*      onChange={(date) => setLockUntil(date)}*/}
          {/*      timeInputLabel="Time:"*/}
          {/*      dateFormat="MM/dd/yyyy h:mm aa"*/}
          {/*      showTimeInput*/}
          {/*      minDate={lockUntil}*/}
          {/*      inline*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>
      </div>
    </div>
  );
};

export default TimeLockInput;
