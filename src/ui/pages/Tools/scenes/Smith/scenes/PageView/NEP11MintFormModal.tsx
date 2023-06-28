import React, { useState } from "react";
import Modal from "../../../../../../components/Modal";

interface IActionModal {
  contractHash: string;
  onClose: () => void;
  onMint: (values: any) => void;
}
const NEP11MintFormModal = ({ onClose, onMint }: IActionModal) => {
  const [showForm, setShowForm] = useState(false);
  const [values, setValues] = useState({
    name: "",
    description: "",
    image: "",
    attributes: {}
  });
  const [attValues, setAttValues] = useState({
    key: "",
    value: ""
  });
  const handleValueChange = (key: string, val: string) => {
    setValues({
      ...values,
      [key]: val
    });
  };

  const handleAttChange = (key: string, val: string) => {
    setAttValues({
      ...attValues,
      [key]: val
    });
  };

  const handleAttributes = () => {
    if (attValues.key && attValues.value) {
      // @ts-ignore
      const attributes = values.attributes;
      attributes[attValues.key] = attValues.value;
      setValues({
        ...values,
        attributes
      });
      setAttValues({
        key: "",
        value: ""
      });
    }
  };

  const attKeys = Object.keys(values.attributes);
  return (
    <Modal onClose={onClose}>
      <>
        <h1 className="title is-5">Mint a NFT</h1>
        <p className="subtitle is-7">Only contract owner can mint</p>
        <hr />
        <div className="field">
          <label className="label">NFT Name</label>
          <div className="control">
            <input
              value={values.name}
              onChange={(e) => handleValueChange("name", e.target.value)}
              className="input"
              type="text"
            />
          </div>
        </div>
        <div className="field">
          <label className="label">NFT Description</label>
          <div className="control">
            <input
              value={values.description}
              onChange={(e) => handleValueChange("description", e.target.value)}
              className="input"
              type="text"
            />
          </div>
        </div>
        <div className="field">
          <label className="label">NFT Image</label>
          <div className="control">
            <input
              value={values.image}
              onChange={(e) => handleValueChange("image", e.target.value)}
              className="input"
              type="text"
            />
          </div>
        </div>
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <label className="label">NFT Attributes</label>
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              <button
                onClick={() => setShowForm(!showForm)}
                className="button is-dark"
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <div className="block">
          <div className="field is-grouped is-grouped-multiline">
            {attKeys.map((k) => {
              return (
                <div className="control">
                  <div className="tags has-addons">
                    <span className="tag is-dark">{k}</span>
                    <span className="tag is-info">{values.attributes[k]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showForm && (
          <div className="block">
            <div className="columns is-mobile">
              <div className="column is-5">
                <div className="control">
                  <input
                    placeholder="KEY"
                    value={attValues.key}
                    onChange={(e) => handleAttChange("key", e.target.value)}
                    className="input"
                    type="text"
                  />
                </div>
              </div>
              <div className="column">
                <div className="control is-5">
                  <input
                    placeholder="VALUE"
                    value={attValues.value}
                    onChange={(e) => handleAttChange("value", e.target.value)}
                    className="input"
                    type="text"
                  />
                </div>
              </div>
              <div className="column is-2">
                <button
                  disabled={!attValues.key || !attValues.value}
                  onClick={handleAttributes}
                  className="button"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        <hr />
        <button
          onClick={() => onMint(values)}
          disabled={!values.name || !values.description || !values.image}
          className="button is-primary"
        >
          Create
        </button>
      </>
    </Modal>
  );
};

export default NEP11MintFormModal;
