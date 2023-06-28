import React, { useState } from "react";
import Modal from "../../../../../components/Modal";

interface IActionModal {
  contractHash: string;
  icon: string;
  website: string;
  onClose: () => void;
  onUpdate: (values: any) => void;
}
const TokenMetaUpdateModal = ({
  onClose,
  onUpdate,
  contractHash,
  icon,
  website
}: IActionModal) => {
  const [values, setValues] = useState({
    contractHash,
    icon: icon ? icon : "",
    website: website ? website : ""
  });
  const handleValueChange = (key: string, val: string) => {
    setValues({
      ...values,
      [key]: val
    });
  };

  return (
    <Modal onClose={onClose}>
      <>
        <h1 className="title is-5">Update Token Metadata</h1>
        <p className="subtitle is-7">
          Only contract owner can see this form and able to update
        </p>
        <hr />
        <div className="field">
          <label className="label">Website</label>
          <div className="control">
            <input
              placeholder={"https://"}
              value={values.website}
              onChange={(e) => handleValueChange("website", e.target.value)}
              className="input is-shadowless"
              type="text"
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Icon url</label>
          <div className="control">
            <input
              placeholder={"https://"}
              value={values.icon}
              onChange={(e) => handleValueChange("icon", e.target.value)}
              className="input is-shadowless"
              type="text"
            />
          </div>
        </div>

        <hr />
        <button
          onClick={() => onUpdate(values)}
          disabled={!values.icon && !values.website}
          className="button is-primary"
        >
          Submit
        </button>
      </>
    </Modal>
  );
};

export default TokenMetaUpdateModal;
