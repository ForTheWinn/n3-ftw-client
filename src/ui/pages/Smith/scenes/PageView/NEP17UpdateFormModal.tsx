import React, { useState } from "react";
import Modal from "../../../../components/Modal";

interface IActionModal {
  manifest?: {
    logo: string;
    website: string;
  };
  onClose: () => void;
  onUpdate: (values: any) => void;
}
const NEP17UpdateFormModal = ({ onClose, onUpdate, manifest }: IActionModal) => {
  const [values, setValues] = useState({
    logo: manifest ? manifest.logo : "",
    website: manifest ? manifest.website : "",
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
        <h1 className="title is-5">Edit contract</h1>
        <p className="subtitle is-7">Only contract owner can edit</p>
        <hr />
        <div className="field">
          <label className="label">Logo url</label>
          <div className="control">
            <input
              placeholder={"https://"}
              value={values.logo}
              onChange={(e) => handleValueChange("logo", e.target.value)}
              className="input"
              type="text"
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Website</label>
          <div className="control">
            <input
              placeholder={"https://"}
              value={values.website}
              onChange={(e) => handleValueChange("website", e.target.value)}
              className="input"
              type="text"
            />
          </div>
        </div>

        <hr />
        <button
          onClick={() => onUpdate(values)}
          disabled={!values.logo && !values.website}
          className="button is-primary"
        >
          Update
        </button>
      </>
    </Modal>
  );
};

export default NEP17UpdateFormModal;
