import React, { useState } from "react";
import Modal from "../../../../../components/Modal";
import { ITokenStateProps } from "../scenes/TokenMain";

interface ITokenMetaUpdateModalProps {
  data: ITokenStateProps;
  onClose: () => void;
  onUpdate: (values: any) => void;
}
const TokenMetaUpdateModal = ({
  data,
  onClose,
  onUpdate,
}: ITokenMetaUpdateModalProps) => {
  const [values, setValues] = useState({
    contractHash: data.contractHash,
    icon: data.icon ? data.icon : "",
    website: data.website ? data.website : "",
  });
  const handleValueChange = (key: string, val: string) => {
    setValues({
      ...values,
      [key]: val,
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
          <label className="label">Icon</label>
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
